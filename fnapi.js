// config
const config = require("./config.js");

// logger
const logger = require("./logger.js");

// fortnite-api-com (for calling api)
const FortniteAPI = require('fortnite-api-com');
const fnapiconfig = {
  apikey: process.env['fnapi-key'],
  language: "en",
  debug: config.debug
};
const Fortnite = new FortniteAPI(fnapiconfig);

// gets stats from a epic username
async function getStats(username, platform = "all") {

  let result;
  
  await Fortnite.BRStats({ name: username })
  .then(res => {

    // Success
    if (res.status == 200) {

      let stats;
      
      if (platform === "all") stats = res.data.stats.all
        else if (platform === "kbm") stats = res.data.stats.keyboardMouse
        else if (platform === "gamepad") stats = res.data.stats.gamepad
        else if (platform === "touch") stats = res.data.stats.touch
      
      result = {
        status: 1,
        result: {
          username: res.data.account.name,
          battlePass: res.data.battlePass,
          stats: stats
        }
      };

    // Account stats are private
    } else if (res.status == 403) {
      result = { status: 2, result: res.error }

    // account not found
    } else if (res.status == 404) {
      result = { status: 3, result: res.error }

    // Invalid or missing parameter(s)
    } else if (res.status == 400) {
      result = { status: 4, result: res.error }
      
    } else {
      logger.error("There was an unknown error fetching stats!");
      result = { status: 5, result: res }
    }
    
  }).catch(err => {
    logger.error("There was an error fetching stats!");
    logger.error(err);
    result = { status: 5, result: err }
  });
  
  return result;

}

module.exports = { getStats }