// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";
import fs from 'fs';
import path from 'path';
import formidable from 'formidable-serverless';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../src/s3client';
import sharp from 'sharp';

export const config = {
    api: {
      bodyParser: false,
    },
};

export default async function handler(req, res) {

    // const session = await getSession( { req: req } );
    // if(!session) {
    //     res.status(200).json({ ok:true, status: 400, error: 'Not authenticated!' });
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

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {

            if (err) return res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });

            let extension = path.extname(files.file.name).toLowerCase();
            if(extension  !== '.jpeg' && extension !== '.jpg' && extension !== '.png' && extension !== '.gif' && extension !== '.ico' && extension  !== '.webp' && extension  !== '.webm' && extension  !== '.mp4' && extension  !== '.mp3') {
                res.status(500).json({ ok:true, status: 500, error: 'File type not allowed.' });
                return;
            }
            
            const file = fs.readFileSync(files.file.path);

            let todayDate = new Date().toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}); // 2020-08-19 (year-month-day) notice the different locale
                
            // File will be uploaded in /username/date/
            // Thumbnail will be created in /username/date/thumbs/

            if (process.env.SPACES_URL) { // If using DigitalOcean Spaces

                let imageFile = file;
                if(extension  === '.jpeg' || extension === '.jpg') {
                    imageFile = await sharp(files.file.path).resize(1920, 1920, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true, 
                    })
                    .jpeg({ quality: 70, progressive: true, force: false })
                    .toBuffer();
                }

                const bucketParams = {
                    Bucket: process.env.SPACES_BUCKET,
                    ACL: 'public-read',
                    Key: `${username}/${todayDate}/${files.file.name}`, 
                    Body: imageFile,
                    ContentType: files.file.type//contentType
                };
                try {
                    await s3Client.send(new PutObjectCommand(bucketParams));
                    
                    // Create thumbnails in /thumbs/ folder
                    if(extension  === '.jpeg' || extension === '.jpg' || extension === '.png' || extension === '.gif' || extension === '.webp' || extension === '.webm') {
                        let thumbnail = await sharp(files.file.path).resize(100, 100, {
                            fit: sharp.fit.inside,
                            withoutEnlargement: true, 
                        }).toBuffer();
                        await s3Client.send(new PutObjectCommand({
                            Bucket: process.env.SPACES_BUCKET,
                            ACL: 'public-read',
                            Key: `${username}/${todayDate}/thumbs/${files.file.name}`, 
                            Body: thumbnail,
                            ContentType: files.file.type//contentType
                        }));
                    }

                    res.status(200).json({ ok:true, status: 200, url:  process.env.SPACES_URL + '/' + username + '/' + todayDate + '/' + files.file.name});
                } catch(e) {
                    res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
                }

            } else {
                
                const directoryPath = path.join(process.env.WEB_ASSETS_PATH, 'uploads/' + username);

                // Thumbs folder
                if (!fs.existsSync(`${directoryPath}/${todayDate}/thumbs`)){
                    fs.mkdirSync(`${directoryPath}/${todayDate}/thumbs`, { recursive: true });
                }

                let imageFile = file;
                if(extension  === '.jpeg' || extension === '.jpg') {
                    imageFile = await sharp(files.file.path).resize(1920, 1920, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true, 
                    })
                    .jpeg({ quality: 80, progressive: true, force: false })
                    .toBuffer();
                }

                fs.writeFile(`${directoryPath}/${todayDate}/${files.file.name}`, imageFile, async (err)=>{
                    if (err) {
                        res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
                        return 
                    } 

                    // Create thumbnails in /thumbs/ folder
                    if(extension  === '.jpeg' || extension === '.jpg' || extension === '.png' || extension === '.gif'|| extension === '.webp' || extension === '.webm') {
                        let thumbnail = await sharp(files.file.path).resize(100, 100, {
                            fit: sharp.fit.inside,
                            withoutEnlargement: true, 
                        }).toBuffer();

                        fs.writeFile(`${directoryPath}/${todayDate}/thumbs/${files.file.name}`, thumbnail, (err)=>{
                            if (err) {
                                res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
                                return 
                            } 
                            res.status(200).json({ ok:true, status: 200, url:  process.env.WEB_ASSETS_URL + '/uploads/' + username + '/' + todayDate + '/' + files.file.name});
                        });
                    } else {
                        res.status(200).json({ ok:true, status: 200, url:  process.env.WEB_ASSETS_URL + '/uploads/' + username + '/' + todayDate + '/' + files.file.name});
                    }
                    
                });

            }

        });
         
    }
}