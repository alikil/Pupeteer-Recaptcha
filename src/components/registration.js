const screenshotTake = require("./takePicture")
const puppeteer = require('puppeteer');
const parser = require("./parser")
const recaptcha = require("./recaptcha")
const qs = require("qs")

exports.forms = async(targetPage,ip,apikey) => {
    return new Promise(async(resolve, reject) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false, defaultViewport:{width:1280,height:800}});
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 800});
    await page.goto(targetPage);

    const HTML = await page.content()    
    const sitekey = await parser.parse(HTML,'data-sitekey="','"')
    const pageurl = await page.url()

    const grecaptchakey = await recaptcha.solveService(sitekey,pageurl,ip,apikey)
    //const grecaptchakey = "15gfdhd5fh46dfhsdfh"
    console.log(grecaptchakey)
 

// Работает программно но не рендерится в Puppeteer
/*
    const data = qs.stringify({"g-recaptcha-response": grecaptchakey})
    await page.evaluate(({data}) => {
        console.log(data)
        fetch("/recaptcha/api2/demo", 
        {
            headers: {
                "Host": "www.google.com",
                "Connection": "keep-alive",
                "Cache-Control": "max-age=0",
                "Origin": "https://www.google.com",
                "Upgrade-Insecure-Requests": "1",
                "Content-Type": "application/x-www-form-urlencoded",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Accept": "text/html,application/xhtml+xml,application/xml;"
              },
            method: 'POST',
            body: data
        });
      },{data});
*/


// Не Работает, отсылает data напрямую, а нужно в FormData, Рендерит ответ!
/*
    const datapost = qs.stringify({"g-recaptcha-response": grecaptchakey})
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {interceptedRequest.continue({
        'method': 'POST',
        'postData': datapost
    })})
    const response = await page.goto(targetPage);     
    const responseBody = await response.text();
*/

    await page.waitFor(90000)

    await browser.close();
    resolve("ok")
    });
}