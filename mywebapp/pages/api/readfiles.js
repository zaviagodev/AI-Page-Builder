// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";
import fs from 'fs';
import path from 'path';
import { ListObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../src/s3client';
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
    // const session = await getServerSession(req, res, authOptions)
    // console.log(session);

    // const session = await getSession( { req: req } );
    // if(!session) {
    //     res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
    //     return;
    // }
    // const username = session.user.name;

    const token = await getToken({ req })
    if (!token) {
        res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
        return;
    }
    const username = token.name;

    if (process.env.SPACES_URL) { // If using DigitalOcean Spaces

        const bucketParams = { 
            Bucket: process.env.SPACES_BUCKET,
            Prefix: username 
        };

        try {
            let files = [];
            const data = await s3Client.send(new ListObjectsCommand(bucketParams));

            if(data.Contents) {
                    data.Contents.sort().reverse();

                    data.Contents.forEach((item)=>{
                    
                    const dateAdded = item.Key.replace(username + '/','').split('/')[0];
                    const fileData = {};
                    if(item.Key.split('/').length>2) { //do not show any file from root
                        fileData.filename = item.Key.replace(username + `/${dateAdded}/`,''); // admin/example.png => example.png
                        // fileData.lastmodified = item.LastModified;
                        // fileData.size = item.Size;
                        fileData.added = item.Key.replace(username + '/','').split('/')[0];
        
                        if(item.Key.indexOf('/thumbs/')===-1) { // Do not read from /thumbs/ folder
                            files.push(fileData);
                        }
                    }
                });
                res.status(200).json({ ok:true, status: 200, files: files, path:  process.env.SPACES_URL + '/' + username});
            } else {
                res.status(200).json({ ok:true, status: 200, files: files, path:  process.env.SPACES_URL + '/' + username});
            }

        } catch (err) {
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
        
    } else {

        return new Promise((resolve, reject) => {

            const directoryPath = path.join(process.env.WEB_ASSETS_PATH, 'uploads/' + username);
            let files = [];

            if (!fs.existsSync(directoryPath)){
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            fs.readdir(directoryPath, (err, items)=>{
                if (err) {
                    res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
                    resolve(); 
                    return;
                }
                const folders = items.filter(item => {
                    let isFolder = fs.lstatSync(path.join(directoryPath, item)).isDirectory();
                    if(isFolder) return true;//path.join(directoryPath, item);
                });

                folders.sort().reverse();

                folders.forEach(folder => {
                    fs.readdirSync(path.join(directoryPath, folder)).forEach( (item) =>{ 
                        if(item!=='thumbs') {
                            const fileData = {};
                            fileData.filename = item;
                            fileData.added = folder;
                            files.push(fileData);
                        }
                    });
                });
                res.status(200).json({ ok:true, status: 200, files: files, path:  process.env.WEB_ASSETS_URL + '/uploads/' + username});
                resolve(); 
                
            });

        });

    }

}
