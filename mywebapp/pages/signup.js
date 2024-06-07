import SignupForm from '../src/signup-form';
import { getSiteByDomain } from '../src/domain';
import Head from 'next/head';

function Signup(props) {

    if(!props.mainHost) return null; // Disable signup from users' custom domain
    if(props.noSignup) return null;
    
    if(props.invalidDomain) {
      return <>Invalid Domain</>;
    }
    return <>
    <Head>
        <title>Signup</title>
        <link rel="icon" href="/images/favicon.ico" />
    </Head>
    <SignupForm />
  </>
}

export async function getServerSideProps(context) {
    return getSiteByDomain(context);
}

export default Signup;