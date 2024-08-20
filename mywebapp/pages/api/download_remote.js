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

const getExtensionFromMimeType = (mimeType) => {
    const mimeToExtensionMap = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
        'image/webp': 'webp',
    };
    return mimeToExtensionMap[mimeType] || '';
};


export default async function handler(req, res) {
    // Authenticate user
    const token = await getToken({ req });
    if (!token) {
        return res.status(401).json({ ok: false, status: 401, error: 'Not authenticated!' });
    }

    const username = token.name;

    if (req.method === 'POST') {
        const form = new formidable.IncomingForm({
            maxFileSize: 50 * 1024 * 1024, // 50MB
        });
        
        // Parse the form data
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ ok: false, status: 500, error: 'Form parsing error.' });
            }

            // Check if image file is provided
            const imageFile = files.image;
            if (!imageFile) {
                return res.status(400).json({ ok: false, status: 400, error: 'Image file is required.' });
            }

            try {
                // Read the image file buffer
                const fileBuffer = fs.readFileSync(imageFile.path);

                const fileExtension = getExtensionFromMimeType(imageFile.type);
                if (!fileExtension) {
                    return res.status(400).json({ ok: false, status: 400, error: 'Unsupported file type.' });
                }

                const originalName = path.basename(imageFile.name, path.extname(imageFile.name));
                const timestamp = Date.now();
                const newFileName = `${originalName}-${timestamp}.${fileExtension}`;
                var fileName = newFileName;  

                
                const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
                // Handle file upload to local file system
                const directoryPath = path.join(process.env.WEB_ASSETS_PATH, 'uploads', username, todayDate);
            
                if (!fs.existsSync(directoryPath)) {
                    fs.mkdirSync(directoryPath, { recursive: true });
                }
            
                let imageFileBuffer = fileBuffer;
                if (fileExtension === '.jpeg' || fileExtension === '.jpg') {
                    imageFileBuffer = await sharp(fileBuffer).resize(1920, 1920, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true,
                    })
                    .jpeg({ quality: 80, progressive: true })
                    .toBuffer();
                }
            
                fs.writeFileSync(path.join(directoryPath, fileName), imageFileBuffer);
            
                if (['.jpeg', '.jpg', '.png', '.gif', '.webp', '.webm'].includes(fileExtension)) {
                    const thumbnailDirectoryPath = path.join(directoryPath, 'thumbs');
                    if (!fs.existsSync(thumbnailDirectoryPath)) {
                        fs.mkdirSync(thumbnailDirectoryPath, { recursive: true });
                    }
            
                    const thumbnail = await sharp(fileBuffer).resize(100, 100, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true,
                    }).toBuffer();
            
                    fs.writeFileSync(path.join(thumbnailDirectoryPath, fileName), thumbnail);
                }
            
                return res.status(200).json({
                    ok: true,
                    status: 200,
                    url: `${process.env.WEB_ASSETS_URL}/uploads/${username}/${todayDate}/${fileName}`,
                });
            } catch (error) {
                console.error('Error:', error);
                return res.status(500).json({ ok: false, status: 500, error: 'Error processing image.' });
            }
        });
    } else {
        return res.status(405).json({ ok: false, status: 405, error: 'Method not allowed.' });
    }
}
