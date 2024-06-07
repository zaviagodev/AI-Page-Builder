import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Dashboard.module.css';

function SignupForm() {

    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signingUp, setSigningUp] = useState(false);

    const [ inputUsernameError, setInputUsernameError] = useState('');

    async function submitHandler(event) {
        event.preventDefault();

        if(!checkValidUsername(username)) {
            setInputUsernameError('Requires lowercase letters, numbers, or hyphens.');
            return;
        }

        setSigningUp(true);

        try {
            const result = await createUser(username, email, password);
            if(!result.error) { 
                // setMessage('User created successfully.');
                window.location.href = '/login?signup=ok';
            } else {
                setMessage(result.error);
                setSigningUp(false);
            }
        } catch(error) {
            setMessage('Something went wrong!');
            setSigningUp(false);
        }
    }
    
    async function createUser(username, email, password) {
        const reqBody = { username, email, password };
        let result = await fetch('/api/auth/signup', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        return result;
    }

    function checkValidUsername(str) {
        const regexExp = /^[a-z0-9]+(-[a-z0-9]+)*$/g;
        return regexExp.test(str);
    }

    function inputUsernameKeyUp() {
        setInputUsernameError('');
    }

    return <>
        <Head>
            <title>Signup</title>
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <div className={styles.dashboard + ' mx-auto max-w-[400px] h-[50vh] flex flex-col justify-center'}>
            
            <h1>Signup</h1>

            <form className='mt-6 space-y-6' onSubmit={submitHandler}>

                <div>
                    <label htmlFor='username'>Username:</label>
                    <div className='mt-1'>
                        <input type="text" id="username" required className={inputUsernameError?styles.error:''} onKeyUp={inputUsernameKeyUp} onChange={(e)=>setUsername(e.target.value)} />
                        {inputUsernameError?<span className='text-sm text-rose-600'>{inputUsernameError}</span>:null}
                    </div>
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <div className='mt-1'>
                        <input type="text" id="email" required onChange={(e)=>setEmail(e.target.value)} />
                    </div>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <div className='mt-1'>
                        <input type="password" id="password" required onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                </div>
                <div>

                    {signingUp?<>
                        <button type="button" className="button-wait w-full" disabled="">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Create Account
                        </button>
                    </>:<>
                        <button className="button-primary w-full" type="submit">Create Account</button>
                    </>}
                </div>
                {message?<div className='text-rose-600'>{message}</div>:null}
             
            </form>
        </div>
    </>;
}

export default SignupForm;