/**
 * 替换主入口的导入文件
 */
export default function replaceMainEntry() {
  return {
    name: "replaceMainEntry",
    transform(code) {
      const reg = /\.\/(components|functions|hooks)\/([^\/]+)\/[^"|']+/g;
      return code.replace(reg, `./$2/index`);
    },
  };
}
