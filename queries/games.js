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

const newGame = async (data) => {
  try {
    const addNewGame = await db.any(
      "INSERT INTO game (title, genre, rating, description, platform, boxart, esrb, subscription, released_year, developer, publisher, screenshots, play_time, completion_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
      [
        data.title,
        data.genre,
        data.rating,
        data.description,
        data.platform,
        data.boxart,
        data.esrb,
        data.subscription,
        data.released_year,
        data.developer,
        data.publisher,
        data.screenshots,
        data.play_time,
        data.completion_time,
      ]
    );
    return addNewGame;
  } catch (error) {
    return error;
  }
};

const updateGame = async (id, data) => {
  try {
    const updatedGame = await db.any(
      "UPDATE game SET title = $1, genre = $2, rating = $3, description = $4, platform = $5, boxart = $6, esrb = $7, subscription = $8, released_year = $9, developer = $10, publisher = $11, screenshots = $12, play_time = $13, completion_time = $14 WHERE id = $15 RETURNING *",
      [
        data.title,
        data.genre,
        data.rating,
        data.description,
        data.platform,
        data.boxart,
        data.esrb,
        data.subscription,
        data.released_year,
        data.developer,
        data.publisher,
        data.screenshots,
        data.play_time,
        data.completion_time,
        id,
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

module.exports = {
  allGames,
  singleGame,
  newGame,
  updateGame,
  deleteGame,
};
