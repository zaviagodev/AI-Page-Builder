import Code from '../src/code';
import { getSiteByDomain } from '../src/domain';
import styles from '../styles/Dashboard.module.css';

function Login(props) {
    if(props.invalidDomain) {
      return <>Invalid Domain</>;
    }

    return <div className={`${styles.dashboard}`} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <Code />
    </div>
}

export async function getServerSideProps(context) {
    return getSiteByDomain(context);
}

export default Login;