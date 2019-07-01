import * as path from "path";
import * as myMethod from "./utils";
// 重写中间件
myMethod.writeFomidable(
    path.resolve(
        __dirname,
        "../node_modules/express-formidable/lib/middleware.js"
    )
);
import formidable from "express-formidable";
import express from "express";
import compression from "compression";
import config from "./config";
import routers from './routers';

const app = express();
app.setMaxListeners(0);
app.use(compression());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
    );
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("X-Powered-By", " 3.2.1");
    return next();
});

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
app.use(express.static(path.resolve(__dirname, "../server-dir/static")));
app.use((req, res, next) => {
    console.log(`[${req.method}]:${req.originalUrl}`);
    return next();
});
app.use(
    formidable({
        encoding: "utf-8",
        uploadDir: path.join(__dirname, "../server-dir/static/upload"),
        keepExtensions: true, //保留后缀
        multiples: true // req.files to be arrays of files
    })
);


routers(app);

const getPort: any = async (port: number) => {
    let result: any = await myMethod.portValid(port);
    if (!result.flag) {
        console.log("尝试端口" + (port + 1));
        return getPort(port + 1);
    }
    console.log("端口检测完毕");
    return app.listen(result.port, function() {
        console.log("服务运行于端口:" + result.port);
    });
};
getPort(config.port).catch((e: any) => {
    console.log(e);
});
