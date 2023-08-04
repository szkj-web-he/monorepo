// 引入插件
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import autoprefixer from "autoprefixer";
import { fileURLToPath } from "node:url";
import dts from "rollup-plugin-dts";
import postcssPlugin from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import progress from "./config/progress.mjs";
import sassLoader from "./config/sass-loader.mjs";
import replacePlugin from "./config/replacePtah.mjs";
/**
 *
 * @param {string} input 入口文件
 * @param {string} outputName 输出的文件名 (不要后缀)
 */
const config = (input, outputName) => {
  return [
    {
      input,
      output: {
        file: outputName ? `es/${outputName}/index.js` : "es/index.js",
        format: "es",
      },
      plugins: [
        replace({
          preventAssignment: true,
          values: {
            "process.env.NODE_ENV": "process.env.NODE_ENV",
            "process.env.BASENAME": "process.env.BASENAME",
          },
        }),
        resolve(),
        commonjs(),
        // typescript支持
        typescript({ check: false }),
        babel({
          exclude: /node_modules/,
          extensions: [".tsx", ".ts", ".jsx", ".js"],
          babelHelpers: "runtime",
          configFile: fileURLToPath(
            new URL("./config/.babelrc", import.meta.url)
          ),
        }),
        postcssPlugin({
          extensions: [".scss", ".css"],
          use: "sass",
          sourceMap: true,
          plugins: [autoprefixer({ env: "cover 99%" })],
          exec: true,
          namedExports: (name) => {
            return name.replace(/-/g, "_");
          },
          loaders: [sassLoader],
        }),
        terser(),
        image(),
        progress(),
      ],
      external: ["react", "react-dom", "snap_lib"],
    },
    {
      input,
      output: {
        file: outputName ? `es/${outputName}/index.d.ts` : "es/index.d.ts",
        format: "es",
      },
      plugins: [
        dts({
          compilerOptions: {
            skipDefaultLibCheck: true,
            noImplicitAny: false,
          },
        }),
      ],
    },
  ];
};

/**
 * 主入口文件的配置信息
 */
const indexConfig = [
  {
    input: fileURLToPath(new URL("./index.ts", import.meta.url)),
    output: {
      file: "es/index.js",
      format: "es",
    },
    external: /\.\/[a-z]+\/index/i,
    plugins: [replacePlugin("js")],
  },
  {
    input: fileURLToPath(new URL("./index.ts", import.meta.url)),
    output: {
      file: "es/index.d.ts",
      format: "es",
    },
    external: /\.\/[a-z]+\/index/i,
    plugins: [replacePlugin("d.ts")],
  },
];

export default [
  ...indexConfig,
  ...config(
    fileURLToPath(new URL("./components/icon/src/index.tsx", import.meta.url)),
    "Icon"
  ),
  ...config(
    fileURLToPath(new URL("./hooks/useLatest/src/index.ts", import.meta.url)),
    "useLatest"
  ),
  ...config(
    fileURLToPath(
      new URL("./functions/classNames/src/index.ts", import.meta.url)
    ),
    "classNames"
  ),
  ...config(
    fileURLToPath(new URL("./components/Input/src/index.tsx", import.meta.url)),
    "Input"
  ),
];
