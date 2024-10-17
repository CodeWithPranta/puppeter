// File: index3.js

const { connect } = require("puppeteer-real-browser");
const fs = require('fs');

// Helper function for delays
async function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time);
    });
}

async function test() {
    const { browser, page } = await connect({
        args: ["--start-maximized"],
        turnstile: true,
        headless: false,
        customConfig: {},
        connectOption: {
            defaultViewport: null
        }
    });

    try {
        // Navigate to the login page
        await page.goto("https://visa.vfsglobal.com/aze/en/ltp/login", { waitUntil: "networkidle2" });
        console.log("Navigated to login page.");

        // Take screenshot of the page
        await page.screenshot({ path: 'step1_login_page.png', fullPage: true });

        // Handle cookies rejection
        try {
            await page.waitForSelector('#onetrust-reject-all-handler', { timeout: 10000 });
            await page.click('#onetrust-reject-all-handler');
            console.log("Cookies rejected.");
            await delay(2000); // Delay to allow for actions to complete
            await page.screenshot({ path: 'step2_reject_cookies.png', fullPage: true });
        } catch (e) {
            console.log("Cookies rejection button not found:", e.message);
            await page.screenshot({ path: 'step2_cookies_not_found.png', fullPage: true });
        }

        // // Fill email and password
        try {
            // Focus and type email
            await page.waitForSelector('#email', { timeout: 10000 });
            await page.focus('#email');
            await page.type('#email', 'florella16@awgarstone.com', { delay: 10 }); // Reduced delay
            console.log("Email entered.");

            // Focus and type password
            await page.waitForSelector('#password', { timeout: 10000 });
            await page.focus('#password');
            await page.type('#password', 'Aj*@12345678$#', { delay: 2 }); // Reduced delay
            console.log("Password entered.");

            await page.screenshot({ path: 'step3_filled_credentials.png', fullPage: true });
        } catch (e) {
            console.log("Error entering email or password:", e.message);
            await page.screenshot({ path: 'step3_fill_error.png', fullPage: true });
            return; // Stop if login fields are not found
        }

        // Alternatively, set the input values directly via JavaScript
        // Uncomment the following block if typing still fails

        
        // try {
        //     await page.evaluate(() => {
        //         document.querySelector('#email').value = 'florella16@awgarstone.com';
        //         document.querySelector('#password').value = 'Aj*@12345678$#';
        //     });
        //     console.log("Email and password set via JavaScript.");
        //     await page.screenshot({ path: 'step3_filled_credentials_js.png', fullPage: true });
        // } catch (e) {
        //     console.log("Error setting email or password via JavaScript:", e.message);
        //     await page.screenshot({ path: 'step3_fill_error_js.png', fullPage: true });
        //     return; // Stop if setting fields via JS fails
        // }
        

        // Click the login button
        try {
            // Using the selector path you provided
            await page.waitForSelector("body > app-root > div > div > app-login > section > div > div > mat-card > form > button", { timeout: 10000 });
            await page.click("body > app-root > div > div > app-login > section > div > div > mat-card > form > button");
            console.log("Login button clicked.");
            await delay(3000); // Wait for the login to process
            await page.screenshot({ path: 'step4_clicked_login.png', fullPage: true });
        } catch (e) {
            console.log("Error clicking login button:", e.message);
            await page.screenshot({ path: 'step4_click_error.png', fullPage: true });
            return; // Stop if login button can't be clicked
        }

        // Wait for navigation after login
        try {
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
            console.log("Login successful. Redirected to the next page.");
            await page.screenshot({ path: 'step5_after_login.png', fullPage: true });
        } catch (e) {
            console.log("Error during post-login navigation:", e.message);
            await page.screenshot({ path: 'step5_navigation_error.png', fullPage: true });
        }

    } catch (err) {
        console.error("An unexpected error occurred:", err);
    } finally {
        // Close the browser
        await browser.close();
        console.log("Browser closed.");
    }
}

test();
