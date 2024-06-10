import { useEffect, useState, Fragment } from 'react';
import { signOut } from 'next-auth/react';
import User from './user';
import AddUser from './adduser';
import styles from '../styles/Dashboard.module.css';
import { Dialog, Menu, Transition } from '@headlessui/react';

function Admin() {

    const [loadedData, setLoadedData] = useState();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(()=>{
        getUsers();
    }, []);

    async function getUsers(callback) {

        fetch('/api/users')
        .then(response=>response.json())
        .then(async data=>{
            // console.log(data)
            if(data.error) {
                if(data.status===401) {
                    await signOut({redirect: false});
                    return;
                } else {
                    console.log(data.error);
                }
            }
            if(callback) callback();
            setLoadedData(data);
        });
    }

    async function logoutHandler() {
        await signOut({redirect: false});
        window.location.href = '/admin';
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

                    <AddUser onAdd={getUsers} />
                </div>
            </div>

            <div className='topbar'>
                <div className='topbar-menu'>
                    <button className='open-sidebar-btn' onClick={() => setIsSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-right"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
                    </button>
                    <Menu as="div" className={styles.more + ' ml-2'}>
                        <Menu.Button>
                            MENU
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
                                        <button className={`${active ? styles.active : ""}`} title={'Logout'} onClick={() => window.location.href = '/dashboard'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hotel"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
                                            Dashboard
                                        </button>
                                    )}
                                </Menu.Item>
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

                <h1>Admin</h1>

                <div className="flex flex-wrap">
                    {loadedData?loadedData.users.map(user=>{
                            return (
                                <User key={user._id} 
                                username={user.username}
                                email={user.email}
                                domainName={user.domainName}
                                enabled={!(user.inactive?true:false)}
                                onUpdate={getUsers} />
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

export default Admin;