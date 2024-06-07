import { useSession } from 'next-auth/react';
import Assets from '../src/assets';
import { getSiteByDomain } from '../src/domain';
import styles from '../styles/Dashboard.module.css';

function AssetsPage(props) {

    const { data: session, status } = useSession();

    function pickFileHandler(s) {
        if(parent)  {
            if(parent.selectAsset) parent.selectAsset(s);
            parent.focus(); // so that document.click on parent works without have to click to focus
        }
    }

    if(props.invalidDomain) {
        return <>Invalid Domain</>;
    }
    
    if(status==='loading') {
        return <div className={`${styles.dashboard} p-8`}>
            <p>Loading...</p>
        </div>
    } else if (status === 'authenticated') {

        return <div className={`${styles.dashboard} p-8`} style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <Assets onPickFile={pickFileHandler} fileType={'all'} select={true}/>
        </div>

    } else if(status==='unauthenticated') {
        return <div className={`${styles.dashboard} p-8`}>
            Please login.
        </div>
    }
}

export async function getServerSideProps(context) {
    return getSiteByDomain(context);
}

export default AssetsPage;