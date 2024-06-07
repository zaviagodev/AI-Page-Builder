// Catch all unknown routes that starts with /api/auth (for user login or logout, for example)
// Reff: https://next-auth.js.org/getting-started/rest-api
import { connectDatabase } from '../../../src/db';
import { verifyPassword } from '../../../src/auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { hashPassword } from '../../../src/auth';

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                let client;

                try {
                    client = await connectDatabase();
                } catch (error) {
                    throw new Error('Connecting to the database failed.');
                }

                const db = client.db();



                // Check for token in credentials
                if (credentials.token) {
                    try {


                        const response = await axios.post(
                            'https://hosting.zaviago.com/api/method/press.api.account.get', {},
                            {
                                headers: {
                                    Authorization: `Bearer ${credentials.token}` // Add the authorization header
                                }
                            }
                        );
                        var userinfo = response?.data?.message?.user;
                        var user_email = userinfo?.email;
                        var user_name = userinfo?.full_name;

                        const user = await db.collection('users').findOne({
                            email: user_email
                        });

                        if (!user) {
                            
                            const hashedPassword = await hashPassword(credentials.token);
                            await db.collection('users').insertOne({
                                username: user_email,
                                email: user_email,
                                password: hashedPassword
                            });
                            await client.close();
                            const userData = { name: user.username, email: user.email };
                            return userData;


                        }
                        else{
                            const userData = { name: user.username, email: user.email };
                            return userData;
                        }
        
        
                        

                        if (user) {
                            return { name: user.username, email: user.email };
                        } else {
                            // Handle sign-up logic here if the user does not exist
                            const signUpResponse = await axios.post('https://your-service.com/api/signup', { token: credentials.token });
                            const newUser = signUpResponse.data;
                            return { name: newUser.username, email: newUser.email };
                        }
                    } catch (error) {
                        console.error(error);
                        throw new Error(error);
                    }
                }

                // Existing email/password-based flow
               

                const user = await db.collection('users').findOne({
                    email: credentials.email
                });

                if (!user) {
                    await client.close();
                    throw new Error(`Sorry, we couldn't log you in. Please check that you have entered the correct account details.`);
                }

                if (user.inactive) {
                    await client.close();
                    throw new Error(`Sorry, we couldn't log you in.`);
                }

                const isValid = await verifyPassword(credentials.password, user.password);
                if (!isValid) {
                    await client.close();
                    throw new Error('Oops! The password you entered is incorrect. Please try again.');
                }

                await client.close();

                const userData = { name: user.username, email: user.email };
                return userData;
            }
        })
    ],
}

export default NextAuth(authOptions);
