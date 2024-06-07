import { useSession } from 'next-auth/react';
import React, { Fragment, useState, useRef } from 'react';
import Notif from './notif';
import SelectAsset from './selectasset';
import styles from '../styles/Dashboard.module.css';
import { Dialog, Menu, Transition } from '@headlessui/react';

function Page(props) {
    const { data: session, status } = useSession();

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
    const [includesModalIsOpen, setIncludesModalIsOpen] = useState(false);

    const refSettings = useRef(null);
    const refSlug = useRef(null);
    const refIncludes= useRef(null);

    const [notif, setNotif] = useState({});

    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);
    const [blank, setBlank] = useState(false);
    const [socialImage, setSocialImage] = useState('');

    const [listLoaded, setListLoaded] = useState(false);
    const [jsList, setJsList] = useState([{ js: "", head: false }]);
    const [cssList, setCssList] = useState([{ css: "" }]);

    function limit(string = '', limit = 0) {  
        if(string.length>=limit) {
            return string.substring(0, limit) + '...';
        } else {
            return string.substring(0, limit);
        }
    }

    async function settingsHandler(e) {
        e.preventDefault();

        setSettingsModalIsOpen(true);

        getPageSettings();
    }

    async function getPageSettings() {

        setDataLoaded(false);

        const reqBody = { action: 'get', slug: props.slug };
        let result = await fetch('/api/pagesettings', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setDataLoaded(true);
            
            if(result.content.slug) setSlug(result.content.slug);
            if(result.content.title) setTitle(result.content.title);
            if(result.content.desc) setDesc(result.content.desc);
            if(result.content.socialImage) setSocialImage(result.content.socialImage);
            if(result.content.blank) {
                setBlank(true);
            } else {
                setBlank(false);
            }

            // refSlug.current.focus();
            setTimeout(()=>{
                refSlug.current.focus();
            },0)
        }
    }

    async function saveHandler(e) {
        e.preventDefault();

        setNotif({mode: 'wait', text: 'Saving..'});

        const reqBody = { action: 'save', slugTarget: props.slug, slug: slug, title: title, desc: desc, socialImage: socialImage, blank: blank };
        let result = await fetch('/api/pagesettings', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            props.onUpdate(()=>{
                setNotif({});
            });
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }

    }

    async function deleteConfirmHandler(e) {
        e.preventDefault();

        setDeleteModalIsOpen(true);
    }

    async function deleteHandler(e) {
        e.preventDefault();

        setNotif({mode: 'wait', text: 'Delete Page..'});
        setDeleteModalIsOpen(false);

        const reqBody = { slug: props.slug };
        let result = await fetch('/api/delpage', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            props.onUpdate(()=>{
                setNotif({});
            });
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    function deleteCloseHandler() {
        setDeleteModalIsOpen(false);
    }

    function settingsCloseHandler() {
        if(notif.mode==='wait') return;
        setSettingsModalIsOpen(false);
    }

    async function publishHandler(e) {
        e.preventDefault();
        
        setNotif({mode: 'wait', text: 'Publishing..'});
        
        const reqBody = { slug: props.slug };
        let result = await fetch('/api/publishpage', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            props.onUpdate(()=>{
                setNotif({});
            });
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    async function unPublishHandler(e) {
        e.preventDefault();
        
        setNotif({mode: 'wait', text: 'Unpublishing..'});

        const reqBody = { slug: props.slug };
        let result = await fetch('/api/unpublishpage', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            props.onUpdate(()=>{
                setNotif({});
            });
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    async function saveIncludesHandler(e) {
        e.preventDefault();

        setNotif({mode: 'wait', text: 'Saving..'});

        const reqBody = { slug: props.slug, jsIncludes: jsList, cssIncludes: cssList };
        let result = await fetch('/api/pageincludes', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setNotif({});
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    const jsInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...jsList];
      list[index][name] = value;
      setJsList(list);
    };
    const jsCheckboxChange = (e, index) => {
      const name = e.target.name;
      const value = e.target.checked;
      const list = [...jsList];
      list[index][name] = value;
      setJsList(list);
    };
     
    const jsRemoveClick = (index) => {
      const list = [...jsList];
      list.splice(index, 1);
      setJsList(list);
    };
     
    const jsAddClick = () => {
      setJsList([...jsList, { js: "" }]);
    };

    const cssInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...cssList];
      list[index][name] = value;
      setCssList(list);
    };
     
    const cssRemoveClick = (e, index) => {
        e.preventDefault();
      const list = [...cssList];
      list.splice(index, 1);
      setCssList(list);
    };
     
    const cssAddClick = () => {
      setCssList([...cssList, { css: "" }]);
    };

    function includesCloseHandler() {
        if(notif.mode==='wait') return;
        setIncludesModalIsOpen(false);
    }

    async function includesHandler(e) {
        e.preventDefault();

        setIncludesModalIsOpen(true);

        getPageIncludes();
    }

    async function getPageIncludes() {

        setListLoaded(false);

        const reqBody = { action: 'get', slug: props.slug };
        let result = await fetch('/api/pageincludes', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setListLoaded(true);

            if(result.jsIncludes) setJsList(result.jsIncludes);

            if(result.cssIncludes) setCssList(result.cssIncludes);

            // refIncludes.current.querySelector('input').focus();
            setTimeout(()=>{
                refIncludes.current.querySelector('input').focus();
            },0)
        }
    }

    function selectSocialImageHandler(s) {
        setSocialImage(s);
    }

    function showSvgIcon(s, w, h) {
        if(s==='trash') {
            return <svg style={{width:w+'px', height:h+'px'}} viewBox="0 0 512 512"><path d="M400 113.3h-80v-20c0-16.2-13.1-29.3-29.3-29.3h-69.5C205.1 64 192 77.1 192 93.3v20h-80V128h21.1l23.6 290.7c0 16.2 13.1 29.3 29.3 29.3h141c16.2 0 29.3-13.1 29.3-29.3L379.6 128H400v-14.7zm-193.4-20c0-8.1 6.6-14.7 14.6-14.7h69.5c8.1 0 14.6 6.6 14.6 14.7v20h-98.7v-20zm135 324.6v.8c0 8.1-6.6 14.7-14.6 14.7H186c-8.1 0-14.6-6.6-14.6-14.7v-.8L147.7 128h217.2l-23.3 289.9z"></path><path d="M249 160h14v241h-14zM320 160h-14.6l-10.7 241h14.6zM206.5 160H192l10.7 241h14.6z"></path></svg>
        } else if(s==='online') {
            return <svg style={{width:w+'px', height:h+'px'}} viewBox="0 0 512 512"><path d="M256 48h-.5C140.8 48.3 48 141.3 48 256s92.8 207.7 207.5 208h.5c114.9 0 208-93.1 208-208S370.9 48 256 48zm8.3 124.5c22.1-.6 43.5-3.5 64.2-8.5 6.2 24.5 10.1 52.8 10.7 83.8h-74.9v-75.3zm0-16.7V66c22.4 6.2 45.2 36.1 59.6 82-19.2 4.6-39.1 7.2-59.6 7.8zm-16.6-90v90.1c-20.7-.6-40.8-3.3-60.1-8 14.6-46.2 37.5-76.3 60.1-82.1zm0 106.7v75.2h-75.4c.6-31 4.5-59.3 10.7-83.8 20.8 5 42.5 8 64.7 8.6zm-92.2 75.2H64.9c1.8-42.8 17.8-82 43.3-113 18.5 10.2 38.2 18.6 58.8 24.8-6.8 26.5-10.8 56.4-11.5 88.2zm0 16.6c.6 31.7 4.6 61.7 11.4 88.2-20.6 6.3-40.2 14.6-58.8 24.8-25.5-31-41.4-70.2-43.3-113h90.7zm16.8 0h75.4v75.1c-22.2.6-43.9 3.6-64.7 8.7-6.2-24.5-10.1-52.8-10.7-83.8zm75.4 91.8v90.2c-22.6-5.9-45.5-35.9-60.1-82.1 19.3-4.8 39.4-7.5 60.1-8.1zm16.6 89.9v-90c20.5.6 40.4 3.3 59.7 7.9-14.5 46-37.2 75.9-59.7 82.1zm0-106.6v-75.1h74.9c-.6 30.9-4.5 59.2-10.7 83.7-20.7-5-42.1-8-64.2-8.6zm91.6-75.1h91.2c-1.8 42.8-17.8 81.9-43.3 113-18.7-10.3-38.5-18.7-59.3-25 6.8-26.5 10.8-56.3 11.4-88zm0-16.6c-.6-31.7-4.6-61.6-11.3-88.1 20.8-6.3 40.6-14.7 59.2-24.9 25.5 31 41.5 70.2 43.3 113.1h-91.2zm36.5-125.8c-16.6 8.8-34 16.1-52.3 21.6-9.7-31.3-23.4-56.8-39.5-73.6 35.4 8.5 67 26.9 91.8 52zM210.8 70.1c-16.1 16.7-29.7 42.2-39.3 73.3-18.1-5.5-35.4-12.7-51.8-21.5 24.5-25 55.9-43.3 91.1-51.8zM119.6 390c16.4-8.8 33.8-16 51.8-21.5 9.7 31.2 23.3 56.6 39.4 73.4-35.2-8.5-66.6-26.8-91.2-51.9zm181 52.1c16.2-16.8 29.8-42.3 39.6-73.7 18.3 5.5 35.7 12.8 52.3 21.6-24.8 25.2-56.5 43.6-91.9 52.1z"></path></svg>
        } else if(s==='more') {
            return <svg style={{width:w+'px', height:h+'px'}} viewBox="0 0 512 512"><path d="M296 136c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40zm0 240c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40zm0-120c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40z"/></svg>
        }
    }

    return <>
        <div className={styles.card}>
            <div className='flex flex-col gap-y-2 w-full pl-4'>
                <h2 className='flex items-center gap-4'>{props.slug?'/'+props.slug:'/...home'}
                    {props.online?<div className={styles.onlineinfo}>
                    Published
                    </div>:null} 
                </h2>
                <p className='text-[#929292]'>{props.title?limit(props.title, 60):''}</p>
            </div>

            <div className='w-full flex justify-end items-center'>

                {props.online?
                    props.mainHost && session.user.name!=='admin'?
                    <a className={styles.cardbutton} href={'/site/'+ session.user.name + '/' + (props.slug===''?'index':props.slug)} target="_blank">View</a>:
                    <a className={styles.cardbutton} href={'/'+props.slug} target="_blank">View</a>:
                    null
                }
                
                {/* <a className={styles.cardbutton + ' ml-2 w-[50px]'} href={'/code?page='+props.slug} target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </a> */}

                <a className={styles.cardbutton + ' ml-2'} href={'/edit?page='+props.slug} target="_blank">Edit</a>

                <Menu as="div" className={styles.more + ' ml-2'}>
                    
                    <Menu.Button>
                        {showSvgIcon('more', 25, 25)}
                    </Menu.Button>
                    
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">

                        <Menu.Items className={`${styles.moremenu} focus:outline-none`}>
                            
                            <Menu.Item>
                                {({ active }) => (
                                    <button className={`${active ? styles.active : ""}`} title={'Publish'} onClick={publishHandler}>Publish Draft</button>
                                )}
                            </Menu.Item>
                            
                            {
                            props.online?
                            <Menu.Item>
                                {({ active }) => (
                                    <button className={`${active ? styles.active : ""}`}  title={'Unpublish'} onClick={unPublishHandler}>Unpublish</button>
                                )}
                            </Menu.Item>:null
                            }

                            <Menu.Item>
                                {({ active }) => (
                                    <a className={`${active ? styles.active : ""}`}  title={'View Draft'} target="_blank" href={`/draft?page=${props.slug}`}>View Draft</a>
                                )}
                            </Menu.Item>

                            <div className={styles.menuseparator}></div>
                            <Menu.Item>
                                {({ active }) => (
                                    <button className={`${active ? styles.active : ""}`}  title={'Settings'} onClick={settingsHandler}>Settings</button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button className={`${active ? styles.active : ""}`}  title={'Includes'} onClick={includesHandler}>Includes</button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a className={`${active ? styles.active : ""}`}  title={'HTML'} target="_blank" href={`/code?page=${props.slug}`}>HTML</a>
                                )}
                            </Menu.Item>
                        
                            {props.slug?
                            <>
                                <div className={styles.menuseparator}></div>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className={` ${active ? styles.active : ""}`}  title={'Delete'} onClick={deleteConfirmHandler}>Delete</button>
                                    )}
                                </Menu.Item>
                                
                            </>:null}   
                        </Menu.Items>

                    </Transition>
                    
                </Menu>
            </div>
        </div>

        <Transition appear show={deleteModalIsOpen} as={Fragment}>
            <Dialog
            as="div"
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={deleteCloseHandler}>

            <div className="min-h-screen px-4 text-center w-full">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-black/50" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className={`${styles.modal}`}>

                    <p>Are you sure you want to delete this page?</p>

                    <h3 className='mt-6 mb-8'>/{props.slug}</h3>
                        
                    <form onSubmit={deleteHandler}>
                        <div>
                            <button className='button-warning w-full'>Delete</button>
                        </div>
                    </form>

                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>

        <Transition appear show={settingsModalIsOpen} as={Fragment}>
            <Dialog
            as="div"
            initialFocus={refSettings}
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={settingsCloseHandler}>

            {/* <Notif mode={notif.mode} text={notif.text} duration={notif.duration} /> */}

            <div className="min-h-screen px-4 text-center w-full">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-black/50" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className={`${styles.modal}`}>
                    
                    <Dialog.Title as="h3">Page Settings</Dialog.Title>

                    <form ref={refSettings} className='mt-6 space-y-6' onSubmit={saveHandler}>
                
                        {dataLoaded?  <>

                            <div>
                                <label htmlFor='slug'>Slug:</label>
                                <div className='mt-1'>
                                    <input ref={refSlug} type='text' id="slug" value={slug} onChange={(e)=>setSlug(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor='title'>Title:</label>
                                <div className='mt-1'>
                                    <input type='text' id="title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor='desc'>Description:</label>
                                <div className='mt-1'>
                                    <input type='text' id="desc" value={desc} onChange={(e)=>setDesc(e.target.value)} />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor='socialImage'>Social Image:</label>
                                <div className='flex'>
                                    <input type='text' id='socialImage' value={socialImage} onChange={(e)=>setSocialImage(e.target.value)} style={{marginRight:3}}/>
                                    <SelectAsset onPickFile={selectSocialImageHandler} currentFile={socialImage} fileType='image' />
                                </div>
                            </div>

                            <div className='flex items-center'>
                                <input type="checkbox" id="blank" checked={blank} onChange={(e)=>setBlank(e.target.checked)}></input>
                                <label htmlFor='blank' className='ml-2'>
                                    Do not use header &amp; footer.
                                </label>
                            </div>
                        
                            <div>
                                <button className='button-primary w-full' type="submit">Update</button>
                            </div>
                        </> : <>
                        Please wait..
                        </>}
                    </form>

                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>


        <Transition appear show={includesModalIsOpen} as={Fragment}>
            <Dialog
            as="div"
            initialFocus={refIncludes}
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={includesCloseHandler}>

            <div className="min-h-screen px-4 text-center w-full">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-black/50" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className={`${styles.modal2}`}>

                    <form ref={refIncludes} onSubmit={saveIncludesHandler}>

                        <Dialog.Title as="h3">Includes</Dialog.Title>
                        
                        {listLoaded? <> 

                        <div style={{marginTop:15}}>Js Includes:</div>
                        {jsList.map((x, i) => {
                            return (
                            <div key={`list${i}`} className={styles.inputrows + ' flex-col'}>
                                <div className='flex w-full'>
                                    <input type="text" name="js" value={x.js} onChange={e => jsInputChange(e, i)} />
                                    <div style={{display:'flex'}}>
                                        {jsList.length !== 1 && <button className='button-normal'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            jsRemoveClick(i);
                                        }}>Remove</button>}
                                        {jsList.length - 1 === i && <button className='button-normal' onClick={jsAddClick}>Add</button>}
                                    </div>
                                </div>
                                <label className='flex items-center mt-1 mb-3'>
                                    <input type="checkbox" name="head" checked={x.head} onChange={(e) => jsCheckboxChange(e, i)} />
                                    <span className='ml-1'>Head</span>
                                </label>

                            </div>
                            );
                        })}
                        {/* <div style={{ marginTop: 20 }}>{JSON.stringify(jsList)}</div> */}

                        <div style={{marginTop:15}}>Css Includes:</div>
                        {cssList.map((x, i) => {
                            return (
                            <div key={`list${i}`} className={styles.inputrows + ' flex-row'}>
                                <input type="text" name="css" value={x.css} onChange={e => cssInputChange(e, i)} />
                                <div className='flex'>
                                    {cssList.length !== 1 && <button className='button-normal'
                                    onClick={(e) => cssRemoveClick(e,i)}>Remove</button>}
                                    {cssList.length - 1 === i && <button onClick={cssAddClick} className='button-normal'>Add</button>}
                                </div>
                            </div>
                            );
                        })}

                        <div className={styles.inputrowsfooter}>
                            <button className='button-primary w-full' type="submit">Save</button>
                        </div>
                        </>:<>
                        <div className='mt-6'>Please wait..</div>
                        </>}

                        </form>

                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>
        
        
        <Notif mode={notif.mode} text={notif.text} duration={notif.duration} />
    </>
}

export default Page;