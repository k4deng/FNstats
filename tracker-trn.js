// config
const config = require("./config.js");

// logger
const logger = require("./logger.js");

// node-fetch (for calling api)
const fetch = require('node-fetch');

// gets stats from a epic username
async function getStats(username, platform = "all") {

  let result;
  
  await fetch(`https://api.fortnitetracker.com/v1/profile/${platform}/${username}`, {
    headers: { 'TRN-Api-Key': process.env['trn-api-key'] },
  })
  .then(res => res.json())
  .then(json => {
    // Success
    if (json.code == 1) {
      //const info = res.json();
      result = { status: "1", result: json };

    // API down
    } else if (json.code == 3) {
      logger.error("TRN: " + json.error);
      result = { status: "3", result: json.error }

    // Unknown error
    } else {
      logger.error("There was an unknown error fetching stats!");
      result = json
    }
  });
  
  return result;

}

module.exports = { getStats }