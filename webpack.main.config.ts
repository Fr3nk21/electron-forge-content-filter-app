import type { Configuration } from "webpack";
import path from "path";

// const { rules } = require("./webpack.rules");
// const { plugins } = require("./webpack.plugins");

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  mode: "development",
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  target: "electron-main",
  module: {
    rules,
  },
  plugins: [...plugins],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, ".webpack/main"),
  },
  devtool: "source-map",
};

module.exports = mainConfig;
export { mainConfig };
