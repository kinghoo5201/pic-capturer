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
const path = __importStar(require("path"));
const myMethod = __importStar(require("./utils"));
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const config_1 = __importDefault(require("./config"));
const routers_1 = __importDefault(require("./routers"));
const app = express_1.default();
app.setMaxListeners(0);
app.use(compression_1.default());
//这里创建文件，如果不存在的话
app.use((req, res, next) => {
    const uploadDir = path.resolve(__dirname, "../server-dir/static/upload");
    const { fsExists, mkDir } = myMethod;
    !fsExists(uploadDir) && mkDir(uploadDir);
    return next();
});
app.set("views", path.resolve(__dirname, "../server-dir/views"));
app.set("view engine", "ejs");
app.set("view cache", false);
app.use(express_1.default.static(path.resolve(__dirname, "../server-dir/static")));
app.use((req, res, next) => {
    console.log(`[${req.method}]:${req.originalUrl}`);
    return next();
});
routers_1.default(app);
const getPort = async (port) => {
    let result = await myMethod.portValid(port);
    if (!result.flag) {
        console.log("尝试端口" + (port + 1));
        return getPort(port + 1);
    }
    console.log("端口检测完毕");
    return app.listen(result.port, function () {
        console.log("服务运行于端口:" + result.port);
    });
};
getPort(config_1.default.port).catch((e) => {
    console.log(e);
});
