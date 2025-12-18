# Interactive AI Lab CV 🧪

> **Status:** 🚧 *Idea in Execution*

A single-page personal portfolio built with **Vanilla HTML/CSS/JS** that explores the concept of **"Client-Side Observability"**.
Beyond just displaying experience, this website acts as an active agent, analyzing visitor behavior (scroll speed, dwell time, interactions) to generate a real-time "Session Profile".

## 🚀 The Concept
The core idea was to build a static website (hosted on GitHub Pages) that feels "alive".
Instead of a passive PDF, the site:
1.  **Observes**: Tracks interaction metrics locally in the browser (`script.js`).
2.  **Profiles**: Uses unsupervised logic to classify the visitor's intent (e.g., "Rapid Skimmer" vs. "Technical Auditor").
3.  **Connects**: *[Experimental]* Sends anonymous session telemetry to a cloud database (Google Sheets) via Webhooks.

## 🛠️ Tech Stack
-   **Frontend**: Native HTML5, CSS3 (Custom Properties / No frameworks), ES6+ JavaScript.
-   **AI/Logic**: Unsupervised Heuristic Clustering for behavioral profiling.
-   **Cloud Integration**: Google Apps Script Webhook (Serverless Logging).

## 🧠 What I'm Learning (The "Why")
I wanted to understand **how specific user data is extracted and handled active-sessions** without a heavy backend.
I'm currently experimenting with:
-   **Edge Telemetry**: Capturing data directly on the client device.
-   **Beacon API & CORS**: Managing data transmission from static pages.
-   **Data Persistence**: Storing ephemeral session data in permanent cloud storage.

## 🔮 Next Steps
-   [ ] Stabilize the Google Sheets webhook connection (debugging CORS on static hosting).
-   [ ] Implement a persistent neural network using TensorFlow.js.
-   [ ] Improve the mobile responsiveness of the Telemetry Console.

---
*Built by Gabriel Leguizamón Cabañas as a playground for AI & Web Tech.*
