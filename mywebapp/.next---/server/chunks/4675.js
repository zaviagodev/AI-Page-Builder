"use strict";exports.id=4675,exports.ids=[4675],exports.modules={4675:(e,i,t)=>{t.d(i,{n:()=>initSite});var s=t(5270),o=t(8432);async function hashPassword(e){let i=await (0,o.hash)(e,12);return i}async function initSite(){let e;let i="admin";try{e=await (0,s.T)()}catch(e){throw Error("Connecting to the database failed.")}let t=e.db(),o=await hashPassword("demo"),a=`
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
    `;await t.collection("users").insertOne({username:i,email:"you@example.com",password:o}),await t.collection("pages").insertOne({title:"Home - Welcome",desc:"",slug:"",html:a,username:i,online:!0}),await t.collection("pages_published").insertOne({title:"Home - Welcome",desc:"",slug:"",html:a,username:i}),await e.close()}}};