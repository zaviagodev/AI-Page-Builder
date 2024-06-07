import styles from '../styles/Notif.module.css';

function Notif(props) {
    if(props.mode) {
        if(props.mode==='wait') {
            return <div className={`${styles.notif} ${styles.wait}`}>
                {props.text}
            </div>
        } else if(props.mode==='error') {
            return <div className={`${styles.notif} ${styles.error}`}>
                {props.text}
            </div>
        } else {
            return <div className={props.notif}>
                {props.text}
            </div>
        }
    } else {
        return null;
    }
}

export default Notif;