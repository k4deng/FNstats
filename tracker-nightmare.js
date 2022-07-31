// config
const config = require("./config.js");

// logger
const logger = require("./logger.js");

// Nightmare (for calling api)
const nightmare = require('nightmare')()

// gets stats from a epic username
async function getStats(username, platform = "all") {

  try {
      const totalMatches = await nightmare
          .goto(`https://fortnitetracker.com/profile/${platform}/${username}`)
          .wait('.trn-site > .trn-site__container > .trn-profile > .trn-scont > div > div > div')
          .evaluate(()=> {
              return document.querySelector(
                  '.trn-site > .trn-site__container > .trn-profile > .trn-scont > div > div > div'
              ).innerText.replace(/\D/g, "")
          })
          .end()   

      if (config.debug) logger.debug(`${username}'s Total Matches: ${totalMatches}`)
      return { status: 1, result: totalMatches }
  } catch (e) {
      logger.error('There was an error: ' + e)
      return { status: 4, result: e }
  }

}

module.exports = { getStats }