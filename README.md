# The Operator's Notes

A minimal, intelligent personal website for Felix — a public repository of thinking on startups, products, Web3, growth, and execution.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **MDX** for content

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Notes

Drop a new `.mdx` file in `content/notes/` with this frontmatter:

```mdx
---
title: "Your Note Title"
excerpt: "A short description shown in listings."
date: "2025-06-01"
category: "Startups"   # Startups | Products | Web3 | Growth | Research | Essays | Systems | Execution
tags: ["tag1", "tag2"]
featured: false
---

Your content here...
```

The site updates automatically. No CMS needed.

## Deploy to Vercel

1. Push to GitHub
2. Import repo at vercel.com
3. Deploy — zero config needed

## Pages

- `/` — Home with latest notes, projects, and thinking areas
- `/notes` — Searchable, filterable note archive
- `/notes/[slug]` — Individual note with reading progress
- `/projects` — MEADNET, CALMLEDGER, and future projects
- `/about` — How Felix thinks, current focus, reading list
- `/contact` — Socials + contact form

## Extending

**Newsletter** — Add a `/newsletter` route and a `POST /api/subscribe` endpoint.  
**Podcast** — Add a `/podcast` route with episode MDX files in `content/podcast/`.  
**Resources** — Add a `/resources` route with curated link MDX in `content/resources/`.
