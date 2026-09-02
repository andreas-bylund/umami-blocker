const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

async function render() {
  const { enabled = true, entries = [] } = await chrome.storage.sync.get([
    "enabled",
    "entries",
  ]);
  toggle.checked = enabled;
  const count = entries.filter((e) => e.trim()).length;
  status.textContent = enabled
    ? `Blockerar ${count} ${count === 1 ? "domän/mönster" : "domäner/mönster"}.`
    : "Blockering avstängd.";
}

toggle.addEventListener("change", async () => {
  await chrome.storage.sync.set({ enabled: toggle.checked });
  render();
});

document.getElementById("openOptions").addEventListener("click", (event) => {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
});

render();
