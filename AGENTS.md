<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Context Notes for Next Session

## Current Architecture & State
- **Project Scope:** We are building a B2B Dealership Portal, an Admin CRM, and an automated Lead Intake system for Kelley's Clear Headlights.
- **Tech Stack:** Next.js App Router (Turbopack), Tailwind CSS, Firebase (Auth & Firestore).
- **Deployment:** Deployed to Firebase App Hosting (CI/CD via GitHub).
- **Database Schema:** We rely on `users` (stores custom `role: 'admin' | 'dealer'`), `leads`, `invites`, and `appointments`. Secured tightly by `firestore.rules`.

## Important Rules & Reminders
- **User Creation:** NEVER use `createUserWithEmailAndPassword` while an Admin is logged in on the client, as it immediately logs the Admin out. We have successfully mitigated this by building an **Invite Link System** (`/admin` -> `invites` collection -> `/register?token=XYZ`). Always use this flow.
- **Email Automation:** We are using **Resend** via Next.js Server Actions (`src/actions/sendEmail.ts`) to dispatch automated emails.
- **Resend Free Tier Limitation:** Until the user verifies a domain at resend.com, testing emails MUST be sent to the exact same email address the user used to sign up for Resend, or they will fail.

## Where We Left Off (Next Action)
- User decided to go with Option A for the Dealer Scheduling System (embedding a Google Calendar Appointment iframe).
- **Pending Action:** The user needs to paste their actual Google Calendar scheduling URL into the `iframe src` placeholder in `src/app/dealer/page.tsx`.
