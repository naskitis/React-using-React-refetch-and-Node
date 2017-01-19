var ejs = require('ejs');

class EJSProcessor {
  constructor(app) {
    this.app = app;
  }

  getHtmlPath(filename) {
    const engineExt = this.app.get('view engine');
    const htmlPath = this.app.get('views');
    const fileExt = filename.split('.').pop();

    return (fileExt === filename) ? htmlPath + filename + "." + engineExt : htmlPath + filename;
  }

  sendHtmlFile(req, res, data={}, filename="index") {
    ejs.renderFile(this.getHtmlPath(filename), data, function (err, html) {
      (err) ? console.log(err) : res.send(html);
    });
  }
};

module.exports = EJSProcessor;
