# Umami Blocker

A Chrome extension that blocks [Umami](https://umami.is) analytics at the
network level, so your own visits never show up in your stats. Built for site
owners who run Umami on their own websites and don't want to track themselves.

Unlike most existing tools, it doesn't rely on the `umami.disabled`
localStorage flag — requests to your Umami server are blocked with
`declarativeNetRequest` before they ever leave the browser.

## Features

- **Network-level blocking** — neither the tracker script (`script.js`) nor
  the collect calls (`/api/send`) are ever sent. Works regardless of Umami
  version or tracker configuration.
- **Your dashboard keeps working** — requests the Umami host makes to itself
  are allowed, so you can still log in and view your stats without toggling
  anything off.
- **Minimal permissions** — no content scripts, no access to page content.
  Just `declarativeNetRequest` and `storage`.
- **Umami Cloud covered by default** — `umami.is` ships as a default entry.
- **Synced settings** — your domain list follows your Chrome profile across
  machines.
- **Quick toggle** — turn blocking on/off from the popup; the icon shows a
  badge while blocking is off.

## Why not the `umami.disabled` flag?

Umami supports opting out by setting `umami.disabled=1` in localStorage, and
most existing extensions ([umami-chrome-extension](https://github.com/ledjay/umami-chrome-extension),
[internal-traffic-filter](https://github.com/hauju/internal-traffic-filter),
[disable-umami](https://github.com/uiolee/disable-umami)) work that way.
It's a fine approach, but it has trade-offs:

- The tracker script still loads on every page view — it just doesn't send.
- The flag must be set per site and per browser profile, and it silently
  stops working if it's ever cleared with site data.
- The extensions need content-script access to every page to set the flag.

Blocking at the network level sidesteps all of that: nothing loads, nothing
sends, and the extension never touches page content.

## Installation

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.

## Configuration

Open the options page (right-click the icon → Options, or via the popup) and
list the Umami servers to block, one per line:

- **Domain**, e.g. `stats.example.com` — blocks the tracker script and all
  calls to the server (subdomains included) initiated from other sites, while
  the Umami dashboard itself keeps working.
- **URL pattern** (contains a `/`), e.g. `example.com/stats/script.js` — use
  this when Umami is proxied through the same domain as the site itself. Add
  a pattern for the collect endpoint too, e.g. `example.com/stats/api/send`.

The default entry `umami.is` covers Umami Cloud.

## How it works

For each domain entry the extension installs a dynamic
`declarativeNetRequest` rule that blocks requests to the domain
(`||domain^`) for tracking-relevant resource types (`script`,
`xmlhttprequest`, `ping`, …), with the domain itself excluded as initiator.
That last part is what keeps the Umami dashboard usable: page navigations
and the dashboard's own API calls are same-origin and pass through, while a
tracker embedded on any other site is blocked.

URL-pattern entries are turned into plain `urlFilter` block rules without
the initiator exception, for proxied setups.

## License

[MIT](LICENSE)
