const { connect } = require("puppeteer-real-browser");
const fs = require('fs');
require('dotenv').config(); // For environment variables

// Helper function for delays
async function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time);
    });
}

// Function to perform login
async function performLogin(page, email, password) {
    try {
        await page.waitForSelector('#email', { timeout: 10000 });
        await page.focus('#email');
        //await delay(500); // Delay before typing
        await page.type('#email', email, { delay: 20 }); // Increased delay
        console.log("Email entered.");

        await page.waitForSelector('#password', { timeout: 10000 });
        await page.focus('#password');
        //await delay(500); // Delay before typing
        await page.type('#password', password, { delay: 30 }); // Increased delay
        console.log("Password entered.");

        await page.screenshot({ path: 'step3_filled_credentials.png', fullPage: true });

        // Validate the input fields
        const emailValue = await page.$eval('#email', el => el.value);
        const passwordValue = await page.$eval('#password', el => el.value);
        console.log(`Email Field Value: ${emailValue}`);
        console.log(`Password Field Value: ${passwordValue}`);

        if (emailValue !== email || passwordValue !== password) {
            throw new Error("Input fields not filled correctly.");
        }

    } catch (e) {
        console.log("Error entering email or password:", e.message);
        await page.screenshot({ path: 'step3_fill_error.png', fullPage: true });
        throw e; // Propagate error to handle retry
    }
}


// Function to click the login button
async function clickLoginButton(page) {
    try {
        const loginButtonSelector = "body > app-root > div > div > app-login > section > div > div > mat-card > form > button";
        await page.waitForSelector(loginButtonSelector, { timeout: 10000 });
        await page.click(loginButtonSelector);
        console.log("Login button clicked.");
        await delay(3000); // Wait for the login to process
        await page.screenshot({ path: 'step4_clicked_login.png', fullPage: true });
    } catch (e) {
        console.log("Error clicking login button:", e.message);
        await page.screenshot({ path: 'step4_click_error.png', fullPage: true });
        throw e; // Propagate error to handle retry
    }
}

// Function to check if login was successful
async function isLoginSuccessful(page) {
    try {
        const postLoginSelector = 'selector-for-post-login-element'; // Replace with actual selector
        await page.waitForSelector(postLoginSelector, { timeout: 5000 });
        return true;
    } catch (e) {
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

        // Define maximum number of login attempts
        const maxLoginAttempts = 5; // Increased for better chances
        let loginAttempt = 0;
        let loginSuccessful = false;

        while (loginAttempt < maxLoginAttempts && !loginSuccessful) {
            loginAttempt++;
            console.log(`Login attempt ${loginAttempt} of ${maxLoginAttempts}`);

            try {
                // Fill email and password
                await performLogin(page, email, password);
                // Click the login button
                await clickLoginButton(page);
                // Check if login was successful
                loginSuccessful = await isLoginSuccessful(page);
            } catch (e) {
                console.log("Error during login process:", e.message);
                await page.screenshot({ path: `step5_login_failed_attempt_${loginAttempt}.png`, fullPage: true });
            }

            if (loginSuccessful) {
                console.log("Login successful.");
                await page.screenshot({ path: 'step5_after_login.png', fullPage: true });
            } else {
                console.log("Login failed. Retrying...");
                await page.goto("https://visa.vfsglobal.com/aze/en/ltp/login", { waitUntil: "networkidle2" });
                await delay(2000); // Wait before retrying
            }
        }

        if (!loginSuccessful) {
            throw new Error("Failed to login after maximum attempts.");
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
