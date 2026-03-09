# Testing EthioCyber Radar Lab

## Overview
EthioCyber Radar Lab is a frontend-only Next.js 16 (App Router) application with Tailwind CSS v4 and TypeScript. All data is persisted via LocalStorage - there is no backend. Testing is done entirely through the browser UI.

## Local Setup
1. `npm install` in the repo root
2. `npm run dev` to start the dev server (default port 3000)
3. If port 3000 is in use, Next.js will auto-select the next available port (e.g., 3001)
4. If you see a lock file error ("Unable to acquire lock"), kill any existing `next dev` processes first: `pkill -f 'next dev'`

## Key Test Flows

### 1. User Registration
- Navigate to `/profile` (or click "Get Started" in navbar)
- Fill: Full Name, Username, Email, Age (must be 20-30), University
- Select at least one skill from the multi-select buttons
- Click "Create Profile" - redirects to `/dashboard`

### 2. Challenge Completion
- Navigate to `/cyberlab` to see all 15 challenges
- Click any challenge card to open the challenge page at `/challenge/[id]`
- Challenge answers are case-insensitive (stored in `src/data/challenges.ts`)
- Example: "Phishing Email Detection" (id: phishing-1) answer is "phishing"
- Type the answer and click "Submit Answer"
- Success shows green "Correct! You earned X points!" message
- Points and badges update automatically in the dashboard

### 3. Admin Dashboard
- Toggle role to "Admin" using the User/Admin toggle in the top-right navbar
- Admin/Analytics links appear in navbar when admin role is active
- `/admin` shows Challenges tab (CRUD) and Users tab
- `/analytics` shows stats, category performance, difficulty distribution

### 4. Leaderboard
- `/leaderboard` shows rankings sorted by points
- Search by name/username/university
- Sort by points, challenges, or name

### 5. Data Persistence
- All data stored in LocalStorage under keys: `users`, `challenges`, `userProgress`, `currentUserId`, `userRole`
- Refresh the page to verify data persists
- To reset all data, clear LocalStorage in browser DevTools

## Common Challenge Answers (for testing)
- phishing-1: "phishing"
- password-1: "c"
- crypto-1: "hello world"
- websec-1: "xss"
- network-1: "sftp"

## Lint & Build
- `npm run lint` - ESLint check
- `npm run build` - Production build (also runs TypeScript checking)
- No CI is configured on this repo

## Gotchas
- The `useLocalStorage` hook initializes state from localStorage in `useState`'s lazy initializer. There may be hydration warnings in the console on first load if localStorage has data from a previous session - this is expected behavior for client-side-only data.
- Role toggle is purely frontend simulation - any user can switch to admin mode.
- Port conflicts: If another Next.js instance is running, you'll get lock file errors. Always kill previous instances before starting a new one.

## Devin Secrets Needed
None - this is a frontend-only app with no external services or authentication.
