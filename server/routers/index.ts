import { Express } from "express";
import * as _ from "lodash";
import * as fs from "fs";
import * as util from "../utils";
import path from "path";
import Capturer from "../utils/Capturer";
import puppeteer from "puppeteer";

// pptr是否正在运行
(global as any).isRunPptr = false;

const capturer = new Capturer();

const uploadDir = path.resolve(__dirname, "../../server-dir/static/upload");
// 循环抓取
async function loopCapture(
  paths: string[],
  domain: string,
  waitUntil: string,
  shootCfg: puppeteer.ScreenshotOptions
) {
  const domainDir: string = path.resolve(
    uploadDir,
    domain.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9]/g, "_")
  );
  const timeId: number = Date.now();
  if (!util.fsExists(domainDir)) {
    util.mkDir(domainDir);
  }
  for (const i in paths) {
    const pth = paths[i];
    const pthDir = pth.replace(domain, "").replace(/[^a-zA-Z0-9]/g, "_");
    const cptCfg: puppeteer.ScreenshotOptions = {
      ...shootCfg,
      path: path.resolve(domainDir, pthDir + "-" + timeId) + ".png",
      type: "png"
    };
    await capturer.screenShoot(pth, cptCfg, {
      waitUntil
    });
  }
  (global as any).isRunPptr = false;
  return true;
}

function router(app: Express) {
  app.get("/", function(req, res, next) {
    return res.render("index");
  });
  app.get("/api-status", function(req, res, next) {
    return res.json({
      isRunning: (global as any).isRunPptr
    });
  });
  app.get("/api-getDir", function(req, res, next) {
    const pth = req.query.path;
    const dir = pth ? path.resolve(uploadDir, pth) : uploadDir;
    const paths = fs.readdirSync(dir).filter(item => item !== ".DS_Store");
    return res.json({
      flag: true,
      paths
    });
  });
  app.post("/api-capture", function handler(req, res, next) {
    const {
      viewWidth,
      viewHeight,
      fullPage,
      clipX,
      clipY,
      clipWidth,
      clipHeight,
      domain,
      paths,
      waitUntil
    } = (req as any).fields;
    const config: puppeteer.LaunchOptions = {
      //设置超时时间
      timeout: 15000,
      //如果是访问https页面 此属性会忽略https错误
      ignoreHTTPSErrors: true,
      // 打开开发者工具, 当此值为true时, headless总为false
      devtools: false,
      // 关闭headless模式, 不会打开浏览器
      headless: true,
      defaultViewport: {
        width: parseFloat(viewWidth),
        height: parseFloat(viewHeight)
      }
    };
    const snapCfg: puppeteer.ScreenshotOptions = {};
    if (fullPage) {
      snapCfg.fullPage = true;
    } else {
      snapCfg.clip = {
        ...{
          x: clipX,
          y: clipY,
          width: clipWidth,
          height: clipHeight
        }
      };
    }
    return capturer.updateOptions(config).then(() => {
      // 开始运行
      (global as any).isRunPptr = true;
      // 进行遍历抓取
      loopCapture(paths, domain, waitUntil, snapCfg).then(() => {
        console.log("截取完成完成");
      });
      return res.json({
        flag: true
      });
    });
  });
}

export default router;
