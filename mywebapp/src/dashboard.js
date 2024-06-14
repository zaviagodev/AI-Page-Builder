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
    const [isDarkMode, setIsDarkMode] = useState(false)

    const sites = window.location.hostname

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

    function toggleAppearance() {
        setIsDarkMode(!isDarkMode)
        if (!isDarkMode){
            document.body.classList.add("dark")
            localStorage.setItem("mode", "dark")
        } else {
            document.body.classList.remove("dark")
            localStorage.setItem("mode", "light")
        }
    }

    const textGradient = {
        background: "linear-gradient(90deg, #6F23E7 0%, #1169E2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    }

    function Logo(){
        return (
            <div className='sidebar-top-logo'>
                <div className='sidebar-logo'>
                    <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                        <rect y="0.5" width="36" height="36" rx="10" fill="url(#paint0_linear_756_5718)"/>
                        <g clip-path="url(#clip0_756_5718)">
                        <path d="M15.5842 7.64939L9.44294 11.0946C8.02924 11.8869 7.1582 13.3526 7.1582 14.938V21.8642C7.1582 23.4496 8.02924 24.9153 9.44294 25.7076L15.6152 29.1703C17.0289 29.9634 18.7701 29.9634 20.183 29.1703L24.0257 27.0154L15.6201 22.2496C14.2169 21.4542 13.3541 19.9948 13.3541 18.4158V11.4825C13.3541 9.79553 14.2813 8.42108 15.5866 7.66764C15.6217 7.64702 15.6135 7.63274 15.5842 7.64939Z" fill="url(#paint1_linear_756_5718)"/>
                        <path d="M28.6944 14.9L28.6977 21.7849C28.6977 21.8182 28.6798 21.8175 28.6798 21.7778C28.6594 20.3042 24.424 17.6394 22.919 16.7963C22.919 16.7963 22.255 16.142 21.8158 15.7621C21.3766 15.3814 21.3554 15.364 21.0279 15.153C20.7435 14.9706 20.4477 14.8278 20.2579 14.7358L20.2399 14.7271C20.0509 14.6359 19.4838 14.3924 19.4838 14.3924C17.529 13.7238 16.9619 13.6628 15.8277 14.5146C15.8277 14.5146 14.5036 15.7621 13.9993 16.8875C13.4949 18.0129 13.367 19.0019 13.5894 19.6253C13.6008 19.6562 13.6081 19.6856 13.6139 19.7134C14.2698 21.3281 14.7261 21.5843 15.8725 22.2275C15.9573 22.2759 16.0469 22.3258 16.1406 22.379L19.0405 23.7177L26 26L20.0248 29.1703C18.6119 29.9634 16.8699 29.9634 15.457 29.1703L9.28393 25.7076C7.87104 24.9153 7 23.4497 7 21.8642V14.9381C7 13.3527 7.87104 11.887 9.28393 11.0947L15.4252 7.64945C15.4553 7.6328 15.4635 7.64707 15.4284 7.66769C15.3576 7.70814 15.2867 7.76604 15.2158 7.839L15.655 7.59314C17.0695 6.80163 18.8124 6.80242 20.2269 7.59473L26.4064 11.0582C27.821 11.8505 28.6936 13.3154 28.6944 14.9Z" fill="url(#paint2_linear_756_5718)"/>
                        <path d="M9.56323 25.8809L15.7558 29.3657C17.1834 30.1612 18.9866 30.1454 20.4157 29.3483L26.6548 25.8674C28.084 25.0695 28.964 23.5975 28.9648 22.0042L28.968 15.0471C28.9689 13.4545 28.0897 11.9825 26.6621 11.187L22.7803 9.02344L22.7306 18.5224C22.7225 20.1079 21.8433 21.5711 20.4206 22.3642L14.1743 25.8499C12.6538 26.6977 10.9484 26.605 9.61049 25.8809C9.57382 25.861 9.53308 25.8642 9.56323 25.8809Z" fill="url(#paint3_linear_756_5718)"/>
                        </g>
                        <defs>
                        <linearGradient id="paint0_linear_756_5718" x1="1.04308e-07" y1="1.24176e-07" x2="42" y2="50" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#0075E0"/>
                        <stop offset="1" stop-color="#9E00E9"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_756_5718" x1="15.55" y1="7.64209" x2="15.6943" y2="29.7647" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#AD7EE1"/>
                        <stop offset="1" stop-color="#2A64BB"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_756_5718" x1="7" y1="11.3921" x2="29.2559" y2="24.4194" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white"/>
                        <stop offset="0.99" stop-color="#3D48E4"/>
                        </linearGradient>
                        <linearGradient id="paint3_linear_756_5718" x1="12.6244" y1="29.9543" x2="27.2916" y2="10.0516" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white"/>
                        <stop offset="1" stop-color="white"/>
                        </linearGradient>
                        <clipPath id="clip0_756_5718">
                        <rect width="22" height="23" fill="white" transform="translate(7 7)"/>
                        </clipPath>
                        </defs>
                    </svg>
                    <div className='sidebar-logo-shadow'></div>
                </div>
                <span className="flex flex-col text-left w-full ml-2">
                    <h2 className="sidebar-logo-title">zaviago</h2>
                    <p className={`sidebar-site ${sites ? '-mt-1.5' : 'mt-0'}`}>
                    {/* {sites ? sites?.site_list[0].name : <Skeleton className='h-3 w-full rounded-sm'/>} */}
                    {sites ? sites : <Skeleton className='h-3 w-full rounded-sm'/>}
                    </p>
                </span>

                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="none" class="three-dots" viewBox="0 0 28 20">
                    <path fill="#fff" fillOpacity="0.01" d="M12 13c.5523 0 1-.4477 1-1s-.4477-1-1-1-1 .4477-1 1 .4477 1 1 1Zm7 0c.5523 0 1-.4477 1-1s-.4477-1-1-1-1 .4477-1 1 .4477 1 1 1ZM5 13c.5523 0 1-.4477 1-1s-.4477-1-1-1-1 .4477-1 1 .4477 1 1 1Z"></path>
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13c.5523 0 1-.4477 1-1s-.4477-1-1-1-1 .4477-1 1 .4477 1 1 1Zm7 0c.5523 0 1-.4477 1-1s-.4477-1-1-1-1 .4477-1 1 .4477 1 1 1ZM5 13c.5523 0 1-.4477 1-1s-.4477-1-1-1-1 .4477-1 1 .4477 1 1 1Z"></path>
                </svg>
            </div>
        )
    }

    function ProButton(){
        return (
            <button className='pro-button'>
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_158_3596)">
                    <path d="M5.4621 0.42371L1.55402 2.67061C0.654394 3.18733 0.100098 4.14319 0.100098 5.17716V9.69423C0.100098 10.7282 0.654394 11.6841 1.55402 12.2008L5.4818 14.4591C6.38143 14.9763 7.4895 14.9763 8.38861 14.4591L10.8339 13.0537L5.48491 9.94561C4.59202 9.42681 4.04291 8.47509 4.04291 7.44526V2.92354C4.04291 1.82336 4.63299 0.926985 5.46365 0.435606C5.48595 0.422158 5.48076 0.412847 5.4621 0.42371Z" fill="url(#paint0_linear_158_3596)"/>
                    <path d="M13.8056 5.15218L13.8076 9.64235C13.8076 9.66407 13.7962 9.66356 13.7962 9.6377C13.7833 8.67666 11.088 6.93873 10.1303 6.3889C10.1303 6.3889 9.7077 5.96218 9.42822 5.71442C9.14874 5.46614 9.13526 5.45476 8.92681 5.31718C8.74585 5.19821 8.55763 5.10511 8.43681 5.04511L8.42541 5.03942C8.30511 4.97994 7.94422 4.82114 7.94422 4.82114C6.7003 4.38511 6.33941 4.34528 5.61763 4.9008C5.61763 4.9008 4.77504 5.71442 4.45407 6.44838C4.13311 7.18235 4.0517 7.82735 4.19326 8.2339C4.20052 8.25407 4.20518 8.27321 4.20881 8.29132C4.62622 9.34442 4.91659 9.51149 5.64615 9.93097C5.70007 9.96252 5.75711 9.99511 5.81674 10.0298L7.66215 10.9029L11.1119 12.1525L8.28852 14.4589C7.38941 14.9761 6.28081 14.9761 5.3817 14.4589L1.45341 12.2006C0.554296 11.6839 0 10.728 0 9.69407V5.177C0 4.14304 0.554296 3.18718 1.45341 2.67045L5.36148 0.423556C5.38067 0.412694 5.38585 0.422005 5.36356 0.435453C5.31844 0.461832 5.27333 0.499591 5.22822 0.547177L5.5077 0.386832C6.40785 -0.129375 7.51696 -0.128858 8.41711 0.387867L12.3496 2.64666C13.2497 3.16338 13.805 4.11873 13.8056 5.15218Z" fill="url(#paint1_linear_158_3596)"/>
                    <path d="M1.63125 12.3133L5.57199 14.5861C6.48044 15.1049 7.62792 15.0945 8.5374 14.5747L12.5077 12.3045C13.4172 11.7842 13.9772 10.8242 13.9777 9.78502L13.9798 5.24778C13.9803 4.20916 13.4208 3.24916 12.5124 2.73037L10.0421 1.31934L10.0105 7.51434C10.0053 8.5483 9.44585 9.50261 8.54051 10.0199L4.56555 12.2931C3.59799 12.8461 2.51273 12.7855 1.66133 12.3133C1.63799 12.3004 1.61207 12.3024 1.63125 12.3133Z" fill="url(#paint2_linear_158_3596)"/>
                    </g>
                    <defs>
                    <linearGradient id="paint0_linear_158_3596" x1="5.44032" y1="0.418945" x2="5.5368" y2="14.8467" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#AD7EE1"/>
                    <stop offset="1" stop-color="#2A64BB"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_158_3596" x1="1.01379e-07" y1="2.86441" x2="14.3381" y2="11.0536" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white"/>
                    <stop offset="1" stop-color="#B0B0B0"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_158_3596" x1="3.57927" y1="14.9699" x2="13.2119" y2="2.21569" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white"/>
                    <stop offset="1" stop-color="white"/>
                    </linearGradient>
                    <clipPath id="clip0_158_3596">
                    <rect width="14" height="15" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
                <span>Pro</span>
            </button>
        )
    }

    return <>
        <div className={styles.dashboard}>
            <div className={`${isSidebarOpen ? 'sidebar-overlay' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`main-sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <Logo />

                <div className='sidebar-menu-sec'>
                    <button className='close-sidebar-btn' onClick={() => setIsSidebarOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
                        Close
                    </button>
                    <button className='button-normal w-full justify-start items-center gap-2' onClick={() => {}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-hotel"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
                        Dashboard
                    </button>
                    <button className='button-normal w-full justify-start items-center gap-2' onClick={() => window.open("/", {target: "_blank"})}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-app-window"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/></svg>
                        View Site
                    </button>
                    <Site mainHost={props.mainHost} owner={props.owner} />
                </div>

                <div className='sidebar-menu-sec'>
                    <h2 className='sidebar-menu-title'>Your workspace</h2>
                    {/* <Account /> */}
                    <button className='button-normal w-full justify-start items-center gap-2' onClick={() => {}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-panel-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>
                        Pages
                    </button>
                    <AddPage onAdd={getPages} />
                    <AssetButton fileType={'all'}/>
                </div>
            </div>

            <div className='topbar'>
                <div className='topbar-menu'>
                    <button className='open-sidebar-btn' onClick={() => setIsSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-right"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
                    </button>
                    <div className='flex items-center'>
                        <button className='bg-transparent' onClick={toggleAppearance}>
                        {isDarkMode ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> : 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                        }
                        </button>

                        <ProButton />

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
                                            <button className={`${active ? styles.active : ""}`} title={'Documentation'} onClick={logoutHandler}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-copy"><path d="M2 16V4a2 2 0 0 1 2-2h11"/><path d="M5 14H4a2 2 0 1 0 0 4h1"/><path d="M22 18H11a2 2 0 1 0 0 4h11V6H11a2 2 0 0 0-2 2v12"/></svg>
                                                Documentation
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button className={`${active ? styles.active : ""}`} title={'Report an issue'} onClick={logoutHandler}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                                                Report an issue
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button className={`${active ? styles.active : ""}`} title={'Go to zaviago.com'} onClick={() => window.location.href = "https://zaviago.com"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                                                Go to zaviago.com
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button className={`${active ? styles.active : ""}`} title={'Go to zaviago.com'} onClick={() => window.location.href = "https://page.line.me/zaviago"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-badge-help"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                                                Support
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>

                            </Transition>
                            
                        </Menu>

                        {/* This is the mockup avatar; the 'A' character will be dynamically changed to the user image */}
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