import styles from '../styles/Assets.module.css';

function File(props) {

    const src = props.path + (props.path.substr(props.path.length - 1)==='/'?'':'/') + props.added + '/' + props.filename;
    let extension = src.split('.').pop();
    extension = extension.toLowerCase();

    // Get thumbnail
    let srcThumb = src;
    if(extension==='jpg'||extension==='jpeg'||extension==='png'||extension==='gif'||extension==='webp'||extension==='webm') {
        srcThumb = props.path + (props.path.substr(props.path.length - 1)==='/'?'':'/') + props.added + '/thumbs/' + props.filename;
    }

    function selectFile(e) {

        e.target.closest(`.${styles.filelist}`).childNodes.forEach((div)=>{
            div.className = `${styles.file}`;
        });
        e.target.closest('div').className = `${styles.file } ${styles.fileactive}`;

        props.onSelectFile(src);
    }

    function finishSelectFile(e) {
        if (e.key === 'Enter' && props.select) {
            props.onFinishSelectFile(e);
        }
    }

    function limit(string = '', limit = 0) {  
        if(string.length>=limit) {
            return string.substring(0, limit) + '...';
        } else {
            return string.substring(0, limit);
        }
    }

    function showSvgIcon(s, w, h) {
        if(s==='video') {
          return <svg style={{width:w+'px', height:h+'px',marginLeft: '10px', marginTop: '10px'}} viewBox="0 0 512 512"><path d="M0 360h400v-336h-400v336zM72 40v48h-56v-48h56zM72 104v48h-56v-48h56zM72 168v48h-56v-48h56zM72 232v48h-56v-48h56zM72 296v48h-56v-48h56zM312 40v144h-224v-144h224zM312 200v144h-224v-144h224zM384 40v48h-56v-48h56zM384 104v48h-56v-48h56zM384 168v48h-56v-48
          h56zM384 232v48h-56v-48h56zM384 296v48h-56v-48h56z"></path></svg>
        }
    }

    if(extension==='jpg'||extension==='jpeg'||extension==='png'||extension==='gif'||extension==='webp'||extension==='webm'||extension==='ico') {
        return <div tabIndex="0" role="button" onFocus={selectFile} onKeyDown={finishSelectFile} className={`${styles.file} ${props.selected?styles.fileactive:''}`} onClick={selectFile}>
            <span className={styles.filepreview}>
                {/* <Image src={src} alt={props.filename} width={70} height={70} className={styles.imagepreview} /> */}
                <img src={srcThumb} alt={props.filename} className={styles.imagepreview} />
            </span>
            <span style={{fontSize:'13px'}}>{limit(props.filename, 15)}</span>
        </div>
    } else if (extension==='mp4') {
        return <div tabIndex="0" role="button" onFocus={selectFile} className={`${styles.file } ${props.selected?styles.fileactive:''}`} onClick={selectFile}>
            <span>{showSvgIcon('video', 50, 50)}</span>
            <span style={{fontSize:'13px'}}>{limit(props.filename, 15)}</span>
        </div>
    } else {
        // return <div className={`${styles.file } ${props.selected?styles.fileactive:''}`} onClick={selectFile}>
        //     <span> </span>
        // </div>
        return null;
    }
}

export default File;