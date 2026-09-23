# How the daily article reaches production

## The situation today (23 September 2026)

Production is deployed from the **owner's working tree**, not from git:

```
node .tmp-vercel-cli/dist/vc.js deploy --prod --yes
```

`vercel.json` sets `git.deploymentEnabled: false`, so pushing to GitHub deploys nothing. The
Vercel CLI uploads whatever is in the folder at that moment, committed or not.

That matters because the working tree currently holds **46 modified or deleted files and 114
untracked ones** that have never been committed: article images for recent partner stories, the
experts photos, `src/app/page.tsx`, `layout.tsx`, `ArticlePage.tsx`, API routes, `next.config.ts`,
`package.json` and more. All of it is live. None of it is in the repository.

**Consequence:** any deploy started from a clean checkout of `main` (GitHub Actions, a cloud
agent, a new machine) would publish the repository as it stands and silently roll production back,
losing every one of those files. Images referenced by published articles would start returning 404.

So the automated writer can safely **write, commit and push**. It must not deploy from a checkout
until the repository and production are the same thing.

## Step one: bring the repository in sync

Review and commit the working tree in batches, smallest risk first:

1. `public/images/**` and `src/content/**` — images and articles that are already live.
2. `docs/`, `scripts/`, `.github/` — tooling.
3. `src/app/**`, `src/components/**`, config files — the owner's own code, reviewed by the owner.

After the last batch, `git status` should be clean apart from deliberate local-only files, and
`git push` should leave the repository identical to what is deployed. Verify by running a deploy
from a fresh clone and comparing a few pages.

## Step two: arm the deploy workflow

`.github/workflows/auto-article.yml` is in the repository but **deliberately not armed**: it runs
only on `workflow_dispatch` (the "Run workflow" button). Once step one is done, change its trigger
to:

```yaml
on:
  push:
    branches: [main]
    paths: ["src/content/**"]
  workflow_dispatch:
```

and add these repository secrets (Settings → Secrets and variables → Actions):

| Secret | Where it comes from |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` in this repo, field `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json`, field `projectId` |
| `TELEGRAM_BOT_TOKEN` | optional, for the "published" ping |
| `TELEGRAM_CHAT_ID` | optional, same |

Note: GitHub's `schedule` trigger has never fired for this repository (see the comment in
`professional-scan-worker.yml`), which is why the schedule lives in the agent and GitHub only
reacts to a push.

## Until step one is done

The agent writes, commits and pushes. Deployment stays a manual `deploy --prod` from the owner's
machine, which keeps the uncommitted work alive. The article is on GitHub within minutes of being
written and on the site at the next deploy.

## Vercel usage

The account is on the Hobby plan and went over its limits on 23 September 2026. One extra build a
day is small, but if ISR reads or edge requests are the binding constraint, watch them after
switching the automation on.
