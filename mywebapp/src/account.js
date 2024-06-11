import { Fragment, useState, useRef } from "react";
import { useSession } from 'next-auth/react';
import Notif from './notif';
import ChangePassword from './changepassword';
import styles from '../styles/Dashboard.module.css';
import { Dialog, Transition } from '@headlessui/react';

function Account(props) {

    const { data: session, status } = useSession();

    const [isOpen, setIsOpen] = useState(false)

    const [notif, setNotif] = useState({});

    const [email, setEmail] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);
    
    const refFocus = useRef(null);

    function closeModal() {
      setIsOpen(false)
    }

    async function openModalHandler(e) {
        e.preventDefault();

        setIsOpen(true);

        getAccount();
    }

    async function getAccount() {

        setDataLoaded(false);

        let result = await fetch('/api/user');
        result = await result.json();
        if(!result.error) { 
            setDataLoaded(true);

            setEmail(result.email);
            
            if(refFocus.current) refFocus.current.focus();
        }
    }

    async function saveHandler(e) {
        e.preventDefault();

        setNotif({mode: 'wait', text: 'Saving..'});

        const reqBody = { email: email };
        let result = await fetch('/api/user', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setNotif({});
            setIsOpen(false)
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    return <>
        <button className='button-normal w-full justify-start items-center gap-2' onClick={openModalHandler}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
            Account
        </button>

        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
            as="div"
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={closeModal}>

            <Notif mode={notif.mode} text={notif.text} duration={notif.duration} />

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
                <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm modal-overlay" />
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
                    
                    <div className='flex justify-between items-center'>
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Account
                        </Dialog.Title>
                        <ChangePassword />
                    </div>
                    <form className='mt-6 space-y-6' onSubmit={saveHandler}>
                        {dataLoaded?  <>
                            <div>
                                <label>Username: {session.user.name}</label>
                            </div>
                            <div>
                                <label htmlFor='email'>Email:</label>
                                <div className='mt-1'>
                                    <input ref={refFocus} type='text' id='email' required value={email} onChange={(e)=>setEmail(e.target.value)} />
                                </div>
                            </div>
                            
                            <div>
                                <button className='button-primary w-full' type='submit'>Update</button>
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
        
    </>

}

export default Account;