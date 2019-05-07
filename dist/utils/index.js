"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const net_1 = __importDefault(require("net"));
const _ = __importStar(require("lodash"));
// 时间格式化
exports.timeFormat = (time = Date.now(), formate = "y-m-d h:i:s") => {
    const times = time.constructor.name === "Date"
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
exports.fsExists = (paths) => {
    return fs.existsSync(paths);
};
// 创建路径
exports.mkDir = (paths) => {
    fs.mkdirSync(paths);
    console.log(`目录：[${paths}]创建成功！`);
};
// 端口占用检测
exports.portValid = (port) => {
    console.log(`端口占用检测：${port}`);
    return new Promise((resolve) => {
        const server = net_1.default.createServer().listen(port);
        server.on("listening", () => {
            server.close();
            console.log(`端口：${port}，正常！`);
            return resolve({
                flag: true,
                port
            });
        });
        server.on("error", (err) => {
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
exports.readDir = (paths) => {
    /**
     * 读取目录文件
     * 除了index.js
     * .带头的文件不读取
     * 并且排除文件夹
     */
    let result = [];
    try {
        result = fs.readdirSync(paths);
        result = result
            .filter(item => !/^index\.js$/gi.test(item) && !/^\./gi.test(item) && /\./g.test(item))
            .map(item => item.replace(/\.js$/gi, ""));
    }
    catch (e) {
        console.log("readdir Error::", e);
    }
    return result;
};
