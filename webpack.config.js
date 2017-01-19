const path = require("path");
const webpack = require('webpack');

const webAppDir = "./web_app/";
const htmlAppDir = webAppDir + "html/";
const devHtmlDir = "dev/";
const publicHtmlDir = "public/";

const publicAssetDir = "/public/"; 
const publicAssetCSSDir = "css/"; 
const publicAssetJSDir = "js/";
const outputFileName = "webApp";

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function loadPlugins() {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new webpack.optimize.CommonsChunkPlugin('js/shared.js'),
    new webpack.optimize.UglifyJsPlugin({ exclude: /node_modules/, compress: { warnings: false }, output: { comments: false } }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new ExtractTextPlugin("css/[name].css"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new WriteFilePlugin({ log: false }),
    new webpack.ProvidePlugin({
      "React": "react",
      "ReactDOM": "react-dom",
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
  ];

  const files = require('fs').readdirSync(htmlAppDir + devHtmlDir);
  for (let i in files) {
    plugins.push(new HtmlWebpackPlugin({
      filename: "../" + htmlAppDir + publicHtmlDir + files[i],
      template: "html!" + htmlAppDir + devHtmlDir + files[i],
      inject: false,
      hash: false,
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: false,
        preserveLineBreaks: false,
      },
    }));
  }
  return plugins;
}

module.exports = {
  webAppPaths: {
    webAppDir,
    htmlAppDir,
    devHtmlDir,
    publicHtmlDir,
    publicAssetDir,
    publicAssetCSSDir,
    publicAssetJSDir, 
    outputFileName
  },  
  context: __dirname,
  entry: {
    webApp: [webAppDir + "/main.js"],
  }, 
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/public/", 
    chunkFilename: '[id].chunk.js',
    filename: "js/[name].js",
  },
  devServer: {
    inline: true,
    outputPath: path.resolve(__dirname, "public"), 
    contentBase: path.resolve(__dirname, "public"),
    hot: true,
    historyApiFallback: true
  },
  eslint: {
    configFile: '.eslintrc',
  },
  module: {
    /*preLoaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader' },
    ],*/
    postLoaders: [],
    loaders: [
      { test: /.*\.(gif|png|jpe?g|svg)$/i, loaders: ['file?hash=sha512&digest=hex&name=[hash:hex:8].[ext]', 'image-webpack'] },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?minetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?minetype=image/svg+xml" },
      {
        test: /\.scss$/, 
        loader: ExtractTextPlugin.extract(
          "style-loader",
          "css-loader!autoprefixer-loader?browsers=last 3 version!sass-loader")
      },
      {
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract(
        "style-loader",
        "css-loader!autoprefixer-loader?browsers=last 3 version!sass-loader")
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ["babel-loader"]//, "eslint-loader"] // enable soon.
      }
    ],
  },
  plugins: loadPlugins(),
  imageWebpackLoader: {
    mozjpeg: {
      quality: 65
    },
    pngquant: {
      quality: "65-90",
      speed: 4
    },
    svgo: {
      plugins: [{
        removeViewBox: false
      },
      {
        removeEmptyAttrs: false
      }]
    }
  }
};

/* Upgrade to Webpack 2 soon */
