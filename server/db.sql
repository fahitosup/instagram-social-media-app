CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    caption TEXT,
    link VARCHAR(255) NOT NULL,  -- Path to image
    likes INTEGER DEFAULT 0,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



CREATE DATABASE auth;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100),
    username VARCHAR(50) NOT NULL,
    password VARCHAR(256)
);
