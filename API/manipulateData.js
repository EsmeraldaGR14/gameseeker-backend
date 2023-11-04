const { fetchDataFromRawgAPI } = require("./axios");

let objGame = {};

async function getGamesFromRawgApi() {
  let result = await fetchDataFromRawgAPI();
  // ==> an array of games
  console.log(result);

  result.map((element) => {
    objGame.title = element.title;
    objGame.genre = element.genres;
    objGame.rating = element.rating;
    objGame.platform = element.platforms;
    objGame.esrb = element.esrb_rating.name;
    objGame.released_year = element.released;
    objGame.screenshots = element.short_screenshots;
    objGame.playtime = element.playtime;
  });
}
