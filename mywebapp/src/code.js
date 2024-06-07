import { Fragment, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Editor from "@monaco-editor/react";
import Notif from './notif';
import { Tab } from '@headlessui/react';
import stylesDashboard from '../styles/Dashboard.module.css';

function Code(props) {
    const [notif, setNotif] = useState({});

    const [dataLoaded, setDataLoaded] = useState(false);
    const [open, setOpen] = useState(true);

    const htmlEditorRef = useRef(null);
    const cssEditorRef = useRef(null);
    const jsEditorRef = useRef(null);
    const iframeRef = useRef(null);

    const [draft, setDraft] = useState('');
    const [activeEditor, setActiveEditor] = useState('');
    const [htmlcode, setHtmlCode] = useState('');
    const [csscode, setCssCode] = useState('');
    const [jscode, setJsCode] = useState('');

    const refPreviewArea = useRef(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(()=>{
        loadPage();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook

    async function loadPage() {
        //Get slug from query string ?page=slug
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let slug = params.get('page');
        if(!slug) slug = '';

        setDraft(`draft?page=${slug}`);

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

            const html = result.content.html || '';
            const css = result.content.css || '';
            const js = result.content.js || '';

            setDataLoaded(true);

            setActiveEditor('html'); //specify which to display first

            setHtmlCode(html);
            setCssCode(css);
            setJsCode(js);

        }
    }

    function refreshHandler() {
        iframeRef.current.src = iframeRef.current.src;
    }

    function closeHandler() {
        setOpen(false)
    }

    function openHandler() {
        setOpen(true)
    }

    async function saveHandler() {

        //Get slug from query string ?page=slug
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let slug = params.get('page');
        if(!slug) slug = '';

        const reqBody = { slug: slug, html: htmlcode, css: csscode, js: jscode };
        let result = await fetch('/api/code', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setNotif({});
            iframeRef.current.src = iframeRef.current.src;
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    async function publishHandler() {

        //Get slug from query string ?page=slug
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let slug = params.get('page');
        if(!slug) slug = '';

        const reqBody = { slug: slug, html: htmlcode, css: csscode, js: jscode };
        let result = await fetch('/api/codepublish', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setNotif({});
            iframeRef.current.src = iframeRef.current.src;
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
        
    }

    function htmlEditorMountHandler(editor, monaco) {
        htmlEditorRef.current = editor; 
        htmlEditorRef.current?.focus();
    }

    function cssEditorMountHandler(editor, monaco) {
        cssEditorRef.current = editor; 
    }

    function jsEditorMountHandler(editor, monaco) {
        jsEditorRef.current = editor; 
    }

    function htmlEditorChangeHandler(value, event) {
        setHtmlCode(value);
        // setHtmlCode(htmlEditorRef.current.getValue());
    }

    function cssEditorChangeHandler(value, event) {
        setCssCode(value);
        // setCssCode(cssEditorRef.current.getValue());
    }

    function jsEditorChangeHandler(value, event) {
        setJsCode(value);
        // setJsCode(jsEditorRef.current.getValue());
    }

    function selectViewHandler(value) {
        if(value===0) {
            refPreviewArea.current.style.width = '1680px';
            refPreviewArea.current.style.height = 'calc(100vh - 175px)';
        } else if(value===1) {
            refPreviewArea.current.style.width = '1024px';
            refPreviewArea.current.style.height = 'calc(100vh - 175px)';
        } else if(value===2) {
            refPreviewArea.current.style.width = '448px';
            refPreviewArea.current.style.height = 'calc(100vh - 175px)';
        }
        setSelectedIndex(value)
    }

    return <>
        <Head>
            <title>Code Editor</title>
            <meta name="description" content="Edit Content" />
            <link rel="icon" href="/images/favicon.ico" />
        </Head>

        <Tab.Group selectedIndex={selectedIndex} onChange={selectViewHandler}>
            <div className='absolute top-3 flex justify-center items-start h-10'>
            <Tab.List className="flex relative z-10 justify-center p-1 space-x-3 bg-gray-100/75 w-50 rounded-lg">
                <Tab as={Fragment}>
                {({ selected }) => (
                    <button title='Desktop' className={selected ? stylesDashboard.tabactive : stylesDashboard.tab}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-desktop" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <rect x="3" y="4" width="18" height="12" rx="1"></rect>
                        <line x1="7" y1="20" x2="17" y2="20"></line>
                        <line x1="9" y1="16" x2="9" y2="20"></line>
                        <line x1="15" y1="16" x2="15" y2="20"></line>
                    </svg>
                    </button>
                )}
                </Tab>
                <Tab as={Fragment}>
                {({ selected }) => (
                    <button title='tablet' className={selected ? stylesDashboard.tabactive : stylesDashboard.tab}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-tablet" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <rect x="5" y="3" width="14" height="18" rx="1"></rect>
                        <circle cx="12" cy="17" r="1"></circle>
                    </svg>
                    </button>
                )}
                </Tab>
                <Tab as={Fragment}>
                {({ selected }) => (
                    <button title='mobile' className={selected ? stylesDashboard.tabactive : stylesDashboard.tab}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-mobile" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <rect x="6" y="3" width="12" height="18" rx="2"></rect>
                        <line x1="11" y1="4" x2="13" y2="4"></line>
                        <line x1="12" y1="17" x2="12" y2="17.01"></line>
                    </svg>
                    </button>
                )}
                </Tab>
            </Tab.List>
            </div>
        </Tab.Group>

        <div ref={refPreviewArea} className={'overflow-hidden shadow-xl rounded-2xl'} style={{width:'1680px', transition: 'all 600ms ease'}}>
            <div className="bg-gray-200 rounded-t-lg h-7"></div>
            <iframe ref={iframeRef} className='w-full h-[calc(100vh_-_175px)]' src={draft}></iframe>
        </div>
        
        <div className={`${open?'h-[577px]':'h-[0px] opacity-[0]'} flex justify-between flex-col overflow-hidden origin-bottom-right ease-in-out transition-all duration-290 fixed bottom-7 right-10 bg-white drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)] rounded overflow-hidden`}>
            
            <div className='flex space-x-3 p-4 justify-between z-[100]'>
                <div className='flex space-x-3'>
                    <button className="button-normal"
                        disabled={activeEditor === 'html'}
                        onClick={() => setActiveEditor('html')}>HTML</button>
                    <button className="button-normal"
                        disabled={activeEditor === 'css'}
                        onClick={() => setActiveEditor('css')}>Css</button>
                    <button className="button-normal"
                        disabled={activeEditor === 'javascript'}
                        onClick={() =>  setActiveEditor('javascript')}>Js</button>
                    <button className="button-normal"
                        onClick={refreshHandler}>Refresh</button>
                </div>
                <div className='flex space-x-3'>
                    <button className="button-normal px-7"
                        onClick={saveHandler}>Save</button>
                    <button className="button-primary px-7"
                        onClick={publishHandler}>Publish</button>
                    <button className="button-normal w-[50px]"
                        onClick={closeHandler}>
                            <svg  viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path d="M396.6 160l19.4 20.7L256 352 96 180.7l19.3-20.7L256 310.5z"></path>
                                </g>
                            </svg>
                        </button>
                </div>
            </div>

            {dataLoaded?
                activeEditor==='html'?<>
                <Editor
                    width="800px"
                    height="500px"
                    path={'file.html'}
                    defaultLanguage='html'
                    defaultValue={htmlcode}
                    onChange={htmlEditorChangeHandler}
                    onMount={htmlEditorMountHandler}
                    />
                </>
                :
                activeEditor==='css'?<>
                <Editor
                    width="800px"
                    height="500px"
                    path={'file.css'}
                    defaultLanguage='css'
                    defaultValue={csscode}
                    onChange={cssEditorChangeHandler}
                    onMount={cssEditorMountHandler}
                    />
                </>
                :
                activeEditor==='javascript'?<>
                <Editor
                    width="800px"
                    height="500px"
                    path={'file.js'}
                    defaultLanguage='javascript'
                    defaultValue={jscode}
                    onChange={jsEditorChangeHandler}
                    onMount={jsEditorMountHandler}
                    />
                </>:null:null
            }
            {/* 
            - path is needed to enable multiple languages. 
            - dataLoaded is needed to prevent empty editor. */}

        </div>

        {!open?<div className='fixed bottom-7 right-10'>
            <button className="button-normal w-[50px] h-[50px] rotate-180"
                onClick={openHandler}>
                    <svg  viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M396.6 160l19.4 20.7L256 352 96 180.7l19.3-20.7L256 310.5z"></path>
                        </g>
                    </svg>
                </button>
        </div>:null}

        <Notif mode={notif.mode} text={notif.text} duration={notif.duration} />
    </>;
}

export default Code;