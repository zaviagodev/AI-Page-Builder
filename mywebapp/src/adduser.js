import { Fragment, useState } from 'react';
import Notif from './notif';
import { Dialog, Transition } from '@headlessui/react';
import styles from '../styles/Dashboard.module.css';

function AddUser(props) {

    const [isOpen, setIsOpen] = useState(false)
    const [notif, setNotif] = useState({});

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [ inputUsernameError, setInputUsernameError] = useState('');

    function closeModal() {
        if(notif.mode==='wait') return;
        setIsOpen(false)
    }

    async function submitHandler(event) {
        event.preventDefault();

        if(!checkValidUsername(username)) {
            setInputUsernameError('Requires lowercase letters, numbers, or hyphens.');
            return;
        }

        setNotif({
            mode: 'wait',
            text: 'Adding User..'
        });

        const result = await createUser(username, email, password);
        if(!result.error) { 
            setNotif({});
            setIsOpen(false);
            props.onAdd();
        } else {
            setNotif({
                mode: 'error',
                text: result.error
            });
        }
    }

    async function createUser(username, email, password) {
        try {
            const reqBody = { username, email, password };
            let result = await fetch('/api/auth/signup', {
                method:'POST',
                body: JSON.stringify(reqBody),
                header: {
                    'Content-Type': 'application/json'
                }
            });
            result = await result.json();
            return result;
        } catch(error) {
            return { error }
        }
    }

    function checkValidUsername(str) {
        const regexExp = /^[a-z0-9]+(-[a-z0-9]+)*$/g;
        return regexExp.test(str);
    }

    function inputUsernameKeyUp() {
        setInputUsernameError('');
    }

    return (<>
        <button className='button-normal w-full justify-start items-center gap-2' onClick={()=>setIsOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            Add User
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
                    
                    <Dialog.Title as="h3">Add User</Dialog.Title>

                    <form className='mt-6 space-y-6' onSubmit={submitHandler}>

                        <div>
                            <label htmlFor='username'>Username:</label>
                            <div className='mt-1'>
                                <input type="text" id="username" required className={inputUsernameError?styles.error:''} onKeyUp={inputUsernameKeyUp} onChange={(e)=>setUsername(e.target.value)} />
                                {inputUsernameError?<span className='text-sm text-rose-600'>{inputUsernameError}</span>:null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email">Email:</label>
                            <div className='mt-1'>
                                <input type="text" id="email" required onChange={(e)=>setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <div className='mt-1'>
                                <input type="password" id="password" required onChange={(e)=>setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <button className='button-primary w-full' type="submit">Add User</button>
                        </div>

                    </form>
                    
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>

    </>
    )
}

export default AddUser;