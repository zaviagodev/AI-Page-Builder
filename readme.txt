Readme

To setup the project on your server, you can follow the steps in PDF Guide.

Or, you can quickly get started by running the project locally using the following steps:

1) Install Docker Desktop:

    https://www.docker.com/products/docker-desktop/

2) Unzip the project files:

   - mywebapp/
   - mywebassets/

3) Open terminal, go to mywebapp/ directory and install dependencies:

    $ cd mywebapp

    $ npm install

4) Go to mywebassets/ directory, install dependencies:

    $ cd ../mywebassets

    $ npm install

5) Open the file .env.development and check the configuration.
    You may only need to change the WEB_ASSETS_PATH variable.
    If you want to use the AI Assistant feature, you will need to obtain an OpenAI API Key and set the OPENAI_API_KEY in the .env.development file.

6) Open terminal, go to mywebapp/ directory, and run the following command:

    $ cd ../mywebapp
    
    $ docker-compose up 

    (this is to run mongodb database using docker)

7) Open another terminal, go to mywebapp/ directory, and run the following command:

    $ npm run dev

    (this is to run the main application)

8) Open another terminal, go to mywebassets/ directory, and run the following command:

    $ node mywebassets.js

    (this is to run the assets/storage service)

9) Open from your browser: http://localhost:3000

You can login using:
    Email: you@example.com
    Password: demo

__________________

Optional:
If you want to change the default configuration for database, edit the .env file:
- mywebapp/.mongodb.env

__________________

To setup the project on the server for production, there are 2 options:
1 Follow the steps in the PDF guide, or
2 Follow the steps in the Bonus chapter (SiteBuilderKit-Docker.pdf) for simplified installation (using Docker & Github Actions)

Use option 1 for learning purpose, or use option 2 to quickly get started installing the project 
(similar to the above steps for running the project locally). 
The option 2 also includes video guides showing the installation process.