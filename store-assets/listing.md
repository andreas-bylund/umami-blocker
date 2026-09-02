# Chrome Web Store listing copy

Paste-ready text for the Developer Dashboard.

## Store listing tab

**Title:** Umami Blocker

**Summary (max 132 chars):**

> Blocks Umami analytics at the network level, so your own visits never
> show up in your stats.

**Description:**

> Run Umami analytics on your own websites? Then you're probably in your
> own stats. Umami Blocker keeps you out of them.
>
> Unlike tools that rely on the umami.disabled localStorage flag, Umami
> Blocker works at the network level: requests to your Umami server are
> blocked with declarativeNetRequest before they ever leave the browser.
> Neither the tracker script (script.js) nor the collect calls (/api/send)
> are ever sent.
>
> FEATURES
>
> • Network-level blocking — works regardless of Umami version or tracker
>   configuration
> • Your Umami dashboard keeps working — only tracking traffic is blocked,
>   so you can still log in and view your stats
> • Minimal permissions — no content scripts, no access to page content
> • Umami Cloud covered by default; add your self-hosted domains in options
> • URL patterns for proxied setups (e.g. example.com/stats/script.js)
> • Settings sync across your Chrome profiles
> • Quick on/off toggle from the popup
>
> Open source (MIT): https://github.com/andreas-bylund/umami-blocker

**Category:** Developer Tools (alternatively Productivity)

**Language:** English

## Privacy tab

**Single purpose description:**

> Blocks network requests to user-configured Umami analytics servers so
> that site owners' own visits are excluded from their analytics.

**Permission justifications:**

- `declarativeNetRequest`:
  > Used to block network requests (tracker script and collect calls) to
  > the Umami analytics servers the user has configured. This is the core
  > and only function of the extension.
- `storage`:
  > Stores the user's list of Umami server domains and the on/off state,
  > synced via chrome.storage.sync.

**Remote code:** No, the extension does not use remote code.

**Data usage:** The extension does not collect, transmit, or share any
user data. All settings stay in Chrome sync storage. (Check "no data
collected" for every category.)

## Assets

- `screenshot-1280x800.png` — store screenshot (1280×800)
- `promo-440x280.png` — small promo tile (440×280)
- Icon 128×128 is taken from the uploaded zip (`icons/icon128.png`)

## Distribution tab

- Visibility: Public
- Price: Free
- Regions: all

## Account

- One-time $5 developer registration fee
- Two-step verification must be enabled on the Google account
- EU DSA declaration: choose **non-trader** (hobby project, free, no
  monetization) — no public address required
