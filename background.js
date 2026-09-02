const DEFAULTS = {
  enabled: true,
  entries: ["umami.is"],
};

// Resurstyper som täcker trackerskriptet och dess anrop, men inte
// vanlig sidnavigering (main_frame) — så att Umami-dashboarden
// fortfarande går att besöka.
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
    // URL-mönster, t.ex. "example.com/stats/script.js" för proxade
    // installationer. Blockera exakt det mönstret oavsett avsändare.
    condition.urlFilter = /^[|*]/.test(entry) ? entry : `||${entry}`;
  } else {
    // Ren domän: blockera all trafik till domänen (inkl. subdomäner)
    // från andra sajter, men släpp igenom trafik domänen gör själv —
    // annars slutar Umami-dashboarden att fungera.
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

  await chrome.action.setBadgeText({ text: enabled ? "" : "AV" });
  await chrome.action.setBadgeBackgroundColor({ color: "#b91c1c" });
}
