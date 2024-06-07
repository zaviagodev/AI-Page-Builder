import { Fragment, useState, useRef } from "react";
import Assets from './assets';
import styles from '../styles/Dashboard.module.css';
import { Dialog, Transition } from '@headlessui/react';

function AssetButton() {

    const refFocus = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false)
      }
  
      async function openModalHandler(e) {
          e.preventDefault();
  
          setIsOpen(true);
      }

    return <>
        <button className='button-normal w-full justify-start hover:bg-gray-100' onClick={openModalHandler}>Assets</button>

        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
            as="div"
            initialFocus={refFocus}
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={closeModal}>

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
                <div className={`${styles.modal}`} style={{width:'90vw',height:'70vh',maxWidth:'850px',paddingTop:'40px'}}>
                    
                    <Assets fileType={'all'} select={false}/>
                    
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>
        
    </>
}

export default AssetButton;