// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../src/s3client';
import sharp from 'sharp';

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

function generateRandomFileName(s) {
    const randomLength = 5;
    const randomString = generateRandomString(randomLength);
    if(s) return `ai-${randomString}-${s}`;
    else return `ai-${randomString}`;
}

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

    if(req.method !== 'POST') return;

    const { image, folder_path } = req.body;

    const upscaleImageUrl = 'https://api.getimg.ai/v1/enhacements/upscale';

    const GETIMG_API_KEY = process.env.GETIMG_API_KEY;

    const messages = { 
        model: 'real-esrgan-4x',
        image: image,
        scale: 4,
        output_format: "jpeg"
    };
    
    const jsonPayload = JSON.stringify(messages);
    const config = {
        headers: {
            Authorization: `Bearer ${GETIMG_API_KEY}`,
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(upscaleImageUrl, jsonPayload, config);
    if(!response.data.error){


        let todayDate = new Date().toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}); // 2020-08-19 (year-month-day) notice the different locale
        let base64Data=response.data.image;

        let contentType='image/jpeg';

        const fileData = new Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        let imageFile=fileData;
        let randomFileName = generateRandomFileName('lg');
        let filename = randomFileName + '.jpg';

        if (process.env.SPACES_URL) { // If using DigitalOcean Spaces

            const bucketParams = {
                Bucket: process.env.SPACES_BUCKET,
                ACL: 'public-read',
                Key: `${username}/${todayDate}/${filename}`, 
                Body: imageFile,
                ContentEncoding: 'base64', 
                ContentType: contentType
            };

            try {
                await s3Client.send(new PutObjectCommand(bucketParams));
                
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

                res.status(200).json({ ok:true, status: 200, url:  process.env.SPACES_URL + '/' + username + '/' + todayDate + '/' + filename});
            } catch (e) {
                res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
            }

        } else {
            return new Promise((resolve, reject) => {

                const directoryPath = path.join(process.env.WEB_ASSETS_PATH, 'uploads/' + username + '/' + todayDate);

                if (!fs.existsSync(directoryPath)){
                    fs.mkdirSync(directoryPath, { recursive: true });
                }
                if (!fs.existsSync(directoryPath + '/thumbs')){
                    fs.mkdirSync(directoryPath + '/thumbs', { recursive: true });
                }
    
                let imageFile=base64Data;
    
                fs.writeFile(directoryPath + '/' + filename, imageFile, 'base64', async (err)=>{
                    if (err) {
                        res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
                        resolve(); 
                        return;
                    } 
    
                    // Create thumbnails in /thumbs/ folder
                    let img = new Buffer.from(base64Data, 'base64');
                    let thumbnail = await sharp(img).resize(100, 100, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true, 
                    }).toBuffer();
                    
                    fs.writeFile(directoryPath + '/thumbs/' + filename, thumbnail, 'base64', (err)=>{
    
                        if (err) {
                            res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
                            resolve(); 
                            return;
                        }
                        let fileUrl = process.env.WEB_ASSETS_URL + '/uploads/' + username + '/' + todayDate + '/' + filename;

                        res.status(200).json({ ok:true, status: 200, url: fileUrl});
                        resolve(); 
                    });
              
                });

            });

        }

    } else {
        res.json({ error: 'Something went wrong.' });
    }

}

export default handler;
