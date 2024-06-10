import { useEffect, useState, Fragment } from 'react';
import { signOut } from 'next-auth/react';
import Site from './site';
import Account from './account';
import Page from './page';
import AssetButton from './assetbutton';
import AddPage from './addpage';
import styles from '../styles/Dashboard.module.css';
import { Dialog, Menu, Transition } from '@headlessui/react';

function Dashboard(props) {

    const [loadedData, setLoadedData] = useState();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(()=>{
        getPages();
    }, []);

    async function getPages(callback) {

        fetch('/api/pages')
        .then(response=>response.json())
        .then(data=>{
            if(callback) callback();
            setLoadedData(data);
        });
    }

    async function logoutHandler() {
        await signOut({redirect: false});
    }

    const bgGradient = {
        background:"linear-gradient(90deg, rgb(248, 247, 247) 0%, rgb(44, 44, 46) 100%)"
    }

    return <>
        <div className={styles.dashboard}>
            <div className={`${isSidebarOpen ? 'sidebar-overlay' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`main-sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <div className='sidebar-menu-sec'>
                    <button className='close-sidebar-btn' onClick={() => setIsSidebarOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
                        Close
                    </button>

                    <button className='button-normal w-full justify-start hover:bg-gray-100 items-center gap-2' onClick={() => window.open("/", {target: "_blank"})}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-app-window"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/></svg>
                        View Site
                    </button>
                    <Site mainHost={props.mainHost} owner={props.owner} />
                </div>
                <div className='sidebar-menu-sec'>
                    {/* <Account /> */}
                    <AddPage onAdd={getPages} />
                    <AssetButton fileType={'all'}/>
                </div>
            </div>

            <div className='topbar'>
                <div className='topbar-menu'>
                    <button className='open-sidebar-btn' onClick={() => setIsSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-right"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
                    </button>
                    <Menu as="div" className={styles.more + ' ml-2'}>
                        <Menu.Button className='gap-2'>
                            Help
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">

                            <Menu.Items className={`${styles.moremenu} focus:outline-none topbar-moremenu`}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className={`${active ? styles.active : ""}`} title={'Logout'} onClick={logoutHandler}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                            Logout
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>

                        </Transition>
                        
                    </Menu>
                    <Menu as="div" className={styles.more + ' ml-4'}>
                        <Menu.Button className='avatar'>
                            A
                        </Menu.Button>
                        
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">

                            <Menu.Items className={`${styles.moremenu} focus:outline-none topbar-moremenu`}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className={`${active ? styles.active : ""}`} title={'Logout'} onClick={logoutHandler}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                            Logout
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>

                        </Transition>
                        
                    </Menu>
                </div>
            </div>

            <div className='main-dashboard bg-front-gradient'>
                <h1>Dashboard</h1>

                <div className="flex flex-wrap">
                    {loadedData?loadedData.pages.map(page=>{
                            return (
                                <Page key={page.slug} slug={page.slug} title={page.title} online={page.online} mainHost={props.mainHost} onUpdate={getPages} />
                            )
                        }):
                        // <div className={styles.dashboard}>
                        <div className='flex justify-center w-full mt-8'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className="animate-spin w-12 h-12 flex justify-center items-center rounded-full" style={bgGradient}>
                                    <div className="bg-white w-10 h-10 rounded-full" />
                                </div>
                                <p>Loading...</p>
                            </div>
                        </div>
                    }
                </div>       

            </div>

        </div>
    </>;
}

export default Dashboard;