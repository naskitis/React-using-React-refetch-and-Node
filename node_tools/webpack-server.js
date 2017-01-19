(function() {
  const path = require("path");

  const webpackDevServerPort = process.env.WEBPACK_DEV_SERVER_PORT;
  const hotReloadingEnabled = process.env.HOT_RELOADING;

  module.exports= function() {
    let server = null;

    if (hotReloadingEnabled == "true") {
      console.log("Hot reloading enabled ...");
      const webpack = require('webpack');
      const WebpackDevServer = require('webpack-dev-server');
      const config = require(path.resolve(__dirname, '../', process.env.WEBPACK_DEV));
      config.entry.webApp.unshift("webpack-dev-server/client?http://localhost:" + webpackDevServerPort + "/", "webpack/hot/dev-server");

      server = new WebpackDevServer(webpack(config),
      { hot: true });
      server.listen(webpackDevServerPort);
    }

    return server;
  };
})(this);
