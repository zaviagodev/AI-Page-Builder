import LoginForm from '../src/login-form';
import { getSiteByDomain } from '../src/domain';

function Login(props) {
    if(props.invalidDomain) {
      return <>Invalid Domain</>;
    }
    return <LoginForm redirect="/dashboard" />
}

export async function getServerSideProps(context) {
    return getSiteByDomain(context);
}

export default Login;