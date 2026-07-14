# 🧪 Tester Guide: Dealership Portal & Scheduling

Welcome to the **Kelley's Clear Headlights** testing team! 
Your goal is to test the end-to-end flow of becoming a partnered Dealership and scheduling a mobile headlight restoration service.

Please follow these exact steps and report any bugs, layout issues, or confusion you experience along the way.

---

## 🏎️ Phase 1: Sign Up & Registration

### Step 1: Submit a Lead (As a Dealership)
1. Go to the public homepage and navigate to the Partnership Intake Form (`https://stlclearheadlights.com/partnership`).
2. Or Scan Barcode:
   <img width="200px" src="./flyers/dealership-qrcode.png"/>
3. Fill out the lead form with a test Dealership Name, Email, and Phone Number.
4. Click **Submit Request**.

### Step 2: Generate Invite (As Admin)
*This step must be done by the System Administrator.*
1. The Admin logs into the `https://stlclearheadlights.com/admin` portal.
2. Under **Dashboard** -> **Recent Leads**, locate the newly submitted test lead.
3. Click the **Gen Invite & Email** button. 
4. The system will instantly copy the secure invite link to the Admin's clipboard and send an email to the lead.
5. The Admin sends this secure Invite Link to the Tester.

### Step 3: Register the Account
1. Open the **Invite Link** provided by the Admin. 
2. You will be taken to a secure registration form (`/register?token=...`).
3. Set your **Password**, confirm it, and you can use the new Eye Icon to verify what you typed!
4. Click the **Complete Registration** button.
5. The system will activate your account and instantly log you into the **Dealer Portal** (`https://stlclearheadlights.com/dealer`).

---

## 📅 Phase 2: Dealer Portal & Scheduling

### Step 4: Explore the Portal
1. Look at your main dashboard. You should see an **Outstanding Balance** module and other metrics.
2. Notice the navigation tabs on the left side of the screen.

### Step 5: Schedule an Appointment & Checkout
1. Make sure you are on the **Schedule Service** tab.
2. Fill out the "Service Details" form (Service Address and Number of Cars Planned).
3. Click **Check Availability & Pay**.
4. You will see a calendar interface with a **glass overlay** blocking clicks. Scroll through the calendar behind the glass to confirm a time is available.
5. Click the **Proceed to Payment** button to initialize secure checkout.
6. A credit card form will load directly inside the glass overlay. (If this is a test environment, you can use `4242 4242 4242 4242` as a test credit card number, any future date, and any CVC).
7. Click the **Pay & Unlock Booking** button.
8. Upon successful payment, the glass overlay will automatically disappear. **Now select an available date and time slot.**
9. Confirm the booking on the calendar.
10. Look at your left navigation menu: a new **"Appointments"** tab should now appear! Click it to verify your appointment was saved successfully.
---

## 🧹 Phase 3: Admin Reset (Clearing Data to Restart)

If a tester makes a mistake or you need to run the test again from scratch, the Admin can wipe the data cleanly from the Admin Portal:

1. **Delete the Dealership Account:**
   - Go to the **Dealerships** tab in the `https://stlclearheadlights.com/admin` dashboard.
   - Find the test dealership.
   - Click the red **Trash icon (Delete Dealership)**. This completely wipes them from the database and revokes their login access permanently.
2. **Delete the Lead & Invite:**
   - Go back to the **Dashboard** tab.
   - Under **Recent Leads**, find the original test lead.
   - Click the red **Trash icon (Delete Lead)**. This deletes the lead record and safely destroys any unused invite links associated with it.

---

### 🛑 What to look out for:
* Did the page load slowly or look weird on your mobile phone?
* Did the calendar fit nicely inside the screen without clipping?
* Did the "Appointments" tab show up immediately after scheduling?
* Were there any confusing steps or dead ends?

*Thank you for testing! Please compile any feedback and send it to the development team.*
