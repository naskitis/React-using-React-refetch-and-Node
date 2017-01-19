
module.exports = function (app) {
  const EJSProcessor = require("../node_tools/EJSProcessor");
  const ejsProcessor = new EJSProcessor(app);
  const ejsData = { cssFileData: app.cssFileData };

  app.get('/', ({ req, res }) => {
    ejsProcessor.sendHtmlFile(req, res, ejsData);
  });
};
