import { connectDatabase } from './db';
import { hashPassword } from './auth';

export async function initSite() {

    // Insitial data:
    const username = 'admin';
    const email = 'you@example.com';
    const password = 'demo';

    let client;
    try {
        client = await connectDatabase();
    } catch (error) {
        throw new Error('Connecting to the database failed.');
    }

    const db = client.db();

    const hashedPassword = await hashPassword(password);

    const html = `
<div class="is-section is-box is-section-100 type-opensans box-space">
    <div class="is-overlay" style="background-color: rgb(247, 247, 247);"></div>
    <div class="is-boxes">
        <div class="is-box-centered is-opacity-95">
            <div class="is-container v2 container is-content-980" style="max-width: 980px;">
                <div class="row clearfix">
                    <div class="column full">
                        <div class="display">
                            <p style="font-weight: 600; color: rgb(145, 145, 145);" class="size-16">Welcome!</p>
                            <h1 class="size-140" style="line-height: 1; text-transform: capitalize; text-align: left; letter-spacing: 2px; font-weight: 700;">Site Builder Kit</h1>
                        </div>
                    </div>
                </div>
                <div class="row clearfix">
                    <div class="column full">
                        <div class="spacer height-40"></div>
                    </div>
                </div>
                <div class="row clearfix">
                    <div class="column third" style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
                        <div class="spacer height-80"></div>
                    </div>
                    <div class="column two-third">
                        <div style="text-align: right;">
                            <a href="signup" style="display: inline-block; text-decoration: none; transition: all 0.16s ease 0s; border-style: solid; cursor: pointer; background-color: rgba(0, 0, 0, 0); color: rgb(0, 0, 0); border-color: rgba(0, 0, 0, 0); border-width: 2px; border-radius: 0px; padding: 10px 22px; line-height: 1.5; text-transform: uppercase; font-weight: 600; font-size: 12px; letter-spacing: 3px;" title=""><u>Signup</u></a> &nbsp;
                            <a href="login" style="display: inline-block; text-decoration: none; transition: all 0.16s ease 0s; border-style: solid; cursor: pointer; background-color: rgba(0, 0, 0, 0); border-color: rgb(53, 53, 53); border-width: 2px; border-radius: 0px; padding: 10px 22px; line-height: 1.5; text-transform: uppercase; font-weight: 600; font-size: 12px; letter-spacing: 3px; color: rgb(53, 53, 53);" title="">Login</a>
                        </div>
                        <p style="text-align: justify;">This is the initial home page of Site Builder Kit. To get started, please login using your admin account. After logged in, you can add, edit or delete your website pages. Remember to change your password after logged in.&nbsp;</p>
                        <p style="text-align: justify;">Users can also signup and create their own website with custom domain and auto SSL support. Site Builder Kit provides you with a step-by-step guide from setting-up your server to developing a site builder app, complete with a ready working project (this site) to get started.</p>

                    </div>

                </div>
            </div>
        </div>
    </div>
</div>    
    `;

    await db.collection('users').insertOne({
        username: username,
        email: email,
        password: hashedPassword
    });

    await db.collection('pages').insertOne({
        title: 'Home - Welcome',
        desc: '',
        slug: '',
        html: html,
        username: username,
        online: true
    });

    await db.collection('pages_published').insertOne({
        title: 'Home - Welcome',
        desc: '',
        slug: '',
        html: html,
        username: username,
    });

    await client.close();
}