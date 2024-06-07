import { connectDatabase } from '../../src/db';

async function handler(req, res) {
    let client;
    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(200).json({ message: 'Connecting to the database failed' });
        return;
    }
    res.status(200).json({ message: 'MongoDB connection successful..' });
}

export default handler;