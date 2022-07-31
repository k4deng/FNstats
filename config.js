const config = {
  // ur bots version
  "version": "1.0.0",

  // The port that it should run on
  "port": "3000",

  // HTTPS: 'true' for true, 'false' for false
  "secure": "true",

  // Domain name (with port if not running behind proxy running on port 80). Example: 'domain': 'website.com' OR 'domain': 'localhost:3000'
  "domain": "FNstats.k4deng.repl.co",

  // Company (FNStats, FortStats, Stats4Fortnite, etc.) aka the name of the website
  "company": "FNStats",

  // Ur websites description
  "description": "The all in one solution to searching for fortnite users stats!",

  // log console to a folder and keep track of errors and whatnot
  "fileLogging": "false",

  // This will spam your console if you enable this but will help with bug fixing
  "debug": "true",
};

module.exports = config;