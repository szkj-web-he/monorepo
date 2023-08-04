/**
 * 替换主入口的导入文件
 * @param extendName 输入拓展名 是d.ts还是js
 * @returns
 */
export default function replaceMainEntry(extendName) {
  return {
    name: "replaceMainEntry",
    transform(code) {
      const reg = /\.\/(components|functions|hooks)\/([^\/]+)\/[^"|']+/g;
      return code.replace(reg, `./$2/index.${extendName}`);
    },
  };
}
