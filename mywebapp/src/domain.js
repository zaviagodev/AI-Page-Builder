import { connectDatabase } from '../src/db';

export async function getSiteByDomain(context) {
  // Check requested domain name
  let host = '';
  const { req } = context;
  if (req) host = req.headers.host; //yourdomain.com
  
  let isMainHost = false;
  if(host === process.env.MAIN_HOST || host === 'www.' + process.env.MAIN_HOST) isMainHost = true;

  // Protection
  let client = await connectDatabase();
  const db = client.db();
  let site;
  let domainName = '';
  let owner = '';
  let noSignup;
  if(!isMainHost) {
    site = await db.collection('users').findOne({
      domainName: host.toLowerCase().replace('www.','')
    });
    if(!site) { // if domain is not registered
      await client.close();
      return {
        props:{
          invalidDomain: true
        },
      };
    } else {
      domainName = site.domainName;
      owner = site.username;
    }
  } else {
    site = await db.collection('users').findOne({
      username:'admin'
    });
    domainName = host.toLowerCase();
    owner = 'admin';
    noSignup = site.noSignup?site.noSignup:false
  }

  await client.close();
  return { 
    props: { 
      mainHost: isMainHost,
      domainName: domainName,
      owner: owner,
      noSignup: noSignup,

      captchaSiteKey: site?site.captchaSiteKey?site.captchaSiteKey:'':'',
     } 
  };
}

export async function getSiteInfo(host) {

  let isMainHost = false;
  if(host === process.env.MAIN_HOST || host === 'www.' + process.env.MAIN_HOST) isMainHost = true;

  let client = await connectDatabase();
  const db = client.db();

  let site;
  if(!isMainHost) {
      site = await db.collection('users').findOne({
          domainName: host.toLowerCase().replace('www.','')
      });
      await client.close();
      if(!site) { // domain is not found
          return false;
      } else {
          return site;
      }
  } else {
      site = await db.collection('users').findOne({
          username:'admin'
      });
      await client.close();
      return site;
  }
}