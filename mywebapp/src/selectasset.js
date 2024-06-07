import { Fragment, useState, useRef } from "react";
import Assets from './assets';
import { Dialog, Transition } from '@headlessui/react';
import styles from '../styles/Dashboard.module.css';

function SelectAsset(props) {

    const [isOpen, setIsOpen] = useState(false)

    const refAssets = useRef(null)

    function closeModal() {
        setIsOpen(false)
    }
    
    function modalOpenHandler(e) {
        e.preventDefault();
        setIsOpen(true);
    }

    function pickFileHandler(s) {
        props.onPickFile(s);
        setIsOpen(false);
    }

    function showSvgIcon(s, w, h) {
        if(s==='more') { 
            return <svg style={{pointerEvents: 'none', userSelect: 'none', width:w+'px', height:h+'px'}} viewBox="0 0 512 512"><path d="M113.7 304C86.2 304 64 282.6 64 256c0-26.5 22.2-48 49.7-48 27.6 0 49.8 21.5 49.8 48 0 26.6-22.2 48-49.8 48zM256 304c-27.5 0-49.8-21.4-49.8-48 0-26.5 22.3-48 49.8-48 27.5 0 49.7 21.5 49.7 48 0 26.6-22.2 48-49.7 48zM398.2 304c-27.5 0-49.8-21.4-49.8-48 0-26.5 22.2-48 49.8-48 27.5 0 49.8 21.5 49.8 48 0 26.6-22.2 48-49.8 48z"></path></svg>
        }
    }

    return <>
        <button className="button-normal" onClick={modalOpenHandler} style={{width:45, padding:0}}>{showSvgIcon('more', 20, 20)}</button>
    
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
            as="div"
            initialFocus={refAssets}
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
    
                    <Assets onPickFile={pickFileHandler} fileType={props.fileType} select={true}/>

                    {/* Fake initialFocus */}
                    <button ref={refAssets} className='opacity-0'></button>
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>

    </>;
}

export default SelectAsset;