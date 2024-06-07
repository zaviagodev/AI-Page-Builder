import ResetPassword from '../src/resetpassword';
import Head from 'next/head';

function ResetPasswordPage(props) {

    return <>
        <Head>
            <title>Reset your Password</title>
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <ResetPassword />
    </>
}

export default ResetPasswordPage;