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

# Click login button
try:
    tab.wait.load_start()
    login_button = tab.ele('Sign In')  # Adjust based on actual selector
    if login_button:
        print("Login button found, attributes:", login_button.attrs)
        login_button.click()
        print("Login button clicked.")
    else:
        print("Login button not found.")
except Exception as e:
    print(f"Error clicking login button: {e}")

# Wait for page load after login
time.sleep(5)

# Click "Start New Booking" button
try:
    tab.wait.load_start()
    booking_button = tab.ele('Start New Booking')  # Adjust the selector as per actual HTML
    if booking_button:
        print("Start New Booking button found, attributes:", booking_button.attrs)
        tab.run_js("document.querySelector('.mat-button-wrapper').click()")
        print("'Start New Booking' button clicked.")
    else:
        print("'Start New Booking' button not found!")
except Exception as e:
    print(f"Error clicking 'Start New Booking' button: {e}")

# Wait to ensure booking process starts
time.sleep(10)

# Open the dropdown for "Choose your Application Centre"
application_centre_dropdown = tab.ele('#mat-select-0')
if application_centre_dropdown:
    application_centre_dropdown.click()
    print("Application Centre dropdown opened.")
    option = tab.ele('Application Centre, Baku')
    if option:
        option.click()
        print("Application Centre selected.")
    else:
        print("Could not find the 'Application Centre, Baku' option.")
else:
    print("Could not find the Application Centre dropdown.")

# Open the dropdown for "Choose your appointment category"
appointment_category_dropdown = tab.ele('#mat-select-4')
if appointment_category_dropdown:
    appointment_category_dropdown.click()
    print("Appointment category dropdown opened.")
    option = tab.ele('National D Visa')
    if option:
        option.click()
        print("Appointment category selected.")
    else:
        print("Could not find the 'National D Visa' option.")
else:
    print("Could not find the appointment category dropdown.")

# Open the dropdown for "Choose your sub-category"
sub_category_dropdown = tab.ele('#mat-select-2')
if sub_category_dropdown:
    sub_category_dropdown.click()
    print("Sub-category dropdown opened.")
    option = tab.ele('National Visa (D)')
    if option:
        option.click()
        print("Sub-category selected.")
    else:
        print("Could not find the 'National Visa (D)' option.")
else:
    print("Could not find the sub-category dropdown.")

# Function to check for "No slots available" message
def check_slots_and_retry():
    while True:
        # Check if the "no slots available" message exists
        sorry_message = tab.ele('We are sorry, but no appointment slots are currently available. Please try again later')
        if sorry_message:
            print("No appointment slots available. Retrying in 30 minute...")
            time.sleep(30)
            # tab.run_js('location.reload()')  # This reloads the current page
            tab.run_js('window.location.reload(false)')
        else:
            continue_button = tab.ele('Continue')  # Adjust the selector for the "Continue" button
            if continue_button:
                continue_button.click()
                print("Continue button clicked.")
                break  # Exit the loop once a slot is found and "Continue" is clicked
            else:
                print("Continue button not found.")
                break

# Call the slot check and retry function
check_slots_and_retry()

time.sleep(30)
tab.close()
print("Browser closed.")
