CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    caption TEXT,
    link VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100),
    username VARCHAR(50) NOT NULL,
    password VARCHAR(256)
);


CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    profile_picture VARCHAR(255),
    CONSTRAINT fk_username
        FOREIGN KEY(username) 
        REFERENCES users(username)
        ON DELETE CASCADE
);

CREATE TABLE followers (
    id SERIAL PRIMARY KEY,
    follower_username VARCHAR(50) NOT NULL,
    following_username VARCHAR(50) NOT NULL,
    CONSTRAINT fk_follower
        FOREIGN KEY(follower_username)
        REFERENCES users(username)
        ON DELETE CASCADE,
    CONSTRAINT fk_following
        FOREIGN KEY(following_username)
        REFERENCES users(username)
        ON DELETE CASCADE,
    UNIQUE (follower_username, following_username)
);

