import Admin from '../src/admin';
import { getSiteByDomain } from '../src/domain';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoginForm from '../src/login-form';
import styles from '../styles/Dashboard.module.css';

function AdminPanel(props) {

  const { data: session, status } = useSession();

  // Protection: admin only
  let isAdmin = false;
  if(props.owner) {
      if(session) {
          if(props.owner===session.user.name && session.user.name==='admin') {
              isAdmin=true;
          }
      }
  }
  if(!isAdmin) { 
      if(session) {
        return <>
            <Head>
                <title>Admin</title>
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

  if(status==='loading') {

    return <>
    </>

  } else if (status === 'authenticated') {

    return <>
      <Head>
          <title>Admin</title>
          <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Admin />
    </>;

  } else if(status==='unauthenticated') {

    return <>
      <Head>
          <title>Admin</title>
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

export default AdminPanel;
