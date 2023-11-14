const { fetchDataFromAPI, addGamesToDatabase } = require("./axios");

async function getGamesFromApi(result) {
  let arrayOfGames = [];
  data.results.forEach((element) => {
    let objGame = {};

    objGame.title = element.aliases;
    // objGame.genres = element.genres.map((genre) => genre.name);
    // objGame.rating = element.rating;
    // objGame.platforms = element.platforms.map(
    //   (platform) => platform.platform.name
    // );
    // objGame.esrb = element.esrb_rating.name;
    // objGame.released_year = element.released;
    // objGame.screenshots = element.short_screenshots.map((image) => image.image);
    // objGame.playtime = element.playtime;

    arrayOfGames.push(objGame);
  });

  return arrayOfGames;
  // I am assigning the variables to their respective columns
}

async function addGamesFromApisToDatabase() {
  let result = await addGamesToDatabase(arrayOfGames);
}

module.exports = { getGamesFromApi };
