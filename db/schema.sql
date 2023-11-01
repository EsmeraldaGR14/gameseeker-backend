DROP DATABASE IF EXISTS gameseeker_dev;

CREATE DATABASE gameseeker_dev;

\c gameseeker_dev;

DROP TABLE IF EXISTS game;

CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    genre VARCHAR(50) NOT NULL,
    rating DECIMAL(3,1),
    description TEXT,
    platform VARCHAR,
    boxart VARCHAR,
    esrb VARCHAR,
    subscription VARCHAR,
    released_year INTEGER,
    developer VARCHAR,
    publisher VARCHAR,
    screenshots TEXT,
    play_time INTEGER,
    completion_time INTEGER
)
