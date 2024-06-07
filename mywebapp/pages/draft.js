import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { connectDatabase } from '../src/db';
import { getSiteByDomain } from '../src/domain';
import { RenderCssIncludes, RenderJsIncludes } from '../src/render';

export default function Home(props) {

    const [baseHref, setBaseHref] = useState('');

    useEffect(()=>{
        builder();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook

    async function builder() {

        const session = await getSession();
        if(!session) return;

        if(props.mainHost && session.user.name!=='admin') setBaseHref('/site/' + session.user.name + '/')

        // addExternalStyles([
        //     '/contentbox/contentbox.css',
        //     '/contentbuilder/contentbuilder.css'
        // ]);

        //Get slug from query string ?page=slug
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let slug = params.get('page');
        if(!slug) slug = '';
        
        const reqBody = { slug };
        let result = await fetch('/api/content', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            //Load content
            const html = result.content.html || '';
            const mainCss = result.content.mainCss || '';
            const sectionCss = result.content.sectionCss || '';
            const css = result.content.css || '';
            const js = result.content.js || '';
            
            document.head.insertAdjacentHTML('afterbegin', `
                <link rel="stylesheet" href="/assets/minimalist-blocks/content.css" />
            `); // see below line 150. Place content.css here so that it can be overridden by basetype-* css
            document.head.insertAdjacentHTML('beforeend', mainCss);
            document.head.insertAdjacentHTML('beforeend', sectionCss);
            embedStyles(css);
            embedScript(js);
            renderHtml(html);

            // Add required scripts for viewing the content
            addExternalScripts(['/box/box-flex.js']);
        }
    }

    function addExternalScripts(arrScript, callback) {
        if(arrScript.length===0) {
            if(callback) callback();
            return;
        } else {
            const url = arrScript[0];
            const includes = document.head.querySelectorAll('script');
            includes.forEach((link) => {
                if(link.src.indexOf(url)!==-1) {
                    link.parentNode.removeChild(link); // Remove existing
                }
            });
            const script = document.createElement('script');
            script.onload = () =>{
                addExternalScripts(arrScript.slice(1), callback);
            };
            script.src = url;
            document.head.appendChild(script);
        } 
    }

    function addExternalStyles(arrStyle) {
        const includes = document.head.querySelectorAll('[data-my-css-link]');
        includes.forEach((link) => {
            link.parentNode.removeChild(link); // Remove existing
        });
        for(let i=0;i<=arrStyle.length-1;i++){
            const url = arrStyle[i];
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.setAttribute('data-my-css-link','');
            link.href = url;
            document.head.appendChild(link);
        }
    }
    
    function renderHtml(html) {
        let range = document.createRange()
        const wrapper = document.querySelector('.is-wrapper')
        wrapper.innerHTML = ''
        wrapper.appendChild(range.createContextualFragment(html)) // We use createContextualFragment so that embedded javascript code (code block) will be executed
        wrapper.style.opacity=1;
    }

    function embedStyles(css) {
        const prevElm = document.head.querySelector('#embedstyle');
        if(prevElm) prevElm.parentNode.removeChild(prevElm); // Remove existing

        const elm = document.createElement('style');
        elm.setAttribute('id','embedstyle')
        elm.innerText = css;
        document.head.appendChild(elm);
    }

    function embedScript(js) {
        const prevElm = document.head.querySelector('#embedscript');
        if(prevElm) prevElm.parentNode.removeChild(prevElm); // Remove existing

        const elm = document.createElement('script');
        elm.setAttribute('id','embedscript')
        elm.innerText = js;

        let range = document.createRange()
        document.body.appendChild(range.createContextualFragment(`<script>
            ${js}
        </script>`))
  
    }

    if(props.invalidDomain) {
        return <>Invalid Domain</>;
    }

    return (
        <>
            <Head>
                <base href={baseHref} />
                <title>View Draft</title>
                <meta name="description" content="Edit Content" />
                <link rel="icon" href="/images/favicon.ico" />
            </Head>

            <RenderCssIncludes cssIncludes={[
            //   { css: "/assets/minimalist-blocks/content.css" }, // tailwind: content-tailwind.css
              { css: "/box/box-flex.css" },
              { css: "/assets/scripts/glide/css/glide.core.css" },
              { css: "/assets/scripts/glide/css/glide.theme.css" },
              { css: "/assets/scripts/navbar/navbar.css" }]}/>

            <RenderCssIncludes cssIncludes={props.cssIncludes}/>

            <div className="is-wrapper" style={{opacity:0}}>
            </div>
            
            <RenderJsIncludes jsIncludes={props.jsIncludes}/>
            <Script src="assets/scripts/glide/glide.js" />
            <Script src="/assets/scripts/navbar/navbar.min.js" />

        </>
    )
}

export async function getServerSideProps(context) {
    const site = await getSiteByDomain(context);
    const mainHost = site.props.mainHost;
    const domainName = site.props.domainName;
    const owner = site.props.owner;
    const slug = context.query.page;

    let client = await connectDatabase();
    const db = client.db();
    const page = await db.collection('pages').findOne({
        username: owner,
        slug: slug
    });

    await client.close();
    
    return { 
        props: { 
            mainHost: mainHost,
            domainName: domainName,
            owner: owner,
            cssIncludes: page?page.cssIncludes?page.cssIncludes:'':'',
            jsIncludes: page?page.jsIncludes?page.jsIncludes:'':'',
            captchaSiteKey: site.props.captchaSiteKey,
        } 
    };
}