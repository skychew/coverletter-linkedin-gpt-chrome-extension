document.addEventListener("DOMContentLoaded", () => {
  const projectInput = document.getElementById("projectUrl");
  const promptInput = document.getElementById("promptIntro");

  // Load settings
  chrome.storage.sync.get(["projectUrl", "promptIntro"], (data) => {
    if (data.projectUrl) projectInput.value = data.projectUrl;
    if (data.promptIntro) promptInput.value = data.promptIntro;
  });

  // Save settings
  document.getElementById("save").addEventListener("click", () => {
    chrome.storage.sync.set({
      projectUrl: projectInput.value.trim(),
      promptIntro: promptInput.value.trim()
    }, () => {
      alert("✅ Settings saved!");
    });
  });
});