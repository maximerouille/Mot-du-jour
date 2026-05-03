# Mot du Jour — PWA avec notification quotidienne

This project creates a small installable web app that sends one French word to your phone every day.

## What is inside

- `public/index.html` — the app screen.
- `public/manifest.json` — PWA install settings.
- `public/sw.js` — service worker for offline cache and push notifications.
- `api/subscribe.js` — saves your phone notification subscription.
- `api/send-daily.js` — sends the daily word to all saved phones.
- `vercel.json` — schedules the daily notification at 06:00 UTC.

## Step 1 — Create accounts

Create free accounts on:

1. Vercel: https://vercel.com
2. Upstash: https://upstash.com

## Step 2 — Upload to GitHub

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Commit the files.

## Step 3 — Create Upstash Redis

1. In Upstash, create a Redis database.
2. Copy these values:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 4 — Import project in Vercel

1. In Vercel, click **Add New Project**.
2. Import your GitHub repository.
3. Before deploying, add Environment Variables:

```text
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
VAPID_SUBJECT=mailto:your_email@example.com
```

## Step 5 — Generate VAPID keys

On your computer, inside the project folder, run:

```bash
npm install
npm run generate-vapid
```

Copy the generated keys and add them to Vercel Environment Variables:

```text
VAPID_PUBLIC_KEY=generated_public_key
VAPID_PRIVATE_KEY=generated_private_key
```

Then redeploy the project in Vercel.

## Step 6 — Test the daily notification manually

Open this URL in your browser after deployment:

```text
https://YOUR-APP.vercel.app/api/send-daily
```

If your phone has subscribed, it should receive a notification.

## Step 7 — Install on iPhone

1. Open your Vercel app URL in Safari.
2. Tap the Share button.
3. Tap **Add to Home Screen**.
4. Open the app from your iPhone Home Screen.
5. Tap **Activer les notifications**.
6. Accept notification permission.

Important: on iPhone, web push works for web apps added to the Home Screen on iOS/iPadOS 16.4 or later.

## Step 8 — Daily schedule

The notification is scheduled in `vercel.json`:

```json
"schedule": "0 6 * * *"
```

This means 06:00 UTC. In Paris, that is usually 08:00 during summer time and 07:00 during winter time.

To change it, edit `vercel.json` and redeploy.

## Notes

- Keep your VAPID private key and Upstash token secret.
- If notifications do not appear, check iPhone Settings > Notifications and make sure the installed web app can send notifications.
