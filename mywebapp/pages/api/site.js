import { connectDatabase } from '../../src/db';
// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";

async function handler(req, res) {

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

    if(req.method === 'POST') { // Save

        const data = JSON.parse(req.body)
        const domainName = data.domainName;
        const favicon = data.favicon;
        const trackingId = data.trackingId;
        const headerSlug = data.headerSlug;
        const footerSlug = data.footerSlug;
        const noSignup = data.noSignup;
        const customDomainOnly = data.customDomainOnly;

        try {
            const db = client.db();
            const user = await db.collection('users').findOne({
                username: username
            });
            if(user) {
                const myquery = { username: username };
                let newvalues;
                if(username==='admin') {
                    newvalues = { 
                        $set: {
                            favicon: favicon,
                            trackingId: trackingId,
                            headerSlug: headerSlug,
                            footerSlug: footerSlug,
                            noSignup: noSignup,
                            // customDomainOnly: customDomainOnly
                        } 
                    };
                } else {
                    newvalues = { 
                        $set: {
                            domainName: domainName,
                            favicon: favicon,
                            trackingId: trackingId,
                            headerSlug: headerSlug,
                            footerSlug: footerSlug,
                            noSignup: noSignup,
                            customDomainOnly: customDomainOnly
                        } 
                    };
                }
                await db.collection('users').updateOne(myquery, newvalues);
            }

            await client.close();
            res.status(200).json({ ok:true, status: 200 });

        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
    } else {

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
            let domainName = '';
            let favicon = '';
            let trackingId = '';
            let headerSlug = '';
            let footerSlug = '';
            let noSignup = false;
            let mailSmtp = '';
            let mailPort = '';
            let mailUser = '';
            let mailPassword = '';
            let mailFrom = '';
            let mailName = '';
            let captchaSiteKey = '';
            let captchaSecretKey = '';
            let customDomainOnly = false;

            if(user.domainName) domainName = user.domainName;
            if(user.favicon) favicon = user.favicon;
            if(user.trackingId) trackingId = user.trackingId;
            if(user.headerSlug) headerSlug = user.headerSlug;
            if(user.footerSlug) footerSlug = user.footerSlug;
            if(user.noSignup) noSignup = user.noSignup;
            if(user.customDomainOnly) customDomainOnly = user.customDomainOnly;

            if(user.mailSmtp) mailSmtp = user.mailSmtp;
            if(user.mailPort) mailPort = user.mailPort;
            if(user.mailUser) mailUser = user.mailUser;
            if(user.mailPassword) mailPassword = user.mailPassword;
            if(user.mailFrom) mailFrom = user.mailFrom;
            if(user.mailName) mailName = user.mailName;

            if(user.captchaSiteKey) captchaSiteKey = user.captchaSiteKey;
            if(user.captchaSecretKey) captchaSecretKey = user.captchaSecretKey;

            if(username==='admin') {
                domainName=process.env.MAIN_HOST
            }

            await client.close();
            res.status(200).json({ 
                ok:true, 
                status: 200, 
                domainName: domainName, 
                favicon: favicon, 
                trackingId: trackingId,
                headerSlug: headerSlug,
                footerSlug: footerSlug,
                noSignup: noSignup,
                customDomainOnly: customDomainOnly,
                mailSmtp: mailSmtp,
                mailPort: mailPort,
                mailUser: mailUser,
                mailPassword: mailPassword,
                mailFrom: mailFrom,
                mailName: mailName,
                captchaSiteKey: captchaSiteKey,
                captchaSecretKey: captchaSecretKey,
            });
            
        } catch(e) {
            await client.close();
            res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
    }
}

export default handler;
