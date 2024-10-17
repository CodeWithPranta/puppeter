# Import DrissionPage
from DrissionPage import Chromium
import time

# Initialize Chromium browser
browser = Chromium()

# Open the latest tab
tab = browser.latest_tab

# Visit the 2Captcha demo site or Cloudflare Turnstile CAPTCHA challenge page
tab.get('https://2captcha.com/demo/cloudflare-turnstile-challenge')

# Wait for a while to manually solve the CAPTCHA or for any automated solution
# Adjust the delay as per the complexity of the CAPTCHA or solving service
time.sleep(30)  # Sleep for 30 seconds to wait for CAPTCHA to be solved (adjust as needed)

# Take a screenshot after solving the CAPTCHA (save as PNG)
tab.screenshot('captcha_solved.png')

# Close the browser after taking the screenshot
browser.quit()

print("Screenshot taken after CAPTCHA challenge.")
