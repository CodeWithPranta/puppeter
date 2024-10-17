
const test = require('node:test');
const assert = require('node:assert');
const { connect } = require('puppeteer-real-browser');

test('Puppeteer Extra Plugin', async () => {
    const { page, browser } = await connect({
        args: ["--start-maximized"],
        turnstile: true,
        headless: false,
        // disableXvfb: true,
        customConfig: {},
        connectOption: {
            defaultViewport: null
        },
        plugins: [
            require('puppeteer-extra-plugin-click-and-wait')()
        ]
    })
    await page.goto("https://2captcha.com/demo/cloudflare-turnstile-challenge", { waitUntil: "domcontentloaded" })
    await page.clickAndWaitForNavigation('body')
    await browser.close()
})
