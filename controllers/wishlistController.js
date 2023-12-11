const express = require("express");
const router = express.Router();

const {
  allGamesInWishlist,
  addGameToWishlist,
  deleteGameInWishlist,
} = require("../queries/wishlist");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required." });
    }

    const wishlist = await allGamesInWishlist(userId);

    res.json(wishlist);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.post("/:userId/:gameId", async (req, res) => {
  try {
    const { userId, gameId } = req.params;

    if (!userId || !gameId) {
      return res
        .status(400)
        .json({ error: "Both userId and gameId are required." });
    }

    const addGame = await addGameToWishlist(userId, gameId);

    res.json(addGame);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.delete("/:userId/:gameId", async (req, res) => {
  try {
    const { userId, gameId } = req.params;

    if (!userId || !gameId) {
      return res
        .status(400)
        .json({ error: "Both userId and gameId are required." });
    }

    const deletedGame = await deleteGameInWishlist(userId, gameId);

    res.json(deletedGame);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

module.exports = router;
