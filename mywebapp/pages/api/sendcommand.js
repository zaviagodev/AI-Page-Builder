import { connectDatabase } from '../../src/db';
// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";
import axios from 'axios';

async function handler(req, res) {

    if(req.method !== 'POST') return;

    // const session = await getSession( { req: req } );
    // if(!session) {
    //     res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
    //     return;
    // }

    const token = await getToken({ req })
    if (!token) {
        res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
        return;
    }
    const username = token.name;

    let client;
    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
        return;
    }

    try {
       
        const db = client.db();
        const user = await db.collection('users').findOne({
            username: username
        });
        if(!user) {
            client.close();
            res.status(200).json({ ok:true, status: 401, error: 'User not found.' });
            return;
        }

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        const url = 'https://api.openai.com/v1/chat/completions';
        const model = 'gpt-3.5-turbo';
        const DEFAULT_TEMPERATURE = 0.6;
        const DEFAULT_TOP_P = 0.9;
        const DEFAULT_NUM = 1;

        const { question, context, system, functs, temperature, topP, num } = req.body;

        const messages = [
            { role: 'system', content: system },
            { role: 'assistant', content: context || '' },
            { role: 'user', content: question }
        ];
        
        try {

            const response = await axios.post(url, {
                model,
                messages,
                temperature: parseFloat(temperature) || DEFAULT_TEMPERATURE,
                top_p: parseFloat(topP) || DEFAULT_TOP_P,
                n: parseInt(num) || DEFAULT_NUM,
                functions: functs.length === 0 ? undefined : functs
            }, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
            });

            let answer = functs.length === 0
            ? response.data
            : (response.data.choices[0].message.function_call ? 
                response.data.choices[0].message.function_call.arguments 
                : response.data.choices[0].message );
        
            res.json({ answer });
            
        } catch (error) {
            // res.status(500).json({ error: 'An error occurred while fetching the answer.' });
            res.json({ error: error.message }); // Shows error
        }

    } catch(e) {
        await client.close();
        res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
    }

}

export default handler;
