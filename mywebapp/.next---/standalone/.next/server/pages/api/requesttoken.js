"use strict";(()=>{var e={};e.id=1591,e.ids=[1591],e.modules={8013:e=>{e.exports=require("mongodb")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5184:e=>{e.exports=require("nodemailer")},2468:(e,s,t)=>{t.r(s),t.d(s,{config:()=>w,default:()=>h,routeModule:()=>_});var r={};t.r(r),t.d(r,{default:()=>m});var a=t(1802),o=t(7153),n=t(6249),i=t(3919),l=t(133),p=t(5184),u=t.n(p);let c=require("crypto");var d=t.n(c);async function handler(e,s){if("POST"===e.method){let t;let r=JSON.parse(e.body),a=r.email;try{t=await (0,i.T)()}catch(e){s.status(200).json({ok:!0,status:500,error:"Connecting to the database failed."});return}try{let r=t.db(),o=process.env.EMAIL_SMTP?process.env.EMAIL_SMTP:"",n=process.env.EMAIL_PORT?process.env.EMAIL_PORT:"",i=process.env.EMAIL_USER?process.env.EMAIL_USER:"",p=process.env.EMAIL_PASSWORD?process.env.EMAIL_PASSWORD:"",c=process.env.EMAIL_FROM?process.env.EMAIL_FROM:"",m=process.env.EMAIL_NAME?process.env.EMAIL_NAME:"",h=await (0,l.a)(e.headers.host);h&&(h.mailSmtp&&(o=h.mailSmtp),h.mailPort&&(n=h.mailPort),h.mailUser&&(i=h.mailUser),h.mailPassword&&(p=h.mailPassword),h.mailFrom&&(c=h.mailFrom),h.mailName&&(m=h.mailName));let w=await r.collection("users").findOne({email:a});if(w){let e=d().randomBytes(32).toString("hex"),l=d().createHash("sha256").update(e).digest("hex"),h=Date.now()+6e5;await r.collection("tokens").insertOne({email:a,passwordResetToken:l,passwordResetExpire:h});let w=process.env.NEXTAUTH_URL+"/confirm?token="+l,_=u().createTransport({host:o,port:n,auth:{user:i,pass:p}}),f={from:m?`${m} <${c}>`:c,to:a,subject:"Reset your password",html:`
                    <h1>Hello</h1>
                    <p>
                        You are receiving this email because we receive a password reset request for your account.
                    </p>
                    <p>
                        <a href="${w}">Reset Password</a>
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
                        ${w}
                    </p>
                    `};_.sendMail(f,async(e,r)=>{await t.close(),e?s.status(200).json({ok:!0,status:500,error:"failed to send email."}):s.status(200).json({ok:!0,status:200})})}else await t.close(),s.status(200).json({ok:!0,status:401,error:"User not found."})}catch(e){await t.close(),s.status(200).json({ok:!0,status:500,error:"Something went wrong."})}}}let m=handler,h=(0,n.l)(r,"default"),w=(0,n.l)(r,"config"),_=new a.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/requesttoken",pathname:"/api/requesttoken",bundlePath:"",filename:""},userland:r})}};var s=require("../../webpack-api-runtime.js");s.C(e);var __webpack_exec__=e=>s(s.s=e),t=s.X(0,[4222,3919,133],()=>__webpack_exec__(2468));module.exports=t})();