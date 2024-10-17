from DrissionPage import Chromium
import time

# Initialize Chromium browser
tab = Chromium().latest_tab

# Navigate to the login page
tab.get('https://visa.vfsglobal.com/aze/en/ltp/login')
print("Navigated to login page.")

# Wait for CAPTCHA to be solved (if needed)

# Fill email
email_field = tab.ele('#email')
email_field.input('florella16@awgarstone.com')
print("Email field filled.")

# Fill password
password_field = tab.ele('#password')
password_field.input('Aj*@12345678$#')
print("Password field filled.")

# Debug: Print page source to check for the login button
print("Page source after filling fields:")

# Retry clicking login button until successful
max_retries = 5  # Set a limit for retries
retry_count = 0
login_success = False

while retry_count < max_retries and not login_success:
    try:
        # Wait for the login button to be present
        tab.wait.load_start()

        # Check if the login button is available
        login_button = tab('.mat-btn-lg')  # Adjust the selector if necessary

        if login_button.is_displayed():  # Check if the button is displayed
            print(f"Login button found (attempt {retry_count + 1}), attributes:", login_button.attrs)
            login_button.click()  # Click the login button
            print("Login button clicked.")

            # Optionally, you can add some logic here to verify if the login was successful (e.g., by checking URL or element existence)
            time.sleep(2)  # Short wait to allow the login process to start

            # Check if login was successful (e.g., by checking for a URL change or specific element on the next page)
            if tab.url != 'https://visa.vfsglobal.com/aze/en/ltp/login':  # Adjust condition based on login success
                print("Login successful.")
                login_success = True
            else:
                print("Login not successful, retrying...")

        else:
            print("Login button is not displayed, retrying...")

    except Exception as e:
        print(f"Error clicking login button on attempt {retry_count + 1}: {e}")

    retry_count += 1
    time.sleep(2)  # Optional delay between retries

if not login_success:
    print("Failed to log in after multiple attempts.")

# Clean up
tab.close()
print("Browser closed.")
