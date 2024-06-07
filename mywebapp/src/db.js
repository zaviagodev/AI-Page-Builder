import { MongoClient } from 'mongodb';
// import path from 'path';

export async function connectDatabase() {
    
    if (process.env.MONGODB_URI) {
        let mongoCertPath = process.env.MONGODB_CERT; //path.resolve('./ca-certificate.crt');
        let client;
        if(mongoCertPath) {
            client = new MongoClient(process.env.MONGODB_URI, {
                ssl: true,
                sslValidate: true,
                sslCA: mongoCertPath,
            });
        } else {
            client = new MongoClient(process.env.MONGODB_URI);
        }
        let clientPromise = client.connect();
        return clientPromise;

    } else {

        const uri = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`;
        const client = await MongoClient.connect(uri);
        return client;
    }
}
