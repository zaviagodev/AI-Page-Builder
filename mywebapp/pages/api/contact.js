import { connectDatabase } from '../../src/db';
import { getSiteInfo } from '../../src/domain';
import nodemailer from 'nodemailer';
const fetch = require('isomorphic-fetch');

async function handler(req, res) {

    if(req.method === 'POST') {

        const data = JSON.parse(req.body)
        const name = data.name;
        const email = data.email;
        const message = data.message;
        const token = data.token;

        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
            return;
        }

        try {
            const db = client.db();

            let siteOwnerEmail;
            let secretKey;
            let mailSmtp = process.env.EMAIL_SMTP?process.env.EMAIL_SMTP:'';
            let mailPort = process.env.EMAIL_PORT?process.env.EMAIL_PORT:'';
            let mailUser = process.env.EMAIL_USER?process.env.EMAIL_USER:'';
            let mailPassword = process.env.EMAIL_PASSWORD?process.env.EMAIL_PASSWORD:'';
            let mailFrom = process.env.EMAIL_FROM?process.env.EMAIL_FROM:'';
            let mailName = process.env.EMAIL_NAME?process.env.EMAIL_NAME:'';

            const site = await getSiteInfo(req.headers.host)
            if(site) {
                if(site.mailSmtp) mailSmtp = site.mailSmtp;
                if(site.mailPort) mailPort = site.mailPort;
                if(site.mailUser) mailUser = site.mailUser;
                if(site.mailPassword) mailPassword = site.mailPassword;
                if(site.mailFrom) mailFrom = site.mailFrom;
                if(site.mailName) mailName = site.mailName;
                siteOwnerEmail = site.email;

                secretKey = site.captchaSecretKey; 

                const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
                let response = await fetch(url);
                response = await response.json();
                if(response.success !== undefined && !response.success) {
                    await client.close();
                    res.status(200).json({ ok:true, status: 401, error: 'Failed captcha verification.' });
                    return;
                }

                let transporter = nodemailer.createTransport({
                    host: mailSmtp,
                    port: mailPort,
                    auth: {
                        user: mailUser,
                        pass: mailPassword
                    }
                });

                const fromInfo = name? `${name} (${email})`:email;

                const mailOptions = {
                    from: mailName?`${mailName} <${mailFrom}>`: mailFrom,
                    to: siteOwnerEmail,
                    subject: 'Incoming Message',
                    html: `
                    <p>
                        From: ${fromInfo}
                    </p>
                    <p>
                        ${message}
                    </p>
                    `,
                };
    
                transporter.sendMail(mailOptions, async (error, info) => {
                    await client.close();
                    if (error) {
                        res.status(200).json({ ok:true, status: 500, error: 'failed to send email.' });
                    } else {
                        res.status(200).json({ ok:true, status: 200 });
                    }
                });

            } else {
                await client.close();
                res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
            }


        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
    }
}

export default handler;
