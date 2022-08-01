// Native Node Imports
const path = require("path");

// Express Session
const express = require("express");
const router = express.Router();

module.exports = function(client, dataDir, templateDir) {

  // index page
  router.get("/", (req, res) => {
    res.render(
      path.resolve(`${dataDir}${path.sep}views${path.sep}index.ejs`), {
        site: client
      });
  });

  // search
  router.get("/search", (req, res) => {
    const user = (req.query.user).replace(/\+/g, ' ');
    res.redirect(`${client.url}/user/${encodeURIComponent(req.query.user)}${req.query?.platform ? "?platform="+req.query.platform : ""}`)
  });

  return router;
}