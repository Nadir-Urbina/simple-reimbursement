we are going to build a new product, this product is called SimpleReimbursement, and this product is for companies to manage effectively expense reports that may or may not be reimbursed according to company policies.

This should have a user oriented interface where employees can submit expense reports whether it is grouped expenses that are all for the same report, or one individual expense.

The platform should also have an admin vew, which is what finance will use to receive the expense reports review them and reimburse when applicable.

The admin can define criteria for auto approval of the expense based on amounts, they can also define what's the minimum amount allowed when submitting expenses, all expenses must be reviewed by finance, and if necessary, they can request manager's approval in cases where they need to reassure that they can reimburse the expense.

This app should be user friendly for both users and admins.

Here are some basic guidlines for development, UI and others, although I am open to suggestions and ideas, I know there are many apps of this kind out there so having the best of each of them will also be helpful:

# Project Instructions

## Tech Stack

You are an expert in Web Development using:

- TypeScript
- Node.js
- React
- Next.js (App Router)
- Tailwind CSS
- ShadCN UI
- Firebase (Auth, Firestore, Storage)
- Sanity CMS

## Code Style and Structure

- Write concise, technical TypeScript code with proper type annotations
- Use functional and declarative programming patterns; avoid classes
- Prefer immutability and pure functions when possible
- Use iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Structure files: exported component, subcomponents, helpers, static content
- Always use proper TypeScript interfaces or types for data models

## Naming Conventions

- Use kebab-case for directories
- Use camelCase for variables and functions
- Use PascalCase for components and type definitions
- File names for components should be in PascalCase. Rest of the files in kebab-case
- Prefix component names with their type (e.g., ButtonAccount.tsx, CardAnalyticsMain.tsx)
- Use descriptive type names with suffixes like Props, Data, Response

## Syntax and Formatting

- Use the "function" keyword for pure functions
- Use arrow functions for callbacks and component definitions
- Use TypeScript's type inference where appropriate, but add explicit types for function parameters and returns
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements
- Use optional chaining (?.) and nullish coalescing (??) operators

## UI and Styling

- Use ShadCN UI components as the foundation
- Extend with Tailwind CSS for custom styling needs
- Implement responsive design with Tailwind CSS; use a mobile-first approach
- Leverage Tailwind's composable classes rather than creating custom CSS
- Use color tokens from the theme consistently

## State Management and Data Flow

- Use Firebase for authentication and data storage
- Implement proper typed Firebase hooks for data fetching and mutations
- Create typed API for Firebase interactions
- Use Sanity for content management with typed schemas
- Implement GROQ queries with proper TypeScript types

## Performance Optimization

- Minimize 'use client', 'useState', and 'useEffect'; favor React Server Components (RSC)
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Optimize images: use Next.js Image component with proper sizing
- Implement proper Firebase query optimizations (limit, where clauses)
- Add proper Firebase indexing for complex queries

## Key Conventions

- Optimize Web Vitals (LCP, CLS, FID)
- Limit 'use client':
    - Favor server components and Next.js SSR
    - Use only for Web API access, Firebase SDK in small components
    - Use proper data fetching patterns for Firebase in server components
- Follow TypeScript best practices:
    - Create interfaces for all data models
    - Use utility types (Partial, Pick, Omit) appropriately
    - Define proper return types for all functions
- Firebase conventions:
    - Create typed hooks for Firestore operations
    - Always handle loading and error states
    - Implement proper security rules
- Sanity conventions:
    - Create typed schemas
    - Use properly typed GROQ queries
    - Implement content validation

## Design Guidelines

- Create beautiful, production-worthy designs, not cookie-cutter templates
- Use ShadCN UI components as building blocks, customize as needed
- Maintain consistent spacing, typography, and color usage
- Ensure accessibility standards are met
- Do not install additional UI packages unless absolutely necessary