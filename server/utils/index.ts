import * as fs from "fs";
import net from "net";
import * as _ from "lodash";

// 时间格式化
export const timeFormat = (
  time: any = Date.now(),
  formate: string = "y-m-d h:i:s"
) => {
  const times =
    time.constructor.name === "Date"
      ? time
      : _.isNaN(Number(time))
      ? new Date(time)
      : new Date(Number(time));
  const Y = times.getFullYear();
  const M = times.getMonth() + 1;
  const D = times.getDate();
  const h = times.getHours();
  const m = times.getMinutes();
  const s = times.getSeconds();
  return formate
    .replace(/y/gi, Y)
    .replace(/m/gi, M >= 10 ? M : "0" + M)
    .replace(/d/gi, D >= 10 ? D : "0" + D)
    .replace(/h/gi, h >= 10 ? h : "0" + h)
    .replace(/i/gi, m >= 10 ? m : "0" + m)
    .replace(/s/gi, s >= 10 ? s : "0" + s);
};
// 路径是否存在
export const fsExists = (paths: string) => {
  return fs.existsSync(paths);
};
// 创建路径
export const mkDir = (paths: string) => {
  fs.mkdirSync(paths);
  console.log(`目录：[${paths}]创建成功！`);
};
// 端口占用检测
export const portValid = (port: number) => {
  console.log(`端口占用检测：${port}`);
  return new Promise((resolve: any) => {
    const server = net.createServer().listen(port);
    server.on("listening", () => {
      server.close();
      console.log(`端口：${port}，正常！`);
      return resolve({
        flag: true,
        port
      });
    });
    server.on("error", (err: any) => {
      server.close();
      if (err.code === "EADDRINUSE") {
        console.log(`端口：${port},被占用`);
      }
      return resolve({
        flag: false,
        port,
        err
      });
    });
  });
};
// 读取目录
export const readDir = (paths: string) => {
  /**
   * 读取目录文件
   * 除了index.js
   * .带头的文件不读取
   * 并且排除文件夹
   */
  let result: any[] = [];
  try {
    result = fs.readdirSync(paths);
    result = result
      .filter(
        item =>
          !/^index\.js$/gi.test(item) && !/^\./gi.test(item) && /\./g.test(item)
      )
      .map(item => item.replace(/\.js$/gi, ""));
  } catch (e) {
    console.log("readdir Error::", e);
  }
  return result;
};
