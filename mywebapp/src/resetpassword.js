import { useState, useEffect } from 'react';
import styles from '../styles/Dashboard.module.css';

function ResetPassword() {

    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [passwordUpdating, setPasswordUpdating] = useState(false);

    useEffect(()=>{
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let token = params.get('token');
        setToken(token);
    }, []);

    async function submitHandler(e) {
        e.preventDefault();

        setPasswordUpdating(true);

        const reqBody = { token: token, password: password };
        let result = await fetch('/api/resetpassword', {
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
            setPasswordChanged(true);
            setPasswordUpdating(false);
        }
    }

    return <>
        <div className={styles.dashboard + ' mx-auto max-w-[400px] md:mt-20 mt-10 px-4 flex flex-col justify-center'}>
             
            <h1>Reset Password</h1> 

            {passwordChanged?<>
                <p className='mt-6'>Your password has been updated.</p>
                <p className='mt-3'><a className='underline' href="/login">You can login here</a></p>
            </>:<>
                <form className='mt-6 space-y-6' onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="password">New Password:</label>
                        <div className='mt-1'>
                            <input type="password" id="password" value={password} required onChange={(e)=>setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        {passwordUpdating?<>
                            <button type="button" className="button-wait w-full" disabled="">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Update
                            </button>
                        </>:<>
                            <button className='button-primary w-full' type="submit">Update</button>
                        </>}
                    </div>
                    {message?<div className='text-rose-600'>{message}</div>:null}
                    <div>
                        <a className='underline' href="/">Login</a>
                    </div>
                </form>
            </>}

        </div>
     </>
}

export default ResetPassword;