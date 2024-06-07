import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import User from './user';
import AddUser from './adduser';
import styles from '../styles/Dashboard.module.css';

function Admin() {

    const [loadedData, setLoadedData] = useState();

    useEffect(()=>{
        getUsers();
    }, []);

    async function getUsers(callback) {

        fetch('/api/users')
        .then(response=>response.json())
        .then(async data=>{
            // console.log(data)
            if(data.error) {
                if(data.status===401) {
                    await signOut({redirect: false});
                    return;
                } else {
                    console.log(data.error);
                }
            }
            if(callback) callback();
            setLoadedData(data);
        });
    }

    async function logoutHandler() {
        await signOut({redirect: false});
        window.location.href = '/admin';
    }

    return <>
        <div className={styles.dashboard}>

            <div className='px-12 py-12'>

                <h1>Admin</h1>

                <div className='flex my-9'>
                    <AddUser onAdd={getUsers} />
                    <button className='button-normal ml-2' onClick={logoutHandler}>Logout</button>
                </div>

                <div className="flex flex-wrap">
                    {loadedData?loadedData.users.map(user=>{
                            return (
                                <User key={user._id} 
                                username={user.username}
                                email={user.email}
                                domainName={user.domainName}
                                enabled={!(user.inactive?true:false)}
                                onUpdate={getUsers} />
                            )
                        }):
                        <div className={styles.dashboard}>
                            <p>Loading...</p>
                        </div>
                    }
                </div>       

            </div>

        </div>
    </>;
}

export default Admin;