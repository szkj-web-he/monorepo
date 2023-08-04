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
import progress from "./progress.mjs";
import sassLoader from "./sass-loader.mjs";
/**
 *
 * @param {string} input 入口文件
 * @param {string} output 输出的文件名 (不要后缀)
 */
export default (input, output) => {
  return [
    {
      input,
      output: [
        {
          file: `lib/${output}.js`,
          format: "es",
        },
      ],
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
          configFile: fileURLToPath(new URL(".babelrc", import.meta.url)),
        }),
        postcssPlugin({
          extensions: [".scss", ".css"],
          use: "sass",
          sourceMap: true,
          plugins: [autoprefixer({ env: "cover 99%" })],
          namedExports: (name) => {
            return name.replace(/-/g, "_");
          },
          loaders: [sassLoader],
        }),
        terser(),
        image(),
        progress(),
      ],
      external: ["react", "react-dom", "@react_lib"],
    },
    {
      input,
      output: {
        file: `lib/${output}.d.ts`,
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
