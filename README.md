# Friends Soccer Academy — Website

A static site for a community football club: hero, about, programs (age groups),
schedule, and a registration form.

## Files

```
friends-soccer-club/
├── index.html      # all page content
├── styles.css       # design system + layout
├── script.js        # mobile nav, age-based guardian fields, form submit
└── README.md
```

No build step, no framework, no dependencies — just static files, so it
deploys to Vercel in about a minute.

## 1. Deploy to Vercel

**Option A — Vercel dashboard (no terminal needed)**
1. Go to https://vercel.com and sign in (or create a free account).
2. Click **Add New → Project → Deploy without Git** (or drag-and-drop).
3. Drag the whole `friends-soccer-club` folder onto the upload area.
4. Framework preset: choose **Other** (it's plain HTML/CSS/JS).
5. Click **Deploy**. You'll get a live URL like `friends-soccer-club.vercel.app`.

**Option B — Vercel CLI**
```bash
npm install -g vercel
cd friends-soccer-club
vercel          # first deploy, follow the prompts
vercel --prod   # promote to your production URL
```

**Option C — GitHub**
1. Push this folder to a new GitHub repo.
2. In Vercel: **Add New → Project → Import Git Repository**, pick the repo.
3. Leave build settings blank (static site) and deploy.
   Every future push to `main` auto-deploys.

## 2. Connect the registration form (required)

The form is built to POST to **Formspree** (a free service that emails you
every submission — no server or database needed):

1. Create a free account at https://formspree.io
2. Create a new form, copy its endpoint URL (looks like
   `https://formspree.io/f/abcdEFGH`).
3. Open `script.js` and paste it in:
   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/abcdEFGH';
   ```
4. Redeploy (`vercel --prod`, or just re-upload if using the dashboard).

Until you do this, the form still works from a visitor's point of view —
it validates input and shows a confirmation message — but submissions
aren't delivered anywhere yet, so don't skip this step before going live.

**Alternative:** if you'd rather not use a third party, you can replace the
fetch call in `script.js` with a call to a Vercel Serverless Function
(`/api/register`) that emails you via a provider like Resend or SendGrid.
Ask if you'd like that version built out instead — it needs an API key from
whichever email provider you choose.

## 3. Customize before launch

Search these files for placeholder content and swap in the real details:

- `index.html`: address, phone, email, social links (footer), founding
  year and stats (hero ticker + About section), fixture list (Schedule).
- Club colors/fonts live as CSS variables at the top of `styles.css` under
  `:root` if you want to adjust the palette.

## 4. Custom domain (optional)

In the Vercel project → **Settings → Domains**, add your own domain (e.g.
`friendssoccerclub.com`) and follow the DNS instructions Vercel provides.
