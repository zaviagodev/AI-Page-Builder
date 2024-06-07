import { connectDatabase } from '../../src/db';
import { hashPassword } from '../../src/auth';

async function handler(req, res) {

    if(req.method === 'POST') {

        const data = JSON.parse(req.body)
        const token = data.token;
        const password = data.password;

        if(
            !password || password.trim().length < 7) {
            res.status(200).json({ ok:true, status: 422, error: 'Invalid input - password should be at least 7 characters long.' });
            return;
        }

        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
            return;
        }

        try {
            const db = client.db();
            const result = await db.collection('tokens').findOne({
                passwordResetToken: token
            });

            if(result) {

                if(Date.now()<=result.passwordResetExpire) {

                    const hashedPassword = await hashPassword(password);

                    const myquery = { email: result.email };
                    const newvalues = { 
                        $set: {
                            password: hashedPassword
                        } 
                    };
                    await db.collection('users').updateOne(myquery, newvalues);

                    await db.collection('tokens').deleteOne({
                        passwordResetToken: token
                    });

                    await client.close();
                    res.status(200).json({ ok:true, status: 200 });

                } else {
                    await client.close();
                    res.status(200).json({ ok:true, status: 401, error: 'Request expired.' });
                }

            } else {
                await client.close();
                res.status(200).json({ ok:true, status: 401, error: 'Request failed.' });
            }

        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }

    }

}

export default handler;