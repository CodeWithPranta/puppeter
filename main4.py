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
time.sleep(10)  # Adjust as needed for the booking process

# Open the dropdown for "Choose your Application Centre"
application_centre_dropdown = tab.ele('#mat-select-0')  # Update this selector if necessary
if application_centre_dropdown:
    application_centre_dropdown.click()  # Open the dropdown
    print("Application Centre dropdown opened.")

    # Now, select the desired option (assuming it's the first option, adjust as needed)
    option = tab.ele('Application Centre, Baku')  # Adjust based on actual value
    if option:
        option.click()  # Select the option
        print("Application Centre selected.")
    else:
        print("Could not find the 'Application Centre, Baku' option.")
else:
    print("Could not find the Application Centre dropdown.")

# Open the dropdown for "Choose your appointment category"
appointment_category_dropdown = tab.ele('#mat-select-4')  # Update this selector if necessary
if appointment_category_dropdown:
    appointment_category_dropdown.click()  # Open the dropdown
    print("Appointment category dropdown opened.")

    # Select the desired option (e.g., "National D Visa")
    option = tab.ele('National D Visa')  # Adjust based on actual value
    if option:
        option.click()  # Select the option
        print("Appointment category selected.")
    else:
        print("Could not find the 'National D Visa' option.")
else:
    print("Could not find the appointment category dropdown.")

# Open the dropdown for "Choose your sub-category"
sub_category_dropdown = tab.ele('#mat-select-2')  # Update this selector if necessary
if sub_category_dropdown:
    sub_category_dropdown.click()  # Open the dropdown
    print("Sub-category dropdown opened.")

    # Select the desired option (e.g., "National Visa (D)")
    option = tab.ele('National Visa (D)')  # Adjust based on actual value
    if option:
        option.click()  # Select the option
        print("Sub-category selected.")
    else:
        print("Could not find the 'National Visa (D)' option.")
else:
    print("Could not find the sub-category dropdown.")

# Check if the "no slots available" message is present
no_slots_message = tab.ele('.alert.alert-info')
if no_slots_message:
    print("No appointment slots available.")
else:
    # If no message, click the "Continue" button
    continue_button = tab.ele('Continue')  # Update based on the actual button selector
    if continue_button:
        continue_button.click()
        print("Continue button clicked.")
    else:
        print("Continue button not found.")

time.sleep(30)
# Clean up
tab.close()  # Use close() instead of quit()
print("Browser closed.")
