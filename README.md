# Instagram-like Social Media App

## Description
This project is an Instagram-like social media application designed to allow users to share photos and videos, follow other users, and interact with posts through likes and comments. It aims to provide a platform for users to connect and share their moments with friends and family.

## Features
- User authentication and profile management.
- Posting photos.
- Liking and commenting on posts.
- Following and unfollowing users.

## Installation and Configuration
To set up this project locally, follow these steps:
1. Clone the repository:
   `git clone https://github.com/fahitosup/instagram-social-media-app.git`
2. Setting up environment variables:
   Create a `.env` file in the home directory and fill in the node environment (production or development), jwtSecret key for authorization purposes and details about your local PostgreSQL server. Example values are as follows:

```
NODE_ENV = development
jwtSecret = your secret key
DEV_DB_USER = postgres
DEV_DB_HOST = localhost
DEV_DB_NAME = instagram
DEV_DB_PASSWORD = ****
DEV_DB_PORT = 5432
```
## Running the application

1. Run the server:
   Navigate to the `server` directory by `cd server`. `npm install` to install all necessary packages and `npm start` to run the server.
2. Start the frontend:
   Navigate to the `frontend` directory by `cd frontend`, `npm install` to install all necessary packages and `npm start` to start the frontend. The website will then run on `http://localhost:3000`. Sign up to create an account and subsequentally log in.

