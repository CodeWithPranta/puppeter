from DrissionPage import Chromium
import time

# Initialize Chromium browser
tab = Chromium().latest_tab

# Navigate to the login page
tab.get('https://visa.vfsglobal.com/aze/en/ltp/login')
print("Navigated to login page.")

# Fill email
email_field = tab.ele('#email')
email_field.input('florella16@awgarstone.com')
print("Email field filled.")

# Fill password
password_field = tab.ele('#password')
password_field.input('Aj*@12345678$#')
print("Password field filled.")

# Debug: Print the HTML content to check for the login button
print("Page source after filling fields:")
# print(tab.html)  # Print the page HTML

# Click login button (ensure you use the correct selector)
try:
    # Wait for the login button to be present
    tab.wait.load_start()

    # Try different selectors for the login button
    login_button = tab.ele('Sign In')  # Adjust based on actual selector
    if login_button:  # Check if the button is displayed
        print("Login button found, attributes:", login_button.attrs)  # Print attributes for debugging
        login_button.click()  # Click the login button
        print("Login button clicked.")
    else:
        print("Login button is not displayed or not found.")

except Exception as e:
    print(f"Error clicking login button: {e}")

# Wait for login process to complete
time.sleep(30)  # Adjust based on your needs

# Clean up
tab.close()  # Use close() instead of quit()
print("Browser closed.")
