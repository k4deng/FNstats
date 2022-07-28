// config
const config = require("./config.js");

// logger
const logger = require("./logger.js");

// Nightmare (for calling api)
const nightmare = require('nightmare')()

// gets stats from a epic username
async function getTotalMatches(username, platform = "all") {

    try {
        const totMatches = await nightmare
            .goto(`https://fortnitetracker.com/profile/${platform}/${username}`)
            .wait('.trn-site > .trn-site__container > .trn-profile > .trn-scont > div > div > div')
            .evaluate(()=> {
                return document.querySelector(
                    '.trn-site > .trn-site__container > .trn-profile > .trn-scont > div > div > div'
                ).innerText.replace(/\D/g, "")
            })
            .end()   

        if (config.debug) logger.debug(`${username}'s Total Matches: ${totMatches}`)
        return { status: 1, result: totMatches }
    } catch (e) {
        logger.error('There was an error: ' + e)
        return { status: 4, result: e }
    }

}

const arguments = process.argv.slice(2)
const username = arguments[0]
if ( username == undefined ) {
    console.log("Please Enter a Username")
    return 0;
}

const matches = getTotalMatches(username).then(function(result) {
    console.log(result); // "Stuff worked!"
  }, function(err) {
    console.log(err); // Error: "It broke"
  });
console.log(matches)