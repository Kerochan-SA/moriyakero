This is a [Next.js](https://nextjs.org) project bootstrapped with `[create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app)`.

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

This project uses `[next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)` to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

Create `.env.local` from `.env.example` and set the real values.

```bash
cp .env.example .env.local
```

## Prisma Setup (Supabase Postgres)

This repository includes Prisma for database operations (seed/import/admin tooling).

```bash
npm run prisma:generate
npm run prisma:pull
```

Useful commands:

- `npm run prisma:studio`
- `npm run prisma:migrate:dev`

## Current Login Spec

- Authentication method: email + password (`signInWithPassword`)
- Login page: `/login`
- Default post-login route: `/lives`
- Route guard: `/lives` requires signed-in user
- Authorization: signed-in user must exist in `public.band_members`
- DB protection: `live_setlist_entries` access is enforced by RLS policies
- Security note: authentication errors are intentionally generalized in UI