# SimpleReimbursement

SimpleReimbursement is a modern expense reimbursement management application designed for organizations to streamline the process of submitting, approving, and tracking expense reimbursements.

## Features

- **Multi-tenant Architecture**: Support for multiple organizations with isolated data
- **Team Management**: Add, invite, and manage team members with different roles
- **Role-based Permissions**: Admin, Approver, and User roles with appropriate permissions
- **Firebase Authentication**: Email/password and passwordless login options
- **Expense Submission**: Simple and intuitive expense submission process
- **Approval Workflows**: Configurable approval workflows based on expense amount
- **Stripe Integration**: Secure payment processing for subscriptions
- **Mobile Responsive**: Works seamlessly across devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Email**: Resend for transactional emails
- **Payments**: Stripe for subscription management
- **UI Components**: Custom component library with shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project
- Stripe account
- Resend account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Nadir-Urbina/simple-reimbursement.git
cd simple-reimbursement
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_ADMIN_PRICE_ID=
STRIPE_USER_PRICE_ID=
STRIPE_ADMIN_YEARLY_PRICE_ID=
STRIPE_USER_YEARLY_PRICE_ID=

# Firebase Admin SDK (for server-side operations)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Resend Email
RESEND_API_KEY=
EMAIL_FROM=invites@simplereimbursement.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application can be deployed to Vercel or any other platform that supports Next.js applications.

```bash
npm run build
```

## License

[MIT](LICENSE)

## Author

Nadir Urbina
