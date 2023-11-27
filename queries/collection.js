const db = require("../db/dbConfig");

const allGamesInCollection = async (userId) => {
  try {
    const getCollection = await db.any(
      "SELECT game.* FROM game " +
        "INNER JOIN collection ON game.id = collection.game_id " +
        "WHERE collection.user_id = $1;",
      [userId]
    );
    return { success: true, data: getCollection };
  } catch (error) {
    console.error("Error in allGamesInCollection query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const addGameToCollection = async (userId, gameId) => {
  try {
    const addGame = await db.any(
      "INSERT INTO collection (user_id, game_id) VALUES ($1, $2);",
      [userId, gameId]
    );
    return { success: true, data: addGame };
  } catch (error) {
    console.error("Error in addGameToCollection query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const deleteGameInCollection = async (userId, gameId) => {
  try {
    const deleteGame = await db.any(
      "DELETE FROM collection WHERE user_id = $1 AND game_id = $2;",
      [userId, gameId]
    );
    return { success: true, data: deleteGame };
  } catch (error) {
    console.error("Error in deleteGameInCollection query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

module.exports = {
  allGamesInCollection,
  addGameToCollection,
  deleteGameInCollection,
};