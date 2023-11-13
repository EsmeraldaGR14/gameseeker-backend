const express = require("express");
const router = express.Router();

const { addGamesFromApisToDatabase } = require("../API/manipulateData");

router.get("/", async (req, res) => {
  try {
    const initialData = await addGamesFromApisToDatabase();

    res.json(initialData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
})

// router.post("/", async (req, res) => {
//   try {
//     // pass in the url
//     // let url = req.body;
//     let url = req.body.url;

//     const data = await fetchDataFromRawgAPI(url);

//     // const data = await fetchDataFromRawgAPI(
//     //   "https://api.rawg.io/api/games?key=0cf40416b0b548dea1d637509c3e7801&page=2&token="
//     // );

//     let arrayOfGames = [];

//     data.results.forEach((element) => {
//       let objGame = {};

//       objGame.title = element.name;

//       objGame.genres = element.genres.map((genre) => genre.name);
//       objGame.rating = element.rating;
//       objGame.platforms = element.platforms.map(
//         (platform) => platform.platform.name
//       );
//       objGame.esrb = element.esrb_rating ? element.esrb_rating.name : null;

//       objGame.released_year = element.released;
//       objGame.screenshots = element.short_screenshots.map(
//         (image) => image.image
//       );
//       objGame.playtime = element.playtime;

//       arrayOfGames.push(objGame);
//     });

//     for (let i = 0; i < arrayOfGames.length; i++) {
//       try {
//         await newGame(arrayOfGames[i]);
//       } catch (error) {
//         console.error("Error inserting game into the database:", error);
//       }
//     }

//     res.json(arrayOfGames);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
