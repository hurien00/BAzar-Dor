<div align="center">

# 🛒 BazarDor (বাজার দর)
### Real-Time Commodity Price Monitoring & Market Comparison Platform
</div>

---
## 📝 Short Description

**BazarDor (বাজার দর)** is a modern, responsive web application designed to track and monitor daily commodity prices, daily price fluctuations, and market-wise comparisons across various local markets in Bangladesh. The project aims to empower users with transparent price insights to make informed daily purchasing decisions.

---

## 🛠️ Technologies Used

* **Frontend Framework:** Next.js 15 (App Router), React, Tailwind CSS[cite: 2]
* **Backend & API Proxy:** Next.js Serverless API Routes (`/api/bazardor`)[cite: 2, 3]
* **Database Adapter:** MongoDB Client[cite: 2]
* **Authentication:** Better Auth (Email/Password + Google & GitHub Social Auth)[cite: 1, 2]
* **External Integration:** Programming Hero Open API (BazarDor API)[cite: 1, 3]
* **UI Feedback:** Sonner Toast Notifications[cite: 5]

---

## ✨ 5 Key Features

### 1. Real-Time Market Data & Live Ticker
Fetches up-to-date pricing data directly from external APIs and streams live market fluctuations via a smooth, interactive marquee ticker at the header[cite: 1, 6].

### 2. Protected Routes & Multi-Provider Social Auth
Secures sensitive pages (e.g., product details and category routes) behind authentication guards using Better Auth with Google and GitHub social login integrations[cite: 1, 5, 6].

### 3. Figma-Inspired Product Details & Market Breakdown
Displays detailed product summaries including unit breakdown, price change percentages, min/max/avg stats, and complete market-by-market comparison tables[cite: 1, 2, 4, 6].

### 4. Category Filtering & Price Sorting Controls
Allows users to browse commodities by categories (e.g., Rice, Vegetables, Fish) with interactive sorting options (Default, Low-to-High, High-to-Low)[cite: 6].

### 5. Resilient Fallback Engine & Skeleton Loading
Features interactive skeleton placeholders during fetch requests and dynamic fallback routing to handle unexpected dynamic slugs or empty states gracefully without page crashes[cite: 3, 6].

---







This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
