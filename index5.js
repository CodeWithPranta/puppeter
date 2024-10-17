const { connect } = require("puppeteer-real-browser");
const fs = require('fs');
require('dotenv').config(); // For environment variables

// Helper function for delays
async function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time);
    });
}

// Function to fill and validate input fields (email or password)
async function fillField(page, selector, expectedValue) {
    try {
        // Wait for the input field to be visible
        await page.waitForSelector(selector, { timeout: 10000 });

        // Focus on the input field
        await page.focus(selector);
        
        // Get the current value in the input field
        let currentValue = await page.$eval(selector, el => el.value);
        
        // Compare and type the missing characters, if any
        if (currentValue !== expectedValue) {
            const missingPart = expectedValue.slice(currentValue.length);
            console.log(`Typing missing part: "${missingPart}"`);
            await page.type(selector, missingPart, { delay: 100 }); // Type the remaining part slowly
        }

        // Verify that the full value has been entered
        currentValue = await page.$eval(selector, el => el.value);
        if (currentValue !== expectedValue) {
            throw new Error(`Field value mismatch! Expected: ${expectedValue}, but got: ${currentValue}`);
        }
        
        console.log(`Successfully filled the field with: ${expectedValue}`);
    } catch (e) {
        console.log(`Error in filling field for selector ${selector}:`, e.message);
        throw e; // Propagate the error to retry or handle appropriately
    }
}

// Function to perform login with improved input handling
async function performLogin(page, email, password) {
    try {
        // Fill and validate the email field
        await fillField(page, '#email', email);

        // Fill and validate the password field
        await fillField(page, '#password', password);

        // Optional: Take a screenshot after filling the credentials
        await page.screenshot({ path: 'step3_filled_credentials.png', fullPage: true });

        // Short delay to ensure the fields are processed before proceeding
        await delay(1000); 

    } catch (e) {
        console.log("Error entering email or password:", e.message);
        await page.screenshot({ path: 'step3_fill_error.png', fullPage: true });
        throw e; // Propagate error to handle retry
    }
}

// Function to click the login button with a delay after typing
async function clickLoginButton(page) {
    try {
        const loginButtonSelector = "body > app-root > div > div > app-login > section > div > div > mat-card > form > button";
        await page.waitForSelector(loginButtonSelector, { timeout: 10000 });
        console.log("Login button found. Waiting before clicking...");
        
        // Delay before clicking the login button to avoid clicking too early
        await delay(2000);
        await page.click(loginButtonSelector);
        console.log("Login button clicked.");

        // Wait for the login process to proceed
        await delay(5000); // Adjust the delay if needed for your site
        await page.screenshot({ path: 'step4_clicked_login.png', fullPage: true });
    } catch (e) {
        console.log("Error clicking login button:", e.message);
        await page.screenshot({ path: 'step4_click_error.png', fullPage: true });
        throw e; // Propagate error to handle retry
    }
}

// Function to check if login was successful (wait for redirect)
async function isLoginSuccessful(page) {
    try {
        const postLoginSelector = 'selector-for-post-login-element'; // Replace with actual selector after login
        await page.waitForSelector(postLoginSelector, { timeout: 10000 }); // Wait for redirection to happen
        return true;
    } catch (e) {
        console.log("Login not successful or timeout.");
        return false;
    }
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

    // Listen to page console events
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error('PAGE ERROR:', msg.text());
        } else {
            console.log('PAGE LOG:', msg.text());
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

        // Retrieve credentials from environment variables or use defaults
        const email = process.env.LOGIN_EMAIL || 'florella16@awgarstone.com';
        const password = process.env.LOGIN_PASSWORD || 'Aj*@12345678$#';

        // Try logging in once
        console.log("Starting login process.");
        await performLogin(page, email, password);
        await clickLoginButton(page);

        // Check if login is successful
        const loginSuccessful = await isLoginSuccessful(page);

        if (loginSuccessful) {
            console.log("Login successful.");
            await page.screenshot({ path: 'step5_after_login.png', fullPage: true });
        } else {
            console.log("Login failed.");
            await page.screenshot({ path: 'step5_login_failed.png', fullPage: true });
        }

    } catch (err) {
        console.error("An unexpected error occurred:", err);
    } finally {
        // Keep the browser open if login is successful, otherwise close the browser
        const loginSuccessful = await isLoginSuccessful(page);
        if (!loginSuccessful) {
            await browser.close();
            console.log("Browser closed.");
        } else {
            console.log("Keeping browser open on redirected page.");
        }
    }
}

test();
