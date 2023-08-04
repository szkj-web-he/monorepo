import path from "node:path";
import PQueue from "p-queue";
import * as sass from "sass";
import fs from "fs";

const threadPoolSize = process.env.UV_THREADPOOL_SIZE || 4;
const workQueue = new PQueue({ concurrency: threadPoolSize - 1 });

export default {
  name: "sass",
  test: /\.(sass|scss)$/,
  process(ctx, payload) {
    console.log(payload);
    return new Promise((resolve, reject) => {
      workQueue.add(() => {
        try {
          const result = sass.compile(this.id, {
            charset: true,
            importers: [
              {
                canonicalize: (url) => {
                  /**
                   * 将alias的 ~ 转化为绝对路径
                   */
                  let realUrl = url;
                  if (/^\~/.test(url)) {
                    const str = url.replace("~", "");
                    realUrl = path.join(process.cwd(), "/src", str);
                  }
                  return new URL(realUrl);
                },
                load: (canonicalUrl) => {
                  return {
                    contents: fs.readFileSync(canonicalUrl.pathname).toString(),
                    syntax: "scss",
                    sourceMapUrl: this.id,
                  };
                },
              },
            ],
          });
          resolve({
            code: result.css,
            map: result.map?.toString(),
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  },
};
