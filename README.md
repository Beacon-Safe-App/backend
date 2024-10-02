# Backend of BEACON SAFE

This is the Express JS backend of the BEACON SAFE app. It uses Mongoose for data storage. 

The following environment variables are expected:
DATABASE_URL - a valid connection string for a MongoDB-compliant database, in our case Azure Cosmos DB with the Mongo API, but that is not required.
PORT - a port on which to run the Express server.
SECRET_ACCESS_TOKEN - used for hashing operations when storing user passwords for authentication.

## Installation Instructions
- clone the repo locally, change into the created directory
- run 'npm install'
- run 'nodemon'