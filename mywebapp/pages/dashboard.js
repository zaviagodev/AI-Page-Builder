import Dashboard from '../src/dashboard';
import { getSiteByDomain } from '../src/domain';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoginForm from '../src/login-form';

function UserDashboard(props) {

  const { data: session, status } = useSession();

  // Protection: site owner only
  // If accessed from custom domain, prevent login if user is not the site owner
  if(!props.mainHost) { 
    if(session) {
        if(props.owner!==session.user.name) {
          return <>
            <Head>
                <title>Dashboard</title>
                <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <div className={styles.dashboard}>
                <div className='px-12 py-12'>
                    <p>User Not Authorized</p>
                    <p className='mt-3'>
                      <Link href='/login'>Login</Link>
                    </p>
                </div>
            </div>
        </>
        }
    }
  }

  if(status==='loading') {

    return <>
    </>

  } else if (status === 'authenticated') {

    return <>
      <Head>
          <title>Dashboard</title>
          <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Dashboard mainHost={props.mainHost} owner={props.owner} />
    </>;

  } else if(status==='unauthenticated') {

    return <>
      <Head>
          <title>Dashboard</title>
          <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <LoginForm />
    </>;

  }
}

export async function getServerSideProps(context) {
  const siteInfo = await getSiteByDomain(context);

  if(siteInfo.props.invalidDomain) {  
    throw new Error('Invalid Domain.');
  }

  return siteInfo;
}

export default UserDashboard;
