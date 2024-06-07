import { Fragment, useState, useEffect, useRef } from "react";
import { useSession } from 'next-auth/react';
import Notif from './notif';
import SelectAsset from './selectasset';
import { Tab, Dialog, Switch, Transition } from '@headlessui/react';
import styles from '../styles/Dashboard.module.css';

function Site(props) {

    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false)
    const [notif, setNotif] = useState({});

    const refFocus = useRef(null);

    const [siteData, setSiteData] = useState(false);

    const [domain, setDomain] = useState('');
    const [favicon, setFavicon] = useState('');
    const [noSignup, setNoSignup] = useState(false);
    const [trackingId, setTrackingId] = useState('');
    const [headerSlug, setHeaderSlug] = useState('');
    const [footerSlug, setFooterSlug] = useState('');
    const [customDomainOnly, setCustomDomainOnly] = useState(false);

    const [mailSmtp, setMailSmtp] = useState('');
    const [mailPort, setMailPort] = useState('');
    const [mailUser, setMailUser] = useState('');
    const [mailPassword, setMailPassword] = useState('');
    const [mailFrom, setMailFrom] = useState('');
    const [mailName, setMailName] = useState('');

    const [captchaSiteKey, setCaptchaSiteKey] = useState('');
    const [captchaSecretKey, setCaptchaSecretKey] = useState('');
    
    
    useEffect(()=>{
        getSiteInfo();
    }, []);

    async function getSiteInfo(){
        let result = await fetch('/api/site');
        result = await result.json(); // {ok: true, status: 200, domainName: 'example.com'}
        
        setSiteData(true);
        if(result.domainName) setDomain(result.domainName);
        if(result.favicon) setFavicon(result.favicon);
        if(result.trackingId) setTrackingId(result.trackingId);
        if(result.headerSlug) setHeaderSlug(result.headerSlug);
        if(result.footerSlug) setFooterSlug(result.footerSlug);
        if(result.noSignup) setNoSignup(result.noSignup);
        if(result.customDomainOnly) setCustomDomainOnly(result.customDomainOnly);

        if(result.mailSmtp) setMailSmtp(result.mailSmtp);
        if(result.mailPort) setMailPort(result.mailPort);
        if(result.mailUser) setMailUser(result.mailUser);
        if(result.mailPassword) setMailPassword(result.mailPassword);
        if(result.mailFrom) setMailFrom(result.mailFrom);
        if(result.mailName) setMailName(result.mailName);

        if(result.captchaSiteKey) setCaptchaSiteKey(result.captchaSiteKey);
        if(result.captchaSecretKey) setCaptchaSecretKey(result.captchaSecretKey);
    }

    function closeModal() {
        if(notif.mode==='wait') return;
        setIsOpen(false)
    }

    async function saveIntegrationsHandler(e) {
        e.preventDefault();

        setNotif({
            mode: 'wait',
            text: 'Updating..'
        });

        const reqBody = { 
            captchaSiteKey: captchaSiteKey, 
            captchaSecretKey: captchaSecretKey,
        };

        let result = await fetch('/api/siteintegrations', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setNotif({});
            // setIsOpen(false);
        } else {
            setNotif({
                mode: 'error',
                text: 'Unable to save.'
            });
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    async function saveSiteHandler(e) {
        e.preventDefault();

        setNotif({
            mode: 'wait',
            text: 'Updating..'
        });

        const reqBody = { 
            domainName: domain, 
            favicon: favicon, 
            trackingId: trackingId,
            headerSlug: headerSlug,
            footerSlug: footerSlug,
            noSignup: noSignup,
            customDomainOnly: customDomainOnly,
        };
        let result = await fetch('/api/site', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setNotif({});
            // setIsOpen(false);
        } else {
            setNotif({
                mode: 'error',
                text: 'Unable to save.'
            });
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    async function saveMailHandler(e) {
        e.preventDefault();

        setNotif({
            mode: 'wait',
            text: 'Updating..'
        });

        const reqBody = { 
            mailSmtp: mailSmtp, 
            mailPort: mailPort, 
            mailUser: mailUser,
            mailPassword: mailPassword,
            mailFrom: mailFrom,
            mailName: mailName,
        };

        let result = await fetch('/api/sitemail', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setNotif({});
            // setIsOpen(false);
        } else {
            setNotif({
                mode: 'error',
                text: 'Unable to save.'
            });
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    function selectFavIconHandler(s) {
        setFavicon(s);
    }

    return (<>
        <button className='button-normal w-full justify-start hover:bg-gray-100' onClick={()=>setIsOpen(true)}>Site Settings</button>
        
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
            as="div"
            initialFocus={refFocus}
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={closeModal}>

            <Notif mode={notif.mode} text={notif.text} duration={notif.duration} />

            {/* Prevent focus warning */}
            <input type="hidden"  ref={refFocus} /> 

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
                <div className={`${styles.modal}`} style={{maxWidth:'600px'}}>
                    
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Site Settings
                    </Dialog.Title>

                    <Tab.Group>
                        <div className='flex items-start mt-6'>
                        <Tab.List className="flex relative z-10 justify-center p-1 space-x-3 bg-gray-100/75 w-50 rounded-lg">
                            <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={selected ? styles.tabactive : styles.tab}>
                                General
                                </button>
                            )}
                            </Tab>
                            <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={selected ? styles.tabactive : styles.tab}>
                                Mail Settings
                                </button>
                            )}
                            </Tab>
                            <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={selected ? styles.tabactive : styles.tab}>
                                Integrations
                                </button>
                            )}
                            </Tab>
                        </Tab.List>
                        </div>
                        <Tab.Panels>
                            <Tab.Panel className={styles.tabcontent}>
                                
                                <form className='mt-6 space-y-6' onSubmit={saveSiteHandler}>
                                    {siteData?  <>

                                        {session.user.name==='admin'?<>
                                        <label>Main Domain: {domain}</label>
                                        </>:<>
                                        
                                            <div>
                                                <label htmlFor='domainname'>Custom Domain:</label>
                                                <div className='mt-1'>
                                                    <input type='text' id="domainname" value={domain} onChange={(e)=>setDomain(e.target.value)} />
                                                </div>
                                            </div>

                                            {(!props.mainHost? <>
                                                <Switch.Group>
                                                    <div className="flex items-center">
                                                        <Switch
                                                            checked={customDomainOnly}
                                                            onChange={()=>{setCustomDomainOnly(!customDomainOnly)}}
                                                            className={`${
                                                                customDomainOnly ? 'bg-indigo-600' : 'bg-gray-200'
                                                            } relative inline-flex items-center h-7 rounded-full w-12 px-0 justify-start`}
                                                            >
                                                            <span className="sr-only">Use custom domain only</span>
                                                            <span
                                                                className={`${
                                                                customDomainOnly ? 'translate-x-[23px]' : 'translate-x-1'
                                                                } inline-block w-5 h-5 transform bg-white rounded-full`}
                                                            />
                                                        </Switch>
                                                        <Switch.Label className="ml-2">Use custom domain only</Switch.Label>
                                                    </div>
                                                </Switch.Group>
                                            </>
                                            :null)}

                                        </>}


                                        <div>
                                            <label htmlFor='favicon'>Favicon:</label>
                                            <div className='mt-1' style={{display:'flex'}}>
                                                <input type='text' id='favicon' value={favicon} onChange={(e)=>setFavicon(e.target.value)} style={{marginRight:3}}/>
                                                <SelectAsset onPickFile={selectFavIconHandler} currentFile={favicon} fileType='image' />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='trackingid'>GA Tracking ID:</label>
                                            <div className='mt-1'>
                                                <input type='text' id="trackingid" value={trackingId} onChange={(e)=>setTrackingId(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='header'>Use a page as a header:</label>
                                            <div className='mt-1'>
                                                <input type='text' id="header" placeholder="Enter page slug" value={headerSlug} onChange={(e)=>setHeaderSlug(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='footer'>Use a page as a footer:</label>
                                            <div className='mt-1'>
                                                <input type='text' id="footer" placeholder="Enter page slug" value={footerSlug} onChange={(e)=>setFooterSlug(e.target.value)} />
                                            </div>
                                        </div>

                                        {session.user.name==='admin'?<>
                                        <Switch.Group>
                                            <div className="flex items-center">
                                                <Switch
                                                    checked={!noSignup}
                                                    onChange={()=>{setNoSignup(!noSignup)}}
                                                    className={`${
                                                        !noSignup ? 'bg-indigo-600' : 'bg-gray-200'
                                                    } relative inline-flex items-center h-7 rounded-full w-12 px-0 justify-start`}
                                                    >
                                                    <span className="sr-only">Enable Signup</span>
                                                    <span
                                                        className={`${
                                                        !noSignup ? 'translate-x-[23px]' : 'translate-x-1'
                                                        } inline-block w-5 h-5 transform bg-white rounded-full`}
                                                    />
                                                </Switch>
                                                <Switch.Label className="ml-2">Enable Signup</Switch.Label>
                                            </div>
                                        </Switch.Group>
                                        </>:null}

                                        <div>
                                            <button className="button-primary w-full" type="submit">Update</button>
                                        </div>
                                    </> : 
                                    <p>Please wait..</p>}
                                </form>
                                

                            </Tab.Panel>
                            <Tab.Panel className={styles.tabcontent}>
                                

                                <form className='mt-6 space-y-6' onSubmit={saveMailHandler}>
                                    {siteData?  <>
                                        <div className="flex space-x-5">
                                            <div className="w-full">
                                                <label htmlFor='smtp'>SMTP:</label>
                                                <div className='mt-1'>
                                                    <input type='text' id="smtp" value={mailSmtp} onChange={(e)=>setMailSmtp(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="w-[100px]">
                                                <label htmlFor='port'>Port:</label>
                                                <div className='mt-1'>
                                                    <input type='text' id="port" value={mailPort} onChange={(e)=>setMailPort(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor='user'>User:</label>
                                            <div className='mt-1'>
                                                <input type='text' id="user" value={mailUser} autoComplete="off" onChange={(e)=>setMailUser(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='pwd'>Password:</label>
                                            <div className='mt-1'>
                                                <input type='password' id="pwd" value={mailPassword} autoComplete="new-password" onChange={(e)=>setMailPassword(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='from'>From address:</label>
                                            <div className='mt-1'>
                                                <input type='text' id="from" value={mailFrom} onChange={(e)=>setMailFrom(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='name'>From name:</label>
                                            <div className='mt-1'>
                                                <input type='text' id="name" value={mailName} onChange={(e)=>setMailName(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <button className="button-primary w-full" type="submit">Update</button>
                                        </div>
                                    </> : 
                                    <p>Please wait..</p>}
                                </form>

                            </Tab.Panel>

                            <Tab.Panel className={styles.tabcontent}>
                                

                                <form className='mt-6 space-y-6' onSubmit={saveIntegrationsHandler}>
                                    {siteData?  <>

                                        <div className="font-semibold">reCAPTCHA v2</div>
                                        <div>
                                            <label htmlFor='captchasitekey'>Site Key:</label>
                                            <div className='mt-1'>
                                                <input type='text' id="captchasitekey" value={captchaSiteKey} onChange={(e)=>setCaptchaSiteKey(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='captchasecretkey'>Secret Key:</label>
                                            <div className='mt-1'>
                                                <input type='text' id="captchasecretkey" value={captchaSecretKey} onChange={(e)=>setCaptchaSecretKey(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <button className="button-primary w-full" type="submit">Update</button>
                                        </div>
                                    </> : 
                                    <p>Please wait..</p>}
                                </form>

                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>

                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>

        </>
    )
}

export default Site;