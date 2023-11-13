DROP DATABASE IF EXISTS gameseeker_dev;

CREATE DATABASE gameseeker_dev;

\c gameseeker_dev;

DROP TABLE IF EXISTS game;

CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    genres VARCHAR[] NOT NULL,
    rating DECIMAL(3,1),
    description TEXT,
    platforms VARCHAR[],
    boxart VARCHAR,
    esrb VARCHAR,
    subscription VARCHAR,
    release_date DATE NULL,
    developer VARCHAR,
    publisher VARCHAR,
    screenshots VARCHAR[],
    playtime INTEGER,
    completion_time INTEGER
)
