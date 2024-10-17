
const { connect } = require("puppeteer-real-browser")

async function test() {

    const { browser, page } = await connect({

        headless: false,

        args: [],

        customConfig: {},

        turnstile: true,

        connectOption: {},

        disableXvfb: false,
        ignoreAllFlags: false
        // proxy:{
        //     host:'<proxy-host>',
        //     port:'<proxy-port>',
        //     username:'<proxy-username>',
        //     password:'<proxy-password>'
        // }

    })
    await page.goto('https://visa.vfsglobal.com/aze/en/ltp/login')

}

test()