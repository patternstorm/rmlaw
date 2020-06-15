const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "app.ts")
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].[chunkhash].bundle.js",
    path: path.resolve(__dirname, "../dist")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: "ts-loader",
        options: { transpileOnly: true }
      },
      // {
      //   test: /\.json$/,
      //   loader: "raw-loader",
      //   exclude: [/node_modules/],
      //   type: "javascript/auto"
      // }
    ]
  },
  node: {
    fs: "empty"
  },
  // plugins: [
  //   new CopyPlugin({patterns: [{ from: path.resolve(__dirname, "../dist"), to: path.resolve(__dirname, "public") }]})
  // ]
};
