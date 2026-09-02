const textarea = document.getElementById("entries");
const savedLabel = document.getElementById("saved");

async function load() {
  const { entries = ["umami.is"] } = await chrome.storage.sync.get("entries");
  textarea.value = entries.join("\n");
}

document.getElementById("save").addEventListener("click", async () => {
  const entries = textarea.value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  await chrome.storage.sync.set({ entries });
  savedLabel.classList.add("visible");
  setTimeout(() => savedLabel.classList.remove("visible"), 1500);
});

load();
