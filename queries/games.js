const db = require("../db/dbConfig");

const allGames = async () => {
  try {
    const getAllGames = await db.any("SELECT * FROM game");
    return getAllGames;
  } catch (error) {
    return error;
  }
};

const singleGame = async (id) => {
  try {
    const getSingleGame = await db.any("SELECT * FROM game WHERE id = $1", id);
    return getSingleGame;
  } catch (error) {
    return error;
  }
};
// const getSingleGame = await db.any("SELECT * FROM game WHERE id = $1", id);
const newGame = async (data) => {
  try {
    const addNewGame = await db.any(
      "INSERT INTO game (title, genres, rating, description, platforms, boxart, esrb, subscription, release_date, developers, publishers, screenshots, playtime, completion_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
      [
        data.title,
        data.genres,
        data.rating,
        data.description,
        data.platforms,
        data.boxart,
        data.esrb,
        data.subscription,
        data.release_date,
        data.developers,
        data.publishers,
        data.screenshots,
        data.playtime,
        data.completion_time,
      ]
    );
    // console.log("inserting", data);
    // console.log("result", addNewGame);
    return addNewGame;
  } catch (error) {
    console.log("error in newGame queries", error);
    return error;
  }
};

const updateGame = async (id, data) => {
  try {
    const updatedGame = await db.any(
      "UPDATE game SET title = $1, genres = $2, rating = $3, description = $4, platforms = $5, boxart = $6, esrb = $7, subscription = $8, release_date = $9, developers = $10, publishers = $11, screenshots = $12, playtime = $13, completion_time = $14 WHERE id = $15 RETURNING *",
      [
        data.title,
        data.genres,
        data.rating,
        data.description,
        data.platforms,
        data.boxart || null, // Handle optional fields appropriately
        data.esrb || null,
        data.subscription || null,
        data.release_date || null,
        data.developers,
        data.publishers,
        data.screenshots,
        data.playtime,
        data.completion_time,
      ]
    );
    return updatedGame;
  } catch (error) {
    return error;
  }
};

const deleteGame = async (id) => {
  try {
    const deletedGame = await db.any(
      "DELETE FROM game WHERE id = $1 RETURNING *",
      id
    );
    return deletedGame;
  } catch (error) {
    return error;
  }
};
const getTopXGames = async () => {
  try {
    const topXGames = await db.any(
      "SELECT * FROM game ORDER BY rating DESC LIMIT 10;"
    );
    return topXGames;
  } catch (error) {
    return error;
  }
};

const getLatestGames = async () => {
  try {
    const latestGames = await db.any(
      "SELECT * FROM game ORDER BY release_date DESC LIMIT 10;"
    );
    return latestGames;
  } catch (error) {
    return error; 

const getXGamesAtATime = async (data) => {
  try {
    const XGames = await db.any(
      "SELECT * FROM game ORDER BY ID ASC LIMIT $1 OFFSET $2;",
      [data.limit, data.offset]
    );
    return XGames;
  } catch (error) {
    console.log("queries getXGamesAtATime error:", error);
    return error;

  }
};

module.exports = {
  allGames,
  singleGame,
  newGame,
  updateGame,
  deleteGame,
  getTopXGames,

  getLatestGames

  getXGamesAtATime,

};
