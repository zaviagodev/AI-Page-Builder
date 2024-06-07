// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";
import fs from 'fs';
import path from 'path';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../src/s3client';

async function handler(req, res) {

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

    if(req.method === 'POST') {
        const data = JSON.parse(req.body)
        const filename = data.filename;
        const dateAdded = data.dateAdded;
        // const username = session.user.name;
        if (process.env.SPACES_URL) { // If using DigitalOcean Spaces
            
            const bucketParams = { 
                Bucket: process.env.SPACES_BUCKET,
                Key:`${username}/${dateAdded}/${filename}` 
            };
    
            try {
                await s3Client.send(new DeleteObjectCommand(bucketParams));

                // Delete thumbnail
                let extension = path.extname(filename).toLowerCase();
                if(extension  === '.jpeg' || extension === '.jpg' || extension === '.png' || extension === '.gif') {
                    await s3Client.send(new DeleteObjectCommand({ 
                        Bucket: process.env.SPACES_BUCKET,
                        Key:`${username}/${dateAdded}/thumbs/${filename}` 
                    }));
                }

                res.status(200).json({ ok:true, status: 200 });
            } catch (err) {
                res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
            }

        } else {
            
            const directoryPath = path.join(process.env.WEB_ASSETS_PATH, 'uploads/' + username);

            return new Promise((resolve, reject) => {

                fs.unlink(directoryPath + '/' + dateAdded + '/' + filename, (err)=>{
                    if (err) {
                        res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
                        resolve(); 
                        return;
                    } 

                    // Delete thumbnail
                    let extension = path.extname(filename).toLowerCase();
                    if(extension  === '.jpeg' || extension === '.jpg' || extension === '.png' || extension === '.gif') {
                        fs.unlink(directoryPath + '/' + dateAdded + '/thumbs/' + filename, (err)=>{

                            var files = fs.readdirSync(directoryPath + '/' + dateAdded + '/thumbs/');
                            if (files.length == 0) {
                                fs.rmdirSync(directoryPath + '/' + dateAdded + '/thumbs');
                                fs.rmdirSync(directoryPath + '/' + dateAdded);
                            }

                            res.status(200).json({ ok:true, status: 200 });
                            resolve(); 
                        });
                    } else {
                        res.status(200).json({ ok:true, status: 200 });
                        resolve(); 
                    }
                });
                
            });

        }


    }
}

export default handler;

