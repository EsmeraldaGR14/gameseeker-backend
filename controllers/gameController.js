const express = require("express");
const router = express.Router();

const {
  allGames,
  singleGame,
  newGame,
  updateGame,
  deleteGame,
  getTopXGames,
  getLatestGames,
} = require("../queries/games");

router.get("/top-rated-games", async (req, res) => {
  try {
    const topXGames = await getTopXGames();
    res.json(topXGames);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});

router.get("/latest-games", async (req, res) => {
  try {
    const latestGames = await getLatestGames();
    res.json(latestGames); 
  } catch (error){
    res.status(error.status).json({error: error.message });
  } 
});

router.get("/", async (req, res) => {
  try {
    const games = await allGames();
    res.json(games);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const game = await singleGame(req.params.id);
    res.json(game);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const addGame = await newGame(req.body);

    res.json(addGame);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedGame = await updateGame(req.params.id, req.body);
    res.json(updatedGame);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedGame = await deleteGame(req.params.id);
    res.json(deletedGame);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});


module.exports = router;
