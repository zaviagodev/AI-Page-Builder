import { Fragment, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import styles from '../styles/Dashboard.module.css';

function DeleteFile(props) {

    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false)
    }
    
    async function deleteHandler(e) {
        e.preventDefault();

        const filename = props.filename.split('\\').pop().split('/').pop();
        const dateAdded = props.filename.replace(`/${filename}`,'');

        const reqBody = { 
            filename: filename, 
            dateAdded: dateAdded
        };
        let result = await fetch('/api/deletefile', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            props.onFileDeleted(()=>{
                setIsOpen(false);
            });
        } else {
            alert(result.error);
            setIsOpen(false);
        }
    }

    function deleteConfirmHandler(e) {
        e.preventDefault();

        setIsOpen(true);
    }

    return <>
        <button className="button-normal mb-1" onClick={deleteConfirmHandler}>Delete file permanently</button>
        
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
            as="div"
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={closeModal}>

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

                    <p style={{marginBottom: '40px'}}>
                    Are you sure you want to delete this file?
                    </p>
                    <h3>{props.filename.split('\\').pop().split('/').pop()}</h3>
                        
                    <div className='form-actions' style={{marginTop: '40px'}}>
                        <button className='button-warning w-full' onClick={deleteHandler}>Delete</button>
                    </div>

                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>

    </>;
}

export default DeleteFile;