import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
const viewports=[{name:"390",width:390,height:844},{name:"820",width:820,height:1024},{name:"1440",width:1440,height:900}];
async function settle(page){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>undefined)));});}
async function capture(locator,dir,name,info){await expect(locator).toBeVisible();const file=path.join(dir,name);await locator.screenshot({path:file,animations:"disabled",caret:"hide"});await info.attach(name,{path:file,contentType:"image/png"});}
test("quadro visual por seção em 390, 820 e 1440 px",async({page},info)=>{
 test.skip(info.project.name!=="chromium","Gera um único conjunto de capturas para revisão visual.");
 const dir=info.outputPath("visual-review");await mkdir(dir,{recursive:true});
 for(const v of viewports){await page.setViewportSize({width:v.width,height:v.height});await page.goto("/");await settle(page);
 await capture(page.locator(".home-hero"),dir,`hero-${v.name}.png`,info);
 await page.locator(".lens-transition__stage").scrollIntoViewIfNeeded();await settle(page);await capture(page.locator(".lens-transition__stage"),dir,`transicao-${v.name}.png`,info);
 await page.locator(".coverage-section").scrollIntoViewIfNeeded();await settle(page);await capture(page.locator(".coverage-section"),dir,`galeria-home-${v.name}.png`,info);
 const about=page.locator(".home-about");if(await about.count()){await about.scrollIntoViewIfNeeded();await capture(about,dir,`sobre-home-${v.name}.png`,info);}
 await page.locator("footer").scrollIntoViewIfNeeded();await capture(page.locator("footer"),dir,`footer-${v.name}.png`,info);
 await page.goto("/sobre");await settle(page);await capture(page.locator(".about-page"),dir,`sobre-pagina-${v.name}.png`,info);
 const widths=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth}));expect(widths.document).toBeLessThanOrEqual(widths.viewport);
 }
});
test("grava a rolagem integral Hero → transição → galeria → Sobre → Footer",async({browser},info)=>{
 test.skip(info.project.name!=="chromium","Grava um vídeo único em desktop.");
 const dir=info.outputPath("visual-review-video");await mkdir(dir,{recursive:true});
 const context=await browser.newContext({baseURL:info.project.use.baseURL,viewport:{width:1440,height:900},deviceScaleFactor:1,recordVideo:{dir,size:{width:1440,height:900}},reducedMotion:"reduce"});
 const page=await context.newPage();await page.goto("/");await settle(page);
 for(const selector of [".home-hero",".lens-transition__stage",".coverage-section",".home-about","footer"]){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(450);}
 await page.waitForTimeout(250);const video=page.video();await context.close();
 if(video)await info.attach("rolagem-integral-desktop.webm",{path:await video.path(),contentType:"video/webm"});
});
