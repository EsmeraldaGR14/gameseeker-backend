const db = require("../db/dbConfig");

const allGamesInBacklog = async (userId) => {
  try {
    const getBacklog = await db.any(
      "SELECT game.* FROM game " +
        "INNER JOIN backlog ON game.id = backlog.game_id " +
        "WHERE backlog.user_id = $1;",
      [userId]
    );
    return { success: true, data: getBacklog };
  } catch (error) {
    console.error("Error in allGamesInBacklog query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const addGameToBacklog = async (userId, gameId) => {
  try {
    const addGame = await db.any(
      "INSERT INTO backlog (user_id, game_id) VALUES ($1, $2);",
      [userId, gameId]
    );
    return { success: true, data: addGame };
  } catch (error) {
    console.error("Error in addGameToBacklog query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const deleteGameInBacklog = async (userId, gameId) => {
  try {
    const deleteGame = await db.any(
      "DELETE FROM backlog WHERE user_id = $1 AND game_id = $2;",
      [userId, gameId]
    );
    return { success: true, data: deleteGame };
  } catch (error) {
    console.error("Error in deleteGameInBacklog query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

module.exports = {
  allGamesInBacklog,
  addGameToBacklog,
  deleteGameInBacklog,
};
