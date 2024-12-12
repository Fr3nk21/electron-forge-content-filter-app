import type { Configuration } from "webpack";
import path from "path";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

const rendererRules = [...rules];

rendererRules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
        },
      },
    },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules: rendererRules,
  },
  plugins: [
    ...plugins,
    new ForkTsCheckerWebpackPlugin({
      logger: "webpack-infrastructure",
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
    },
  },
  devtool: "source-map",
};

export default rendererConfig;
