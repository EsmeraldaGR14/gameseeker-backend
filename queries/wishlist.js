const db = require("../db/dbConfig");

const allGamesInWishlist = async (userId) => {
  try {
    const getWishlist = await db.any(
      "SELECT game.* FROM game " +
        "INNER JOIN wishlist ON game.id = wishlist.game_id " +
        "WHERE wishlist.user_id = $1;",
      [userId]
    );
    return { success: true, data: getWishlist };
  } catch (error) {
    console.error("Error in allGamesInWishlist query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const addGameToWishlist = async (userId, gameId) => {
  try {
    const addGame = await db.any(
      "INSERT INTO wishlist (user_id, game_id) VALUES ($1, $2);",
      [userId, gameId]
    );
    return { success: true, data: addGame };
  } catch (error) {
    console.error("Error in addGameToWishlist query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const deleteGameInWishlist = async (userId, gameId) => {
  try {
    const deleteGame = await db.any(
      "DELETE FROM wishlist WHERE user_id = $1 AND game_id = $2;",
      [userId, gameId]
    );
    return { success: true, data: deleteGame };
  } catch (error) {
    console.error("Error in deleteGameInWishlist query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

module.exports = {
  allGamesInWishlist,
  addGameToWishlist,
  deleteGameInWishlist,
};
