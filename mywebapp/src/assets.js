import React, { Fragment, useState, useEffect, useRef } from "react";
import File from './file';
import DeleteFile from './deletefile';
import DropZone from './dropzone';
import { Tab } from '@headlessui/react';
import stylesDashboard from '../styles/Dashboard.module.css';
import styles from '../styles/Assets.module.css';

function Assets(props) {

    const refFileList = useRef(null)

    const [ loadedData, setLoadedData] = useState();

    const pageSize = 25;
    const [ paging, setPaging] = useState({
        limit: pageSize,
        offset:0,
    });

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedFile, setSelectedFile] = useState();
    const fileInputRef = React.createRef();

    useEffect(()=>{
        getFiles();
    }, []);

    function handleScroll(e) {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) { 
            // console.log(paging.limit+pageSize)
            setPaging({
                offset: 0,
                limit: paging.limit+pageSize,
            });
        }
    }

    async function getFiles(callback) {
        
        const reqBody = {};
        let result = await fetch('/api/readfiles', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            if(callback) callback();
            setLoadedData(result);
        } else {
            alert(result.error);
            setLoadedData({ok: true, status: 200, files:[]});
        }
    }

    const filesUploadedHandler = () => {

        setSelectedIndex(0);

        getFiles();
    }

    function selectFileHandler(s) {
        fileInputRef.current.value = s;

        const filename = s.split('\\').pop().split('/').pop();
        const dateAdded = s.replace(`/${filename}`,'').split('\\').pop().split('/').pop();

        setSelectedFile(dateAdded+'/'+filename);
    }

    function fileDeletedHandler(callback) {
        getFiles(()=>{
            if(callback) callback();

            fileInputRef.current.value = ''; // must be after callback

            setSelectedFile(null);
            // Unselect
            const btns = refFileList.current.querySelectorAll('[role=button]');
            btns.forEach((btn)=>{
                if(btn.className.indexOf('fileactive')!==-1) {
                    btn.className=btn.className.replace('fileactive','');
                }
            });
        });
    }

    function pickFileHandler(e) {
        e.preventDefault();

        const s = fileInputRef.current.value;
        
        let extension = s.split('.').pop();
        extension = extension.toLowerCase();
        
        let ok=false;
        if(props.fileType==='all') {

            ok = true;

        } else if(props.fileType==='media') {

            if(extension==='jpg'||extension==='jpeg'||extension==='png'||extension==='gif'||extension==='webp'||extension==='webm'||extension==='ico'||extension==='mp4') {
                ok = true;
            } else {
                alert(('Please select an image or video file.'));
            }

        } else if(props.fileType==='image') {

            if(extension==='jpg'||extension==='jpeg'||extension==='png'||extension==='gif'||extension==='webp'||extension==='webm'||extension==='ico') {
                ok = true;
            } else {
                alert(('Please select an image file.'));
            }

        } else if(props.fileType==='video') {

            if(extension==='mp4') {
                ok = true;
            } else {
                alert(('Please select an mp4 file.'));
            }

        }
        if(!ok) return;
        
        props.onPickFile(s);
    }

    return <>

        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className='flex justify-center items-start'>
            <Tab.List className="flex relative z-10 justify-center p-1 space-x-3 bg-white dark:bg-[#7676803D] w-50 rounded-lg">
                <Tab as={Fragment}>
                {({ selected }) => (
                    <button className={selected ? stylesDashboard.tabactive : stylesDashboard.tab}>
                    Browse
                    </button>
                )}
                </Tab>
                <Tab as={Fragment}>
                {({ selected }) => (
                    <button className={selected ? stylesDashboard.tabactive : stylesDashboard.tab}>
                    Upload
                    </button>
                )}
                </Tab>
            </Tab.List>
            </div>
            <Tab.Panels>
                <Tab.Panel className={styles.tabcontent}>
                    
                    <div ref={refFileList} className={styles.filelist} onScroll={handleScroll}>
                    {loadedData?loadedData.files.slice(paging.offset,paging.limit).map((file,i)=>{
                        return (
                            <File 
                                select={props.select}
                                key={`list${i}`} 
                                path={loadedData.path} 
                                filename={file.filename} 
                                added={file.added} 
                                fileType={'all'} 
                                selected={false}
                                onSelectFile={selectFileHandler} 
                                onFinishSelectFile={pickFileHandler} />
                        )

                        }):<p>Loading...</p>
                    }
                    </div>
                    <div className='flex' style={{padding:'10px 40px 40px', height: '124px', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end'}}>
                        <div className='flex' style={{height:50, width: '100%', justifyContent: 'space-between'}}>
                            {selectedFile? <DeleteFile onFileDeleted={fileDeletedHandler} filename={selectedFile} /> : <div></div> }
                        </div>
                        <div style={{display:'flex', width:'100%'}}>
                            <input type='text' id='fileInput' ref={fileInputRef} />
                            {props.select?<button className='button-normal ml-2' onClick={pickFileHandler}>Select</button>:null}
                        </div>
                    </div>

                </Tab.Panel>
                <Tab.Panel className={styles.tabcontent}>
                    
                    <DropZone onFilesUploaded={filesUploadedHandler} />

                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>

    </>;
}

export default Assets;