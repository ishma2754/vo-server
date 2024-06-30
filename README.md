# VitalOrgans-Emergency Response App

## Description

VitalOrgans aims to enhance emergency response by providing hospitals access to patient's medical history via patient's registered email. It works as a tool for patient to manage their medical reports, medical details and their personal information.

## Installation

To set up the project locally, follow these steps:

### Install server dependencies:

npm install

### Install client dependencies:

Navigate to the client directory: 

cd client

npm install

### Set up environment variables:

#### For the server: 

##### Create a .env file in the server directory and add the necessary environment variables.

USER_NAME=your-database-username

PASSWORD=your-database-password

HOST=your-database-host

DBPORT=your-database-port

AWS_BUCKET_NAME=your-aws-bucket-name

AWS_BUCKET_REGION=your-aws-bucket-region

AWS_ACCESS_KEY=your-aws-access-key

AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key

#### For the client:

##### Create a .env file in the client directory and add the necessary environment variables.

REACT_APP_SERVERURL=http://localhost:8000

### Usage

To run the project locally, use the following commands:

#### Start the server:

npm run server

#### Start the client

In a new terminal, navigate to the client directory and start the client:

cd client

npm start

This will start the server and client applications. The client will be accessible at http://localhost:3000.

### Project Structure

vitalorgans-app/

├── client/

│   ├── public/                # Static files like index.html

│   ├── src/                   # React components and assets

│   ├── .env                   # Client environment variables

│   ├── package-lock.json      # Client package lock file

│   ├── package.json           # Client-specific dependencies and scripts

│   ├── postcss.config.js      # PostCSS configuration

│   └── tailwind.config.js     # Tailwind CSS configuration

├── server/

│   ├── .env                      # Server environment variables

│   ├── data.sql                  # PostgresSQL script for database setup

│   ├── db.js                     # Database connection setup

│   ├── package.json              # Server-specific dependencies and scripts

│   └── server.js                 # Main server file

├── .gitignore                    # Git ignore file

├── README.md                     # Project README file

└── package.json                  # Project-wide dependencies and scripts

   


