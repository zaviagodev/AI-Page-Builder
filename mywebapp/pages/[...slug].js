import { connectDatabase } from '../src/db';
import Head from 'next/head';
import Script from 'next/script';
import { initSite } from '../src/initsite';
import { RenderStyles, RenderMoreStyles, RenderMoreScripts, RenderCssIncludes, RenderJsIncludes } from '../src/render';
// import CookieConsent from "react-cookie-consent";

function Home(props) {

  if (props.invalidDomain) {
    return <>
      <p>Invalid Domain</p>
      <p>{props.host}</p>
    </>;
  } else if (props.notFound) {
    return <>
      <Head>
        <title>404</title>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <h1>404</h1>
      <p>Oops! Page Not Found.</p>
    </>
  } else {
    if (props.mainHost && props.siteOwner !== 'admin' && props.customDomainOnly) {
      return <></>
    }
    return <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.desc} />
        <link rel="icon" href={props.favicon ? props.favicon : '/images/favicon.ico'} />

        {
          props.title ? <meta property="og:title" content={props.title} />
            : null
        }
        {
          props.desc ? <meta property="og:og:description" content={props.desc} />
            : null
        }
        {
          props.socialImage ? <meta property="og:image" content={props.socialImage} />
            : null
        }
      </Head>

      <RenderCssIncludes cssIncludes={[
        { css: "/assets/minimalist-blocks/content.css" },
        { css: "/box/box-flex.css" }]} />

      {/* Render mainCss & sectionCss */}
      <RenderStyles mainCss={props.mainCss} sectionCss={props.sectionCss} />

      {/* Render slider or navbar css if exist in content */}
      <RenderMoreStyles html={props.html} />

      <RenderCssIncludes cssIncludes={props.cssIncludes} />

      { /* Style Embed */
        props.css ? <>
          <style dangerouslySetInnerHTML={{ __html: props.css }} />
        </> : null
      }

      {/* Render HTML */}
      <div className="is-wrapper" dangerouslySetInnerHTML={{ __html: props.html }} />

      {/* <CookieConsent containerClasses="cookie-consent">
        This website uses cookies to enhance the user experience.
      </CookieConsent> */}

      <Script src="/box/box-flex.js" />

      {/* <Script src="/assets/scripts/glide/glide.js" />
            <Script src="/assets/scripts/navbar/navbar.min.js" /> */}
      <RenderMoreScripts html={props.html} />

      <RenderJsIncludes jsIncludes={props.jsIncludes} />

      { /* Javascript Embed */
        props.js ? <>
          <Script id="jsembed" strategy="afterInteractive">
            {props.js}
          </Script>
        </> : null
      }

      <Script src={`https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.10/SmoothScroll.min.js`}
        strategy="afterInteractive" />

      { /* Analytic */
        props.trackingId ? <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${props.trackingId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${props.trackingId}');
                `}
          </Script>
        </> : null
      }
    </>
  }
}

export async function getServerSideProps(context) {

  //Reading requested URL: yourdomain.com/part1/part2/part3/part4
  let part1, part2, part3, part4;
  if (context.query.slug) [part1, part2, part3, part4] = context.query.slug;

  let siteOwner;
  let slug = '';
  let invalidRequest = false;
  if (!part1) {
    // Example request: yourdomain.com => requesting home page (owner: admin)
    siteOwner = 'admin';
  } else if (part1 === 'site' && part2 && !part3) {
    // Example request: yourdomain.com/site/john => requesting home page (owner: john)
    siteOwner = part2;
  } else if (part1 && !part2) {
    // Example request: yourdomain.com/contact => requesting contact page (owner: admin)
    siteOwner = 'admin';
    slug = part1;
  } else if (part1 === 'site' && part2 && part3) {
    // Example request: yourdomain.com/site/john/contact => requesting contact page (owner: john)
    siteOwner = part2;
    slug = part3;
    if (part4) {
      // Invalid Request (only part1, part2 & part3 is valid for user pages)
      invalidRequest = true;
    }
  }

  let client = await connectDatabase();
  const db = client.db();

  // Check requested domain name
  let host = '';
  const { req } = context;
  if (req) host = req.headers.host; //yourdomain.com

  let isMainHost = false;
  if (host === process.env.MAIN_HOST || host === 'www.' + process.env.MAIN_HOST) isMainHost = true;

  let site;
  if (isMainHost) {
    site = await db.collection('users').findOne({
      username: siteOwner
    });
    if (!site) {
      if (siteOwner === 'admin') {
        // Database still empty
        await initSite();
        site = await db.collection('users').findOne({
          username: siteOwner
        });
      } else {
        await client.close();
        return {
          props: {
            notFound: true,
          }
        };
      }
    }

    if (siteOwner !== 'admin' && slug === '') {
      await client.close();
      return {
        redirect: { permanent: false, destination: `/site/${siteOwner}/index` }, props: {},
      }
    }

  } else {
    // Check requested user's custom domain
    site = await db.collection('users').findOne({
      domainName: host.toLowerCase().replace('www.', '')
    });
    if (site) {
      siteOwner = site.username;
      if (part1) slug = part1;
      if (part2) {
        // Invalid Request (only part1 is valid for user page from a custom domain)
        invalidRequest = true;
      }
    } else {
      await client.close();
      return {
        props: {
          host: req.headers.host,
          mainHost: process.env.MAIN_HOST,
          invalidDomain: true
        },
      };
    }
  }

  let page;
  if (siteOwner) {
    // Get the requested home page
    if (!invalidRequest) {
      page = await db.collection('pages_published').findOne({
        username: siteOwner,
        slug: slug === 'index' ? '' : slug
      });
    }

    // Display 'Page Not Found' without redirect (needs to create a page with slug: 404)
    if (!page) {
      page = await db.collection('pages_published').findOne({
        username: siteOwner,
        slug: '404'
      });
      if (page) {
        await client.close();
        return {
          props: {
            siteOwner: siteOwner ? siteOwner : '',
            favicon: site ? site.favicon ? site.favicon : '' : '',
            trackingId: site ? site.trackingId ? site.trackingId : '' : '',
            customDomainOnly: site ? site.customDomainOnly ? site.customDomainOnly : '' : '',
            slug: slug,
            title: page ? page.title : '',
            desc: page ? page.desc : '',
            socialImage: page ? page.socialImage ? page.socialImage : '' : '',
            html: page ? page.html : '',
            mainCss: page ? page.mainCss ? page.mainCss : '' : '',
            sectionCss: page ? page.sectionCss ? page.sectionCss : '' : '',
            cssIncludes: page ? page.cssIncludes ? page.cssIncludes : '' : '',
            jsIncludes: page ? page.jsIncludes ? page.jsIncludes : '' : '',
            css: page ? page.css ? page.css : '' : '',
            js: page ? page.js ? page.js : '' : '',
            notFound: false,
          }
        };
      }
    }

    // If page with slug=404 not exists, use redirect.
    if (!page && slug !== 'notfound') {
      await client.close();
      // Redirect (needs to create a page with slug=notfound, otherwise, use default 404 message)
      return {
        // redirect: { permanent: false, destination: 'notfound' }, props:{},
        redirect: { permanent: false, destination: '/notfound' }, props: {},
        /*
        use relative to root / to prevent too many redirect (ex. /abc/def/notfound)
        So /notfound works on custom domain only.
        On main domain, it will use main site's /notfound
        */
      };
    }
  } else {
    await client.close();
    return {
      redirect: { permanent: false, destination: '/notfound' }, props: {},
    };
  }

  let headerHtml = '';
  let headerSectionCss = '';
  let footerHtml = '';
  let footerSectionCss = '';
  if (site && page) {
    if (!page.blank) {
      if (site.headerSlug) {
        const header = await db.collection('pages_published').findOne({
          username: siteOwner,
          slug: site.headerSlug
        });
        if (header) {
          headerHtml = header.html;
          headerSectionCss = header.sectionCss;
        }
      }
      if (site.footerSlug) {
        const footer = await db.collection('pages_published').findOne({
          username: siteOwner,
          slug: site.footerSlug
        });
        if (footer) {
          footerHtml = footer.html;
          footerSectionCss = footer.sectionCss;
        }
      }
    }
  }

  /*
  if(site) {
    // An internal feature to make a site can only be opened using custom domain.
    // It will check if customDomainOnly field is set to true in users collection database.
    if(isMainHost && siteOwner!=='admin' && site.customDomainOnly) {
      throw new Error('This site is enabled using custom domain only.');
    }
  }
  */

  await client.close();

  return {
    props: {
      mainHost: isMainHost,
      siteOwner: siteOwner ? siteOwner : '',
      favicon: site ? site.favicon ? site.favicon : '' : '',
      trackingId: site ? site.trackingId ? site.trackingId : '' : '',
      customDomainOnly: site ? site.customDomainOnly ? site.customDomainOnly : '' : '',
      slug: slug,
      title: page ? page.title : '',
      desc: page ? page.desc : '',
      socialImage: page ? page.socialImage ? page.socialImage : '' : '',
      html: headerHtml + (page ? page.html : '') + footerHtml,
      mainCss: page ? page.mainCss ? page.mainCss : '' : '',
      sectionCss: (page ? page.sectionCss ? page.sectionCss : '' : '') + headerSectionCss + footerSectionCss,
      cssIncludes: page ? page.cssIncludes ? page.cssIncludes : '' : '',
      jsIncludes: page ? page.jsIncludes ? page.jsIncludes : '' : '',
      css: page ? page.css ? page.css : '' : '',
      js: page ? page.js ? page.js : '' : '',
      notFound: page ? false : true,
    }
  };
}

export default Home;
