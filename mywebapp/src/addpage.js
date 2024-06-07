import { Fragment, useState } from 'react';
import Notif from './notif';
import { Dialog, Transition } from '@headlessui/react';
import styles from '../styles/Dashboard.module.css';

function AddPage(props) {

    const [isOpen, setIsOpen] = useState(false)
    const [notif, setNotif] = useState({});

    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const [ inputSlugError, setInputSlugError] = useState('');

    function closeModal() {
        if(notif.mode==='wait') return;
        setIsOpen(false)
    }

    async function submitHandler(e) {
        e.preventDefault();

        if(!checkValidSlug(slug)) {
            setNotif({});
            setInputSlugError('Slug requires lowercase letters, numbers, or hyphens.');
            return;
        }
        
        setNotif({
            mode: 'wait',
            text: 'Create Page..'
        });

        const reqBody = { slug: slug, title: title, desc: desc };
        let result = await fetch('/api/addpage', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            props.onAdd(()=>{
                setSlug('');
                setTitle('');
                setDesc('');
                setNotif({});
                setIsOpen(false);
            });
        } else {
            setNotif({
                mode: 'error',
                text: result.error
            });
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    function checkValidSlug(str) {
        const regexExp = /^[a-z0-9]+(-[a-z0-9]+)*$/g;
        return regexExp.test(str);
    }

    function inputSlugKeyUp() {
        setInputSlugError('');
    }

    return (<>
        <button className='button-normal w-full justify-start hover:bg-gray-100' onClick={()=>setIsOpen(true)}>+ Add Page</button> 

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
                    
                    <Dialog.Title as="h3">Add Page</Dialog.Title>

                    <form className='mt-6 space-y-6' onSubmit={submitHandler}>
                        <div>
                            <label htmlFor='slug'>Slug:</label>
                            <div className='mt-1'>
                                <input type='text' id='slug' required className={inputSlugError?styles.error:''} onKeyUp={inputSlugKeyUp} value={slug} onChange={(e) => setSlug(e.target.value)} />
                                {inputSlugError?<span className='block mt-2 text-sm text-rose-600 leading-tight'>{inputSlugError}</span>:null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor='title'>Title:</label>
                            <div className='mt-1'>
                                <input type='text' id='title' required value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor='desc'>Description:</label>
                            <div className='mt-1'>
                                <input type='text' id='desc' value={desc} onChange={(e) => setDesc(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <button className='button-primary w-full' type="submit">Create</button>
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

export default AddPage;