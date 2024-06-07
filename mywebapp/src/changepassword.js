import { Fragment, useState } from "react";
import Notif from './notif';
import styles from '../styles/Dashboard.module.css';
import { Dialog, Transition } from '@headlessui/react';

function ChangePassword(props) {


    const [isOpen, setIsOpen] = useState(false)

    const [notif, setNotif] = useState({});
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function closeModal() {
        setIsOpen(false)
    }

    function modalOpenHandler(e) {
        e.preventDefault();
        setIsOpen(true)
    }

    async function submitHandler(event) {
        event.preventDefault();

        if(password!==confirmPassword) {
            setMessage(`The password confirmation does not match.`);
            return;
        }

        setNotif({mode: 'wait', text: 'Saving..'});

        const reqBody = { password: password };
        let result = await fetch('/api/changepassword', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            setNotif({});
            setPassword('');
            setConfirmPassword('');
            
            setIsOpen(false)
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    return <>
        <button onClick={modalOpenHandler} className='underline' style={{background:'transparent',boxShadow: 'none'}}>Change Password</button>
    

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
                    leaveTo="opacity-0">
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
                    
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Change Password
                    </Dialog.Title>
                    <form className='mt-6 space-y-6' onSubmit={submitHandler}>
                        <div>
                            <label htmlFor="password">New Password:</label>
                            <div className='mt-1'>
                                <input type="password" id="password" required onChange={(e)=>setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmpassword">Confirm Password:</label>
                            <div className='mt-1'>
                                <input type="password" id="confirmpassword" required onChange={(e)=>setConfirmPassword(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <button className='button-primary w-full' type="submit">Update</button>
                        </div>
                        {message?<div className="text-rose-600">{message}</div>:null}
                    </form>
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>

    </>;
}

export default ChangePassword;