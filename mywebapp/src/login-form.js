import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styles from '../styles/Dashboard.module.css';
import axios from 'axios';


function LoginForm(props) {

    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgot, setForgot] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailSending, setEmailSending] = useState(false);
    const [logingIn, setLogingIn] = useState(false);

    const [signupOk, setSignupOk] = useState(false);
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search) 
        if(params.get('signup')==='ok') {
            setSignupOk(true);
        }
        const token = params.get('token');
        if (token) {
            handleToken(token);
        }


    }, []);

    const handleToken = async (token) => {

        const result = await signIn('credentials', { 
            redirect: false,
            token: token,
        });
        if(!result.error) { 
            if(props.redirect) {
                window.location.href = props.redirect;
            }
        } else { 
            setMessage(result.error);
            setLogingIn(false);
        }
    };


    function forgotPassword(e) {
        e.preventDefault();
        setForgot(!forgot);
        setEmailSent(false);
        setMessage('');
    }

    async function forgotHandler(e) {
        e.preventDefault();

        setEmailSending(true);

        const reqBody = { email: email };
        let result = await fetch('/api/requesttoken', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(result.error) { 
            setMessage(result.error);
        } else {
            setMessage('');
            setEmailSent(true);
        }
        setEmailSending(false);
    }

    async function submitHandler(event) {
        event.preventDefault();

        setLogingIn(true);

        const result = await signIn('credentials', { 
            redirect: false,
            email: email,
            password: password 
        });
        if(!result.error) { 
            if(props.redirect) {
                window.location.href = props.redirect;
            }
        } else { 
            setMessage(result.error);
            setLogingIn(false);
        }
    }

    return <>
        <div className={styles.dashboard + ' mx-auto max-w-[400px] h-[50vh] flex flex-col justify-center'}>
            {!forgot?<>
                <h1>Login</h1>

                {signupOk?
                <p className='mt-6 font-semibold'>Your account has been created successfully!<br></br>Please login here.</p>:
                null}   

                <form className='mt-6 space-y-6' onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <div className='mt-1'>
                            <input type="email" id="email" required onChange={(e)=>setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <div className='mt-1'>
                            <input type="password" id="password" required onChange={(e)=>setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        {logingIn?<>
                            <button type="button" className="button-wait w-full" disabled="">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Login
                            </button>
                        </>:<>
                            <button className='button-primary w-full' type="submit">Login</button>
                        </>}
                    </div>
                    {message?<div className='text-rose-600'>{message}</div>:null}

                    <div>
                        <a className='underline' href='#' onClick={forgotPassword}>Forgot Password</a>
                    </div>
                </form>
            </>:<>
                <h1>Forgot Password</h1>

                {emailSent?<>
                    <p className='mt-6'>Password reset instruction has been sent to your email.</p>
                    <div className='mt-6'>
                        <a className='underline' href='#' onClick={forgotPassword}>Login</a>
                    </div>
                </>:<>
                    <form className='max-w-[400px] mt-6 space-y-6' onSubmit={forgotHandler}>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <div className='mt-1'>
                                <input type="email" id="email" required onChange={(e)=>setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            {emailSending?<>
                                <button type="button" className="button-wait w-full" disabled="">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Reset Your Password
                                </button>
                            </>:<>
                                <button className='button-primary w-full' type="submit">Reset Your Password</button>
                            </>}
                        </div>
                        {message?<div className='text-rose-600'>{message}</div>:null}

                        <div>
                            <a className='underline' href='#' onClick={forgotPassword}>Login</a>
                        </div>
                    </form>
                </>}

            </>}
        </div>
    </>;
}

export default LoginForm;