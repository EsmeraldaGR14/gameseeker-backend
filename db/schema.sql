DROP DATABASE IF EXISTS gameseeker_dev;

CREATE DATABASE gameseeker_dev;

\c gameseeker_dev;

DROP TABLE IF EXISTS game;

CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) ,
    genres VARCHAR[] ,
    rating DECIMAL(3,1),
    description TEXT,
    platforms VARCHAR[],
    boxart VARCHAR,
    esrb VARCHAR,
    subscription VARCHAR[],
    release_date VARCHAR,
    developers VARCHAR[],
    publishers VARCHAR[],
    screenshots VARCHAR[],
    playtime INTEGER,
    completion_time INTEGER
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS collection;

CREATE TABLE collection (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES game(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS wishlist;

CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES game(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS backlog;

CREATE TABLE backlog (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES game(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE
);

