
const compression = require("compression");
const cluster = require('./node_tools/express-cluster');
const webpackServer = require('./node_tools/webpack-server');

const serverPort = process.env.SERVER_PORT || 80;
const numWorkers = process.env.NUM_CPU || 1;
const nodeEnv = process.env.NODE_ENV || "development";
let webAppHtmlDir=null;
let webAppCssFile=null;

(() => {
  const webpackConfig = "./webpack.config.js";
  const webpackConfigProd = "./webpack.config.prod.js";
  let config=null;

  console.log("Node ENV set as: "+nodeEnv);
  if (nodeEnv == "production") {
    console.log("Using PROD webpack configuration file: "+webpackConfigProd);
    config = require(webpackConfigProd);
  }
  else {
    console.log("Using DEV webpack configuration file: "+webpackConfig);
    config = require(webpackConfig);
  }

  webAppHtmlDir = config.webAppPaths.htmlAppDir + config.webAppPaths.publicHtmlDir;
  webAppCssFile = config.webAppPaths.publicAssetDir + config.webAppPaths.publicAssetCSSDir + config.webAppPaths.outputFileName + ".css";
})();


const shouldCompress = function (req, res) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}

const masterProcess = function (master) {
  console.log(webAppHtmlDir);
  console.log(webAppCssFile);
  webpackServer();
};

const workerProcesses = function (worker) {
  const zlib = require("zlib");
  const express = require('express');
  const app = express();
  const cookieParser = require("cookie-parser");
  const bodyParser = require("body-parser");
  const router = require("./node_routers/router");
  const ejs = require('ejs'); 
  const LRU = require('lru-cache');

  ejs.cache = LRU(100);
  app.set('views', webAppHtmlDir);
  app.set('view engine', 'ejs');
  app.engine('ejs', require('ejs').renderFile);

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(compression({ filter: shouldCompress, level: zlib.Z_DEFAULT_COMPRESSION }));
  app.use('/public', express.static(__dirname + '/public'));


  require('fs').readFile(__dirname + webAppCssFile, 'utf8', function(err, data) {
    if(err) throw err;
    app.cssFileData = data;

    router(app);
    app.listen(serverPort, () => {
      console.log('Listening from worker #' + worker.id);
    });
  });
};

cluster({ count: numWorkers, verbose: true, respawn: false }, workerProcesses, masterProcess);
