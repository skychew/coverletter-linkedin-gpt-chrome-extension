"use strict";

let prompt = "";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Background] Received message:", request);

  if (request.message === "setPrompt") {
    console.log("[Background] setPrompt:", prompt);
    prompt = request.prompt;
  } else if (request.message === "getPrompt") {
    console.log("[Background] getPrompt:", prompt);
    sendResponse({ prompt: prompt });
    prompt = ""; // Reset prompt
  }
});