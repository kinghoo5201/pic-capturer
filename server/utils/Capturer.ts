import puppeteer from "puppeteer";

export default class Capturer {
  /**实例 */
  private browser: puppeteer.Browser;
  /**page实例 */
  private page: puppeteer.Page;
  /**配置 */
  private launchOpt?: puppeteer.LaunchOptions;

  public constructor(options?: puppeteer.LaunchOptions) {
    if (options) {
      this.initOpt(options);
    }
    this.initBrowser().then(() => this.initPage());
  }
  /**截图 */
  public async screenShoot(
    url: string,
    screenShootOpt: puppeteer.ScreenshotOptions,
    pageCfg: { [propsName: string]: any } = {}
  ) {
    if (!this.page) {
      return false;
    }
    await this.page.goto(url, {
      waitUntil: "load",
      ...pageCfg
    });
    await this.page.screenshot(screenShootOpt);
    return true;
  }
  /**更新配置 */
  public async updateOptions(launchOpt: puppeteer.LaunchOptions) {
    this.close();
    this.initOpt(launchOpt);
    await this.initBrowser();
    await this.initPage();
    return true;
  }
  /**关闭browser */
  public close() {
    if (!this.browser) {
      return;
    }
    this.browser.close();
  }
  /**初始化browser */
  private async initBrowser() {
    this.browser = await puppeteer.launch(
      this.launchOpt
        ? {
            ...this.launchOpt
          }
        : {}
    );
    console.log("browser is running!");
    return true;
  }
  /**初始化页面 */
  private async initPage() {
    if (!this.browser) {
      return false;
    }
    this.page = await this.browser.newPage();
    this.page.setCacheEnabled(false);
    console.log("page is opening!");
    return true;
  }
  /**初始化配置 */
  private initOpt(options: puppeteer.LaunchOptions) {
    this.launchOpt = options;
  }
}
