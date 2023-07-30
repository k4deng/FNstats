//.env file
require('dotenv').config()

// Config
const config = require("./config.js");

// Native Node Imports
const path = require("path");

// Express Session
const express = require("express");
const app = express();

// For logging
const logger = require("./utils/logger.js");
const chalk = require("chalk");
const morgan = require("morgan");
// The output
// Valid variables: https://www.npmjs.com/package/morgan#dateformat
morgan.token("statusColor", (req, res) => {
  // get the status code if response written
  var status = (typeof res.headersSent !== "boolean"
    ? Boolean(res.header)
    : res.headersSent)
    ? res.statusCode
    : undefined;
  // get status color
  var color =
    status >= 500
      ? 31 // red
      : status >= 400
        ? 33 // yellow
        : status >= 300
          ? 36 // cyan
          : status >= 200
            ? 32 // green
            : 0; // no color
  return "\x1b[" + color + "m" + status + "\x1b[0m";
});
morgan.token(
  "morgan-output",
  `${chalk.bgBlue(":method")} :url ${chalk.blue(
    "=>"
  )} :response-time ms ${chalk.blue("=>")}  :statusColor`
);

// For CORS which fixes some problems with the api
const cors = require("cors");

// here we go...
let protocol;
if (config.secure === "true") protocol = "https://";
  else protocol = "http://";

const client = {
  name: config.company,
  desc: config.description,
  url: `${protocol}${config.domain}`
}

// It's easier to deal with complex paths.
// This resolves to: yourdir/http/
const dataDir = path.resolve(`${process.cwd()}${path.sep}http`);
// This resolves to: yourdir/http/views/
// which is the folder that stores all the internal page files.
const templateDir = path.resolve(`${dataDir}${path.sep}views`);

// logger
app.use(morgan("morgan-output"));

// cors
app.use(cors());

app.set("trust proxy", 5); // Proxy support
// allow the static items to be accessed
app.use("/css", express.static(path.resolve(`${dataDir}${path.sep}css`), { maxAge: "10d" }));
app.use("/img", express.static(path.resolve(`${dataDir}${path.sep}img`), { maxAge: "10d" }));
app.use("/js", express.static(path.resolve(`${dataDir}${path.sep}js`), { maxAge: "10d" }));
app.use("/scss", express.static(path.resolve(`${dataDir}${path.sep}scss`), { maxAge: "10d" }));
app.use("/vendor", express.static(path.resolve(`${dataDir}${path.sep}vendor`), { maxAge: "10d" }));
app.use("/pages", express.static(path.resolve(`${dataDir}${path.sep}pages`), { maxAge: "10d" }));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// body-parser reads incoming JSON or FORM data and simplifies their
// use in code.
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

// site.com/?
app.use("/", require("./routes/site")(client, dataDir, templateDir));

// site.com/user/?
app.use("/user/", require("./routes/user")(client, dataDir, templateDir));

// site.com/ow/?
// overwolf app pages
app.use("/ow/", require("./routes/ow/site")(client, dataDir, templateDir));

// 404 errors
app.get("*", function(req, res) {
  res.status(404).render(path.resolve(`${templateDir}${path.sep}error.ejs`), {
    site: client,
    errorNum: "404",
    errorDesc: "Oops! Page not found.",
    errorSlug: "It looks like you found a glitch in the matrix..."
  });
});

app.listen(config.port, function() {
  logger.log(`Dashboard and API running on port ${config.port}`);
})
app.on("error", err => {
  logger.error(`Error with starting dashboard: ${err.code}`);
  return process.exit(0);
});