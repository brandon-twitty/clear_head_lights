<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Context Notes for Next Session

## Current Architecture & State
- **Project Scope:** We are building a B2B Dealership Portal, an Admin CRM, and an automated Lead Intake system for Kelley's Clear Headlights.
- **Tech Stack:** Next.js App Router (Turbopack), Tailwind CSS, Firebase (Auth & Firestore).
- **Deployment:** Deployed to Firebase Hosting via `npx firebase-tools deploy` (using the Web Frameworks experiment). Not currently using the new "App Hosting" GitHub integration.
- **Database Schema:** We rely on `users` (stores custom `role: 'admin' | 'dealer'`), `leads`, `invites`, and `appointments`. Secured tightly by `firestore.rules`.

## Important Rules & Reminders
- **User Creation:** NEVER use `createUserWithEmailAndPassword` while an Admin is logged in on the client, as it immediately logs the Admin out. We have successfully mitigated this by building an **Invite Link System** (`/admin` -> `invites` collection -> `/register?token=XYZ`). Always use this flow.
- **Email Automation:** We are using **Resend** via Next.js Server Actions (`src/actions/sendEmail.ts`) to dispatch automated emails.
- **Resend Free Tier Limitation:** Until the user verifies a domain at resend.com, testing emails MUST be sent to the exact same email address the user used to sign up for Resend, or they will fail.

## Where We Left Off (Next Action)
- We were deciding how to build the **Dealer Scheduling System**.
- **Pending Decision:** Does the user want Option A (embedding a native Google Calendar Appointment Scheduling `iframe` into `/dealer` for zero-bug calendar syncing) or Option B (building a custom native UI that saves to the Firestore `appointments` collection)? Wait for the user's decision before proceeding.
