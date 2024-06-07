// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";
import fs from 'fs';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../src/s3client';
import sharp from 'sharp';

async function handler(req, res) {

    // const session = await getSession( { req: req } );
    // if(!session) {
    //     res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
    //     return;
    // }

    const token = await getToken({ req })
    if (!token) {
        res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
        return;
    }
    const username = token.name;

    if(req.method === 'POST') {
        // const username = session.user.name;
        const base64Data = req.body.image;
        const filename = req.body.filename;

        let todayDate = new Date().toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}); // 2020-08-19 (year-month-day) notice the different locale
            
        if (process.env.SPACES_URL) { // If using DigitalOcean Spaces

            const fileData = new Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64');

            let extension = path.extname(filename).toLowerCase();
            if(extension  !== '.jpeg' && extension !== '.jpg' && extension !== '.png' && extension !== '.gif' && extension  !== '.mp4') {
                res.status(500).json({ ok:true, status: 500, error: 'File type not allowed.' });
                return;
            }

            let contentType = 'application/octet-stream';
            if(extension  === '.jpeg' || extension === '.jpg') {
                contentType='image/jpeg';
            } else if (extension === '.png') {
                contentType='image/png';
            } else if (extension === '.gif') {
                contentType='image/gif';
            } else if(extension  === '.mp4') {
                contentType='video/mp4';
            }

            let imageFile=fileData;
            if(extension  === '.jpeg' || extension === '.jpg') {
                let img = new Buffer.from(base64Data, 'base64');
                imageFile = await sharp(img).resize(1920, 1920, {
                    fit: sharp.fit.inside,
                    withoutEnlargement: true, 
                })
                .jpeg({ quality: 70, progressive: true, force: false })
                .toBuffer();
            }

            const bucketParams = {
                Bucket: process.env.SPACES_BUCKET,
                ACL: 'public-read',
                Key: `${username}/${todayDate}/${filename}`, 
                Body: imageFile, 
                ContentEncoding: 'base64', 
                ContentType: contentType
            };

            try {
                const data = await s3Client.send(new PutObjectCommand(bucketParams));

                // Create thumbnails in /thumbs/ folder
                if(extension  === '.jpeg' || extension === '.jpg' || extension === '.png' || extension === '.gif' || extension === '.webp' || extension === '.webm') {
                    let img = new Buffer.from(base64Data, 'base64');
                    let thumbnail = await sharp(img).resize(100, 100, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true, 
                    }).toBuffer();
                    await s3Client.send(new PutObjectCommand({
                        Bucket: process.env.SPACES_BUCKET,
                        ACL: 'public-read',
                        Key: `${username}/${todayDate}/thumbs/${filename}`, 
                        Body: thumbnail,
                        ContentType: contentType
                    }));
                }

                res.status(200).json({ ok:true, status: 200, url:  process.env.SPACES_URL + '/' + username + '/' + todayDate + '/' + filename});
            } catch (e) {
                res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
            }

        } else {
            
            let extension = path.extname(filename).toLowerCase();

            const directoryPath = path.join(process.env.WEB_ASSETS_PATH, 'uploads/' + username + '/' + todayDate);

            if (!fs.existsSync(directoryPath)){
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            if (!fs.existsSync(directoryPath + '/thumbs')){
                fs.mkdirSync(directoryPath + '/thumbs', { recursive: true });
            }

            let imageFile=base64Data;
            if(extension  === '.jpeg' || extension === '.jpg') {
                let img = new Buffer.from(base64Data, 'base64');
                imageFile = await sharp(img).resize(1920, 1920, {
                    fit: sharp.fit.inside,
                    withoutEnlargement: true, 
                })
                .jpeg({ quality: 70, progressive: true, force: false })
                .toBuffer();
            }
    
            fs.writeFile(directoryPath + '/' + filename, imageFile, 'base64', async (err)=>{
                if (err) {
                    res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
                    return 
                } 

                // Create thumbnails in /thumbs/ folder
                if(extension  === '.jpeg' || extension === '.jpg' || extension === '.png' || extension === '.gif' || extension === '.webp' || extension === '.webm') {
                    let img = new Buffer.from(base64Data, 'base64');
                    let thumbnail = await sharp(img).resize(100, 100, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true, 
                    }).toBuffer();
                    
                    fs.writeFile(directoryPath + '/thumbs/' + filename, thumbnail, 'base64', (err)=>{

                        if (err) {
                            res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
                            return 
                        }
    
                        res.status(200).json({ ok:true, status: 200, url:  process.env.WEB_ASSETS_URL + '/uploads/' + username + '/' + todayDate + '/' + filename});
                    });
                } else {
                    res.status(200).json({ ok:true, status: 200, url:  process.env.WEB_ASSETS_URL + '/uploads/' + username + '/' + todayDate + '/' + filename});
                }
          
            });

        }

    }
}

export default handler;