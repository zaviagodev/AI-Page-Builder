import Script from 'next/script';

export function RenderStyles(props) {
    return <>
        {/* <meta name="generator" content="TEST" /> */}

        { 
        /* Render mainCss */
        props.mainCss?props.mainCss.split('<link').map((string,i)=>{ // extract each link found
            if(string!=='') {
            string = '<link' + string;

            let s = string.split('href="')[1];
            const href = s.substring(0, s.indexOf('"'));
            
            return (
                <link key={href+i} href={href} rel="stylesheet" />
            );
            }
        }):null
        }

        { /* Render sectionCss */
        props.sectionCss?props.sectionCss.split('<link').map((string,i)=>{
            if(string!=='') {
            string = '<link' + string;

            let s = string.split('href="')[1];
            const href = s.substring(0, s.indexOf('"'));

            s = string.split('data-class="')[1];
            const className = s.substring(0, s.indexOf('"'));
            
            return (
                <link key={className+i} data-name="contentstyle" data-class={className} href={href} rel="stylesheet" />
            );
            }
        }):null
        }
    </>
}

export function RenderMoreStyles(props) {
    return <>
        {
        props.html.indexOf('glide__slides')!==-1? <>
            <link href="/assets/scripts/glide/css/glide.core.css" rel="stylesheet" />
            <link href="/assets/scripts/glide/css/glide.theme.css" rel="stylesheet" />
        </>
        :null
        }   
        
        {
        props.html.indexOf('is-section-navbar')!==-1? <>
            <link href="/assets/scripts/navbar/navbar.css" rel="stylesheet" />
        </>
        :null
        }       
    </>;
}


export function RenderMoreScripts(props) {
    return <>
    {
    props.html.indexOf('glide__slides')!==-1? <>
        <Script src="/assets/scripts/glide/glide.js" strategy="beforeInteractive" />
    </>
    :null
    }   
    
    {
    props.html.indexOf('is-section-navbar')!==-1? <>
        <Script src="/assets/scripts/navbar/navbar.min.js" strategy="beforeInteractive" />
    </>
    :null
    }       
</>;
}

export function RenderCssIncludes(props) {
    return <>
    { 
        props.cssIncludes?props.cssIncludes.map((x, i) => {
            return (
                (x.css?<link key={`list${i}`} href={x.css} rel="stylesheet" />:null)
            );
        }):null
    }     
</>;
}

export function RenderJsIncludes(props) {
    return <>
    { 
        props.jsIncludes?props.jsIncludes.map((x, i) => {
            return (
                (x.js?<Script key={`list${i}`} src={x.js} strategy={x.head?'beforeInteractive':'afterInteractive'} />:null)
            );
        }):null
    }     
</>;
}

export function getAllClasses(props) {
    let allClasses = [];
    const elements = [];
    const findTag = /<[^\/].*?>/g;
    let element;
    while(element = findTag.exec(props.html)){
        element = element[0];
        const id = (element.match(/id="(.*?)"/i) || [, ""])[1];
        let classes = (element.match(/class="(.*?)"/i) || [,""])[1].split(' ');
        element = {};
        element["id"] = id;
        element["class"] = classes;
        classes.map((item) => {
            if(item) allClasses.push(item);
        });
        elements.push(element);
    }
    allClasses = [...new Set(allClasses)]; // remove duplicates
    return allClasses;
}