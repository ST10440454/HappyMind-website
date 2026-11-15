# Happy Minds: website

The public website for Happy Minds.
(Authentication + Cloud Firestore), so:

- an account created on the website works in the app, and the other way round;
- donations are paid with **PayFast**, through the same Cloudflare Worker the app uses, and appear in the
  same `donations` collection (and the app's admin dashboard).

## Project structure

```
HappyMinds/
├── public/                    ← web root
│   ├── index.php, about.php, programs.php, impact.php,
│   │   get-involved.php, resources.php, contact.php
│   ├── donate.php             PayFast card donation + donation history
│   ├── admin.php              staff portal (Firebase admin sign-in + Firestore)
│   └── assets/
│       ├── css/               style.css, theme.css, donate.css
│       ├── js/                firebase-config.js ← your Firebase keys
│       │                      firebase-init.js   shared Firebase SDK starter
│       │                      auth.js            accounts, donations, PayFast calls (window.HMAuth)
│       │                      admin-portal.js    staff portal logic (admin.php)
│       │                      auth-modal.js, header-auth.js, donate.js, main.js
│       └── images/            hero.jpg
├── src/                       bootstrap + shared head/header/footer/scripts
└── README.md
```

### Create your admin account(s) (staff portal)

The staff portal (`admin.php`) uses the **same admin model as the app**: an admin is a Firebase Auth user that has a
document in the `admins` collection. Set one up once:

1. Firebase console → **Authentication → Users → Add user** (email + password), or use an existing account.
2. Copy that user's **User UID**.
3. **Firestore Database → Start collection** `admins` → **Document ID = the UID** → add any field (for example
   `role` = `admin`) → Save.

That account can now sign in on `admin.php` and in the app's admin login. The Firestore rules (published from the app
project) decide what an admin may do: read all users and donations, and approve or reject accounts. Nobody can add
themselves to `admins` from a browser.

## How it works

**Accounts** follow the app exactly. Registering creates the Firebase account and a `users/{uid}` profile with
status `PENDING`, and the visitor is *not* signed in. An admin approves the account in the app's dashboard; only
then can the person sign in on the website or in the app. Learners add their child's details in the app.

**Google sign-in** ("Continue with Google" in the sign-in window) follows the same approval rule:

| Who | What happens |
|---|---|
| New Google user | A `PENDING` profile is created (name from their Google account), they are *not* signed in; wait for approval |
| Existing, approved | Signed in |
| Existing, pending / declined | Refused with the same messages as email sign-in |
| Existing account with no learner profile (e.g. staff) | Refused; no profile is created for it |

If a person already registered with the same email and password, signing in with Google reaches the same account
and profile (no duplicates).

**Staff portal** (`/admin.php`): sign in with an admin account.

- *Volunteers* tab: `users` documents with `isVolunteer == true`. **Approve / Reject** updates that user's `status`,
  which is what lets them sign in. The Role filter and the role chart are built from what volunteers typed.
  Learner (non-volunteer) accounts are not shown here; approve those in the app's admin dashboard.
- *Donations* tab: every `donations` document with its status. Totals, averages and the amount chart count only
  paid (`COMPLETE`) donations, as in the app. **Send receipt** opens a ready-to-send email in the admin's mail app;
  nothing is sent automatically.
- Phone is shown as "—" because volunteer records don't store a phone number.

**Donations** (approved accounts only, R10 to R50 000, once-off):

1. The website sends the user's Firebase ID token to the Worker (`POST /create`).
2. The Worker creates a `PENDING` donation and returns a signed PayFast URL.
3. The browser goes to PayFast's hosted page and the card is typed there. This site never sees card data.
4. PayFast notifies the Worker, which marks the donation `COMPLETE`/`FAILED`/`CANCELLED` after verifying it.
5. PayFast sends the donor back to `donate.php`, which listens to the donation's status and shows the result.

The website never writes donations; the Firestore rules only let the Worker do that.

## Data model (shared with the app)

| Document | Fields |
|---|---|
| `users/{uid}` | `fullName`, `email`, `childName`, `age`, `grade`, `status` (PENDING / APPROVED / REJECTED), `isVolunteer`, `helpType`, `skills`, `createdAt` (ms) |
| `donations/{id}` | `userId`, `amount` (text such as `"50.00"`), `frequency`, `fullName`, `email`, `status` (PENDING / COMPLETE / FAILED / CANCELLED), `pfPaymentId`, `timestamp` (ms) |

