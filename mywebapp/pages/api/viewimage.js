import https from 'https';
import http from 'http'; // Import the 'http' module

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    const imageUrl = req.query.url; // Get the image URL from the query parameter

    if (!imageUrl) {
        res.status(400).send('Bad Request');
        return;
    }

    const httpOrHttps = imageUrl.startsWith('https://') ? https : http; // Use 'http' or 'https' module based on the URL

    httpOrHttps.get(imageUrl, (response) => {
        const { statusCode, headers } = response;

        if (statusCode !== 200) {
        res.status(statusCode).send('Image not found');
        return;
        }

        res.setHeader('Content-Type', headers['content-type']);
        response.pipe(res);
    }).on('error', (error) => {
        console.error(error);
        res.status(500).send('Server error');
    });
}
