import React, { useState, useEffect } from 'react';
import styles from '../styles/Assets.module.css';

// https://blog.logrocket.com/create-a-drag-and-drop-component-with-react-dropzone/
const DropZone = (props) => {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);

    const fileInputRef = React.createRef();
    const uploadModalRef = React.createRef();
    const uploadRef = React.createRef();
    const progressRef = React.createRef();

    useEffect(() => {
        let filteredArray = selectedFiles.reduce((file, current) => {
            const x = file.find(item => item.name === current.name);
            if (!x) {
                return file.concat([current]);
            } else {
                return file;
            }
        }, []);
        setValidFiles([...filteredArray]);
    
    }, [selectedFiles]);

    const dragOver = (e) => {
        e.preventDefault();
    }
    
    const dragEnter = (e) => {
        e.preventDefault();
    }
    
    const dragLeave = (e) => {
        e.preventDefault();
    }
    
    const fileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }
    
    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/vnd.microsoft.icon', 'image/webp', 'image/webm', 'image/x-icon', 'video/mp4'];
        if (validTypes.indexOf(file.type) === -1) {
            return false;
        }
        return true;
    }

    const fileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    const handleFiles = (files) => {
        for(let i = 0; i < files.length; i++) {
            if (validateFile(files[i])) {
                // add to an array so we can display the name of file
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
            } else {
                // add a new property called invalid
                files[i]['invalid'] = true;
                // add to the same array so we can display the name of the file
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
                // set error message
                setErrorMessage('File type not permitted');

                setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
            }
        }
    }

    const removeFile = (name) => {
        // find the index of the item
        // remove the item from array
    
        const validFileIndex = validFiles.findIndex(e => e.name === name);
        validFiles.splice(validFileIndex, 1);
        // update validFiles array
        setValidFiles([...validFiles]);
        const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
        selectedFiles.splice(selectedFileIndex, 1);
        // update selectedFiles array
        setSelectedFiles([...selectedFiles]);

        const unsupportedFileIndex = unsupportedFiles.findIndex(e => e.name === name);
        if (unsupportedFileIndex !== -1) {
            unsupportedFiles.splice(unsupportedFileIndex, 1);
            // update unsupportedFiles array
            setUnsupportedFiles([...unsupportedFiles]);
        }
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }

    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    }

    const showSvgIcon = (s, w, h) => {
        if(s==='document') {
            return <svg style={{width:w+'px', height:h+'px'}} viewBox="0 0 512 512">
              <path d="M399.3 168.9c-.7-2.9-2-5-3.5-6.8l-83.7-91.7c-1.9-2.1-4.1-3.1-6.6-4.4-2.9-1.5-6.1-1.6-9.4-1.6H136.2c-12.4 0-23.7 9.6-23.7 22.9v335.2c0 13.4 11.3 25.9 23.7 25.9h243.1c12.4 0 21.2-12.5 21.2-25.9V178.4c0-3.6-.4-6.2-1.2-9.5zM305.5 111l58 63.5h-58V111zm-161 305.5v-320h129v81.7c0 14.8 13.4 28.3 28.1 28.3h66.9v210h-224z"/>
          </svg>
        } else if(s==='delete') {
            return <svg style={{width:w+'px', height:h+'px'}} viewBox="0 0 512 512">
                <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"/>
            </svg>
          }
    }

    const uploadSingleFile = async (selectedFile, callback) => {

        const formData = new FormData();
        formData.append('file', selectedFile);
        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        .then(response=>response.json())
        .then(data=>{
            if(callback) callback(data);
        });

    }

    const uploadFiles = (e) => {
        e.preventDefault();

        uploadModalRef.current.style.display = 'block';
        uploadRef.current.innerHTML = 'File(s) Uploading...';

        let done = 0;
        for (let i = 0; i < validFiles.length; i++) {

            uploadSingleFile(validFiles[i], ()=>{
                done++;
                if(done===validFiles.length) {
                    uploadModalRef.current.style.display = '';
                    validFiles.length = 0;
                    setValidFiles([...validFiles]);
                    setSelectedFiles([...validFiles]);
                    setUnsupportedFiles([...validFiles]);

                    props.onFilesUploaded();
                }
            });

        }

    }

    return (
        <div className={styles.uploadpanel}>
            {unsupportedFiles.length === 0 && validFiles.length ? <button className='button-normal' style={{transform:'translateY(-45px)'}} onClick={uploadFiles}>Upload Files</button> : ''} 
            {unsupportedFiles.length ? <p className={styles.fileunsupportedmessage}>Please remove all unsupported files.</p> : ''}

            <div className={styles.dropcontainer} onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                onClick={fileInputClicked}
                >
                <div className={styles.dropmessage}>
                    Drag &amp; Drop files here or click to upload
                </div>
                <input
                    ref={fileInputRef}
                    className={styles.fileinput}
                    type="file"
                    multiple
                    onChange={filesSelected}
                />
            </div>
                
            <div className={styles.filedisplaycontainer}>
                {
                    validFiles.map((data, i) => 
                        <div className={styles.filestatusbar} key={i}>
                            <div className={styles.fileinfo}>
                                <div className={styles.filetypelogo}>{showSvgIcon('document', 20, 20)}</div>
                                <div className={styles.filetype}>{fileType(data.name)}</div>
                                <span className={`${styles.filename} ${data.invalid ? styles.fileerror : ''}`}>{data.name}</span>
                                <span className={styles.filesize}>({fileSize(data.size)})</span> 
                            </div>
                            <div className={styles.fileremove} onClick={() => removeFile(data.name)}>{showSvgIcon('delete',20,20)}</div>
                            {data.invalid && <span className={styles.fileerrormessage}>({errorMessage})</span>}
                        </div>
                    )
                }
            </div>

            <div className={styles.paneluploading} ref={uploadModalRef}>
                <span ref={uploadRef}></span>
                <div className={styles.progress}>
                    <div className={styles.progressbar} ref={progressRef}></div>
                </div>
            </div>
        </div>
    )
}

export default DropZone;