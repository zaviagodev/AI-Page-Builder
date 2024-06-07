import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Site from './site';
import Account from './account';
import Page from './page';
import AssetButton from './assetbutton';
import AddPage from './addpage';
import styles from '../styles/Dashboard.module.css';

function Dashboard(props) {

    const [loadedData, setLoadedData] = useState();

    useEffect(()=>{
        getPages();
    }, []);

    async function getPages(callback) {

        fetch('/api/pages')
        .then(response=>response.json())
        .then(data=>{
            if(callback) callback();
            setLoadedData(data);
        });
    }

    async function logoutHandler() {
        await signOut({redirect: false});
    }
    
    return <>
        <div className={styles.dashboard}>

            <div className='flex flex-col items-start min-w-[256px] p-4 gap-2 border-r border-r-[#F4F4F4] h-screen'>
                <AddPage onAdd={getPages} />
                <AssetButton fileType={'all'}/>
                <Site mainHost={props.mainHost} owner={props.owner} />
                <Account />
                <button className='button-normal w-full justify-start hover:bg-gray-100' onClick={logoutHandler}>Logout</button>
            </div>

            <div className='p-12 w-full bg-front-gradient'>

                <h1>Dashboard</h1>


                <div className="flex flex-wrap">
                    {loadedData?loadedData.pages.map(page=>{
                            return (
                                <Page key={page.slug} slug={page.slug} title={page.title} online={page.online} mainHost={props.mainHost} onUpdate={getPages} />
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

export default Dashboard;