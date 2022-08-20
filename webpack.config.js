const path = require("path");

module.exports = {
  entry: {
    injectScript: "./src/injectScript/injectScript.ts",
    contentScript: "./src/contentScript/contentScript.ts",
    background: "./src/background/background.ts",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  devtool: false,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          ignoreDiagnostics: [1128, 1005],
        },
      },
    ],
  },
};
