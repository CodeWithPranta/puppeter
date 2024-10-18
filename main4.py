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

# Click login button (ensure you use the correct selector)
try:
    # Wait for the login button to be present
    tab.wait.load_start()

    # Find the login button and click it
    login_button = tab.ele('Sign In')  # Adjust based on actual selector
    if login_button:  # Check if the button is displayed
        print("Login button found, attributes:", login_button.attrs)  # Print attributes for debugging
        login_button.click()  # Click the login button
        print("Login button clicked.")
    else:
        print("Login button is not displayed or not found.")

except Exception as e:
    print(f"Error clicking login button: {e}")

# Wait for the new page to load after login
time.sleep(5)  # Adjust based on your needs

# Click "Start New Booking" button
try:
    # Wait for the "Start New Booking" button to be present
    tab.wait.load_start()

    # Identify and click the "Start New Booking" button
    booking_button = tab.ele('Start New Booking')  # Adjust the selector as per actual HTML
    if booking_button:
        # Scroll to the button if necessary
        print("Start New Booking button found, attributes:", booking_button.attrs)
        # booking_button.click()  # Click the button
        # Force a click using JavaScript
        # Use JavaScript to click the button with the correct selector
        tab.run_js("document.querySelector('.mat-button-wrapper').click()")


        print("'Start New Booking' button clicked.")           
    else:
        print("'Start New Booking' button is not found!")
   
        
except Exception as e:
    print(f"Error clicking 'Start New Booking' button: {e}")

# Wait to ensure booking process starts
time.sleep(30)  # Adjust as needed for the booking process

# Clean up
tab.close()  # Use close() instead of quit()
print("Browser closed.")
