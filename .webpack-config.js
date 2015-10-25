/* eslint no-var:0, id-length:0, func-names:0 */

var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var OUTPUT_DIR = "dist";
var EXTERNAL_PROMISE = "{Promise: Promise}";
var _ = require("lodash");
var autoprefixer = require("autoprefixer");
var precss = require("precss");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

require("dotenv").load({ silent: true });

function absolutePathTo(relativePath) {
  return path.join(__dirname, relativePath);
}

function commonConfig() {
  return {
    entry: {
      main: "main.js",
    },
    output: {
      filename: "[name]-all-[hash].js",
      chunkFilename: "[name]-[chunkhash].bundle.js",
      sourceMapFilename: "maps/[file].map",
      path: absolutePathTo(OUTPUT_DIR),
    },
    devtool: "source-map",
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel",
          query: {
            cacheDirectory: true,
            optional: ["runtime"],
          },
        },

        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("css-loader!postcss-loader"),
        },
      ],
    },
    resolve: {
      root: [
        absolutePathTo("src"),
      ],
    },
    postcss: function() {
      return [autoprefixer, precss];
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new ExtractTextPlugin("styles.css"),
    ],
    externals: { "es6-promise": EXTERNAL_PROMISE },
  };
}

function developmentConfig() {
  return _.extend(commonConfig(), {
    // Development overrides here
  });
}

function testConfig() {
  return _.extend(commonConfig(), {
    // Test overrides here
  });
}

function productionConfig() {
  return _.extend(commonConfig(), {
    // Production overrides here
  });
}

if (process.env.NODE_ENV === "production") {
  module.exports = productionConfig();
} else if (process.env.NODE_ENV === "test") {
  module.exports = testConfig();
} else {
  module.exports = developmentConfig();
}
