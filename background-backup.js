chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "setPrompt") {
    prompt = request.prompt;
  } else if (request.message === "getPrompt") {
    sendResponse({ prompt: prompt });
  } else if (request.action === "extractJobDataFromPage") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractJobData" }, sendResponse);
      } else {
        sendResponse(null);
      }
    });
    // 👇 Important: This keeps the message channel open until we call sendResponse
    return true;
  }
});
/*
"use strict";

console.log("connected...");

let prompt = "";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "setPrompt") {
    prompt = request.prompt;
  } else if (request.message === "getPrompt") {
    sendResponse({ prompt: prompt });
  } else if (request.action === "extractJobDataFromPage") {
    // Forward message to content script
    chrome.tabs.sendMessage(sender.tab.id, { action: "extractJobData" }, sendResponse);
    // Return true to indicate we will respond asynchronously
    return true;
  }
});
*/
/*
"use strict";

console.log("connected...");

let prompt = `Create me a cover letter for this job:
- Job Title: Software Engineer
- Company: LinkedIn
- Description: Responsible for developing and maintaining platform features.
`;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "getPrompt") {
        sendResponse({ prompt: prompt });
    }
});
*/