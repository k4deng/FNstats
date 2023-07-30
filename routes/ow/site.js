// API
const fnapi = require("../../utils/fnapi.js");

// Native Node Imports
const path = require("path");

// Moment (date formatting)
const moment = require("moment");
require("moment-duration-format");

// Express Session
const express = require("express");
const router = express.Router();

module.exports = function(client, dataDir, templateDir) {

  // index page
  router.get("/", (req, res) => {
    res.render(
      path.resolve(`${dataDir}${path.sep}views${path.sep}ow${path.sep}index.ejs`), {
        site: client
      });
  });

  // search
  router.get("/search", (req, res) => {
    const user = (req.query.user).replace(/\+/g, ' ');
    res.redirect(`${client.url}/ow/user/${encodeURIComponent(req.query.user)}${req.query?.platform ? "?platform="+req.query.platform : ""}`)
  });

  router.get("/user/:user", (req, res) => {

    fnapi.getStats(req.params.user, req.query?.platform, req.query?.accounts)
      .then(function(stats) {

        // found stats
        if (stats.status == 1) {
          if (req.params.user !== stats.result.username) res.redirect(`${encodeURIComponent(stats.result.username)}${req.query?.platform ? "?platform="+req.query.platform : ""}${req.query?.fromEvent ? "?fromEvent="+req.query.fromEvent : ""}`)
          else res.render(
            path.resolve(`${dataDir}${path.sep}views${path.sep}ow${path.sep}user.ejs`), {
              site: client,
              stats: stats.result,
              moment: moment,
              fromEvent: req.query?.fromEvent
            });
        }

        // hasnt played that platform
        if (stats.status == 11) res.render(
          path.resolve(`${dataDir}${path.sep}views${path.sep}ow${path.sep}user-error.ejs`), {
            site: client,
            stats: stats.result
          });

        // private
        if (stats.status == 2) res.render(
          path.resolve(`${dataDir}${path.sep}views${path.sep}ow${path.sep}user-error.ejs`), {
            site: client,
            stats: stats.result
          });

        // no user found
        if (stats.status == 3) res.status(404).render(
          path.resolve(`${templateDir}${path.sep}ow${path.sep}error.ejs`), {
            site: client,
            errorNum: "404",
            errorDesc: "User Not Found",
            errorSlug: "It looks like that user doesnt exist..."
          });

        // error finding stats
        if (stats.status == 5) res.status(500).render(
          path.resolve(`${templateDir}${path.sep}ow${path.sep}error.ejs`), {
            site: client,
            errorNum: "500",
            errorDesc: "Error Fetching Stats",
            errorSlug: "You should probably let an admin know..."
          });

      });
  });

  // 404 errors
  router.get("*", function(req, res) {
    res.status(404).render(path.resolve(`${templateDir}${path.sep}ow${path.sep}error.ejs`), {
      site: client,
      errorNum: "404",
      errorDesc: "Oops! Page not found.",
      errorSlug: "It looks like you found a glitch in the matrix..."
    });
  });

  return router;
}