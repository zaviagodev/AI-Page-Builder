import { connectDatabase } from '../../src/db';
import { getSiteInfo } from '../../src/domain';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

async function handler(req, res) {

    if(req.method === 'POST') {

        const data = JSON.parse(req.body)
        const email = data.email;

        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
            return;
        }

        try {
            const db = client.db();

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
            }

            const user = await db.collection('users').findOne({
                email: email
            });

            if(user) {

                const resetToken = crypto.randomBytes(32).toString('hex');
                const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
                const passwordResetExpire = Date.now() + 10 * 60 * 1000; //10 min
    
                await db.collection('tokens').insertOne({
                    email: email,
                    passwordResetToken: passwordResetToken,
                    passwordResetExpire: passwordResetExpire
                });
    
                const url = process.env.NEXTAUTH_URL + '/confirm?token=' + passwordResetToken;
    
                let transporter = nodemailer.createTransport({
                    host: mailSmtp,
                    port: mailPort,
                    auth: {
                        user: mailUser,
                        pass: mailPassword
                    }
                });
    
                const mailOptions = {
                    from: mailName?`${mailName} <${mailFrom}>`: mailFrom,
                    to: email,
                    subject: 'Reset your password',
                    html: `
                    <h1>Hello</h1>
                    <p>
                        You are receiving this email because we receive a password reset request for your account.
                    </p>
                    <p>
                        <a href="${url}">Reset Password</a>
                    </p>
                    <p>
                        If you did not request a password reset, no further action is required.
                    </p>

                    <p>
                        Regards,<br>
                        Support
                    </p>
                    <hr />
                    <p style="font-size:13px">
                        If you're having trouble clicking the "Reset Password" link, copy and paste the URL below into your web browser:
                    </p>
                    <p style="font-size:13px">
                        ${url}
                    </p>
                    `,
                };
    
                transporter.sendMail(mailOptions, async (error, info)=>{
                    await client.close();
                    if (error) {
                        res.status(200).json({ ok:true, status: 500, error: 'failed to send email.' });
                    } else {
                        res.status(200).json({ ok:true, status: 200 });
                    }
                });
                
            } else {
                // Email not found
                await client.close();
                res.status(200).json({ ok:true, status: 401, error: 'User not found.' });
            }

        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }

    }

}

export default handler;