# 🤖 LinkedIn Cover Letter Assistant

This Chrome extension helps you instantly generate a cover letter based on any LinkedIn job post using ChatGPT.

---

## 🔧 Features

- Adds a button to LinkedIn job posts
- Automatically extracts the job title, company name, and description
- Opens ChatGPT and pastes a customized prompt
- Supports custom project URL and prompt intro via extension settings

---

## 🧪 How to Use

1. **Install manually:**
   - Go to `chrome://extensions/`
   - Enable "Developer Mode"
   - Click **Load Unpacked**
   - Select this folder (`linkedin_cover_letter_plugin`)

2. **Browse to a LinkedIn job post**
3. Click the **🤖 AI Cover Letter** button near the "Easy Apply" button
4. ChatGPT opens in a new tab with your prompt pre-filled

---

## ⚙️ Customize Settings

Click the extension icon to open the settings popup:

- 🔗 **Project URL**: Specify a target ChatGPT project (optional)
- ✍️ **Prompt Intro**: Customize the first line of the prompt (e.g. “Please write a concise cover letter...”)

---

## 📁 Project Structure
</br>
linkedin_cover_letter_plugin/</br>
├── manifest.json</br>
├── background.js</br>
├── settings.html</br>
├── settings.js</br>
├── icon.png</br>
├── src/</br>
│   └── contentscript/</br>
│       └── content.js</br>
</br>
---

## 📌 Permissions

- `activeTab`, `tabs`, `storage`: Required to interact with LinkedIn pages and store your settings
- Matches: `linkedin.com`, `chatgpt.com`, `chat.openai.com`

---

## 🙌 Credits

Built with ❤️ to simplify job applications using ChatGPT.
