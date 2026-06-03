# 🧪 Tester Guide: Dealership Portal & Scheduling

Welcome to the **Kelley's Clear Headlights** testing team! 
Your goal is to test the end-to-end flow of becoming a partnered Dealership and scheduling a mobile headlight restoration service.

Please follow these exact steps and report any bugs, layout issues, or confusion you experience along the way.

---

## Step 1: Obtain an Invite Link
Because this is a secure B2B portal, you cannot register without a secure invite link. 
1. Ask your System Administrator to generate a **Dealer Invite Link** for you.
2. The Admin will go to their `/admin` portal, generate a token, and send you a link that looks something like this: `https://[your-domain].com/register?token=XYZ123`

## Step 2: Register your Dealership Account
1. Open the **Invite Link** in your web browser. 
2. You should see a registration form. Fill out the following:
   - Your Dealership Name
   - Your Name
   - Your Email Address
   - A Secure Password
3. Click the **Register/Create Account** button. *(Note: Do not close the browser immediately. Wait to ensure you are either redirected or shown a success message).*

## Step 3: Log into the Portal
1. Navigate to the main Login page: `https://[your-domain].com/login`
2. Enter the Email and Password you just created.
3. Click **Log In**. 
4. Because your account was created via the invite link, the system knows you are a "Dealer" and will automatically redirect you to the **Dealer Portal** (`/dealer`).

## Step 4: Schedule an Appointment
1. Once inside the Dealer Portal, scroll down or look at the main dashboard area.
2. You will see a white calendar interface embedded directly into the portal. This is our secure booking system.
3. **Select a Date:** Click on any available date that has open time slots.
4. **Select a Time:** Choose a specific time block for the mobile restoration service.
5. **Fill out the Booking Form:** 
   - Enter your Name and Email (use the same email you registered with).
   - *If there are extra questions (like "How many cars need restoration?"), please fill them out.*
6. Click **Book** or **Confirm**.

## Step 5: Verify Success
1. **On the Website:** The calendar should show a success confirmation screen.
2. **In your Email:** Check your email inbox. You should receive an automated confirmation from Google Calendar with the date and time of the appointment you just booked.

---

### 🛑 What to look out for:
* Did the page load slowly or look weird on your mobile phone?
* Did the calendar fit nicely inside the screen without clipping?
* Did you get the confirmation email instantly?
* Were there any confusing steps?

*Thank you for testing! Please compile any feedback and send it to the development team.*
