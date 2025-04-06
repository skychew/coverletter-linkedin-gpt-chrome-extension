"use strict";

// Delay the insertCoverLetterBtn() with a DOM check loop
// LinkedIn uses a single-page application (SPA) architecture
// and dynamically loads content without full page reloads.
// This means that the DOM may not be fully loaded when the script runs.
// To ensure that the button is inserted at the right time,
// we need to wait for the target container to be available.
// so we use a wrapper function that checks for the target container
// and then calls the insertCoverLetterBtn() function.
function waitForTargetContainer(callback, retries = 20, interval = 300) {

    const tryFind = () => {
        const container = document.querySelector(".jobs-apply-button--top-card");
        if (container) {
            callback();
        } else if (retries > 0) {
            setTimeout(() => tryFind(--retries), interval);
        } else {
            console.warn("❌ Could not find target container after navigation.");
        }
    };
    tryFind();
}

function insertCoverLetterBtn() {
    // Prevent multiple buttons
    if (document.getElementById("generate-cover-letter-btn")) return;

    // Decide where to place the button
    const targetContainer = document.querySelector(".jobs-apply-button--top-card"); // or similar

    if (targetContainer) {
        console.log(" Found Apply button container, inserting button");
        const button = document.createElement("button");
        button.id = "generate-cover-letter-btn";
        button.innerText = "🤖 AI Cover Letter";
        // ✅ Use LinkedIn’s native button classes
        button.className = "jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view";
        //button.style.margin = "4px";
        button.onclick = () => {
            // Step 1: Extract job data directly here
            const jobTitle =
              document.querySelector("main h1")?.innerText.trim() ||
              document.querySelector(".job-details-jobs-unified-top-card__job-title h1")?.innerText.trim() ||
              document.querySelector(".top-card-layout__title")?.innerText.trim() || 
              '';
          
            const companyName =
              document.querySelector(".job-details-jobs-unified-top-card__company-name a")?.innerText.trim() ||
              document.querySelector(".topcard__org-name-link")?.innerText.trim() ||
              document.querySelector(".topcard__flavor")?.innerText.trim() ||
              document.querySelector(".jobs-unified-top-card__primary-description")?.innerText.trim() ||
              '';
          
            const jobDescription =
              document.querySelector(".show-more-less-html__markup")?.innerText.trim() ||
              document.querySelector(".mt4")?.innerText.trim() ||
              document.querySelector(".description__text")?.innerText.trim() ||
              document.querySelector("[data-test-job-description]")?.innerText.trim() || 
              '';
          
            console.log("[Content Script] Extracted job data:", { jobTitle, companyName, jobDescription });
          
            // Step 2: Handle fallback if nothing is found
            if (!jobTitle && !companyName && !jobDescription) {
              alert("⚠️ Couldn’t find job data. Please make sure you’re on a valid LinkedIn job post.");
              return;
            }
          
            // Step 3: Build prompt and Step 4: Save prompt to background
            chrome.storage.sync.get(["promptIntro"], (data) => {
                const intro = data.promptIntro?.trim() || "Create me a cover letter for this job:";
                const prompt = `
              ${intro}
              - Job Title: ${jobTitle}
              - Company: ${companyName} 
              - Description: ${jobDescription}
              `.trim();

                chrome.runtime.sendMessage({ message: "setPrompt", prompt });
            });
          
            // Step 5: Open ChatGPT
            chrome.storage.sync.get(["projectUrl"], (data) => {
                const baseUrl = data.projectUrl?.trim() || "https://chatgpt.com";
                const finalUrl = baseUrl.includes("?") ? `${baseUrl}&ref=linkedin-plugin` : `${baseUrl}?ref=linkedin-plugin`;
                window.open(finalUrl, "_blank");
            });
          };

        targetContainer.appendChild(button);
    }
}

let oldHref = "";

window.onload = async () => {
    console.log("LinkedIn Cover Letter Plugin loaded");
    
    if (window.location.hostname === "www.linkedin.com") {
        if (window.location.pathname.includes("/jobs/view/")) {
            console.log("Detected LinkedIn job post page");
            waitForTargetContainer(insertCoverLetterBtn);
        }
        // Observe changes in the DOM to detect when the URL changes
        // This is useful for LinkedIn's SPA behavior
        // and when navigating to job posts
        // without a full page reload
        // MutationObserver only detects changes in the DOM structure — not routing events like URL changes.
        // So if LinkedIn updates the DOM without injecting new nodes, your observer may not catch it.
        // We intercept LinkedIn’s internal navigation calls by overriding pushState and listening to popstate.

        // Intercepting history changes
        // This is a common pattern to detect route changes in single-page applications (SPAs)
        function hookHistoryChanges(callback) {
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function () {
                originalPushState.apply(this, arguments);
                callback();
            };
            history.replaceState = function () {
                originalReplaceState.apply(this, arguments);
                callback();
            };

            window.addEventListener("popstate", callback);
        }

        hookHistoryChanges(() => {
            if (window.location.hostname === "www.linkedin.com" &&
                document.location.pathname.includes("/jobs/view/")) {
                console.log("Route change detected via history API");
                waitForTargetContainer(insertCoverLetterBtn);
            }
        });

        // Observe DOM changes
        // This is useful for LinkedIn's SPA behavior
        const bodyList = document.querySelector("body");
        // Set initial href so observer detects changes correctly
        oldHref = document.location.href;

        let observer = new MutationObserver(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                if (document.location.pathname.includes("/jobs/view/")) {
                    console.log("URL changed, re-inserting cover letter button");
                    waitForTargetContainer(insertCoverLetterBtn);
                }
            }
        });
        observer.observe(bodyList, { childList: true, subtree: true });
    }


    // search ChatGPT page for textarea
    // and insert the prompt
    console.log("looking for hostname");
    if (
        window.location.hostname === "chat.openai.com" ||
        window.location.hostname === "chatgpt.com"
    ){
        console.log("Detected ChatGPT page");
        if (window.location.search === "?ref=linkedin-plugin") {
            chrome.runtime.sendMessage({ message: "getPrompt" }, (response) => {
                console.log("Received prompt from background:", response.prompt);

                function waitForEditableDiv(callback, retries = 20, interval = 300) {
                    const tryFind = () => {
                        const editableDiv = document.getElementById("prompt-textarea");
                        if (editableDiv) {
                            callback(editableDiv);
                        } else if (retries > 0) {
                            setTimeout(() => tryFind(--retries), interval);
                        } else {
                            console.warn("❌ Timeout: Could not find ChatGPT input area.");
                        }
                    };
                    tryFind();
                }

                waitForEditableDiv((editableDiv) => {
                    console.log("start editing");
                    editableDiv.focus();
                    editableDiv.innerHTML = `<p>${response.prompt}</p>`;

                    const enterEvent = new KeyboardEvent("keydown", {
                        bubbles: true,
                        cancelable: true,
                        key: "Enter",
                        code: "Enter"
                    });
                    editableDiv.dispatchEvent(enterEvent);
                });
            });
        }
    }
};