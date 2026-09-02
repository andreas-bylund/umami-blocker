const DEFAULTS = {
  enabled: true,
  entries: ["umami.is"],
};

// Resource types that cover the tracker script and its calls, but not
// regular page navigation (main_frame) — so the Umami dashboard itself
// stays reachable.
const BLOCKED_RESOURCE_TYPES = [
  "script",
  "xmlhttprequest",
  "ping",
  "image",
  "media",
  "websocket",
  "other",
];

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.sync.get(null);
  if (stored.entries === undefined) {
    await chrome.storage.sync.set(DEFAULTS);
  }
  await updateRules();
});

chrome.runtime.onStartup.addListener(updateRules);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && (changes.entries || changes.enabled)) {
    updateRules();
  }
});

function entryToRule(entry, id) {
  const condition = { resourceTypes: BLOCKED_RESOURCE_TYPES };

  if (entry.includes("/")) {
    // URL pattern, e.g. "example.com/stats/script.js" for proxied
    // setups. Block that exact pattern regardless of initiator.
    condition.urlFilter = /^[|*]/.test(entry) ? entry : `||${entry}`;
  } else {
    // Plain domain: block all traffic to the domain (subdomains
    // included) from other sites, but let the domain's own requests
    // through — otherwise the Umami dashboard stops working.
    condition.urlFilter = `||${entry}^`;
    condition.excludedInitiatorDomains = [entry];
  }

  return {
    id,
    priority: 1,
    action: { type: "block" },
    condition,
  };
}

async function updateRules() {
  const { enabled, entries } = await chrome.storage.sync.get(DEFAULTS);

  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((rule) => rule.id);

  const addRules = enabled
    ? entries
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry, i) => entryToRule(entry, i + 1))
    : [];

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules,
  });

  await chrome.action.setBadgeText({ text: enabled ? "" : "OFF" });
  await chrome.action.setBadgeBackgroundColor({ color: "#b91c1c" });
}
