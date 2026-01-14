# High-Fidelity App Demo Guide & Audio Strategy

To match the premium quality of your Veo footage, we cannot just use standard screen recordings. We need the "Apple Commercial" look.

## 🎥 Part 1: Matching Veo Quality (Screen Recording)

The contrast between cinematic 4K Veo footage and a grainy, low-res screen recording will be jarring. Follow these strict rules to bridge that gap.

### 1. The Setup (Crucial)
*   **Resolution:** Record in **4K (3840x2160)** if your monitor supports it. If not, map your browser window to exactly **1920x1080** and record at 100% scale.
*   **Browser:** Use a "Clean" profile.
    *   Hide Bookmarks Bar (`Ctrl+Shift+B`).
    *   Hide all Extensions.
    *   Enter Full Screen (`F11`) for the recording to remove the URL bar/tabs (unless you specifically want to show it's a browser).
*   **Zoom:** Set Browser Zoom to **110% or 125%**. Text in video needs to be larger than text for reading. Standard 100% usually looks tiny on mobile/video.

### 2. The Movement (The "Clay" Feel)
*   **Mouse Movement:** **DO NOT** wiggle the mouse. Move in straight lines or smooth arcs.
    *   *Pro Tip:* Use a lower DPI setting on your mouse to force slower, smoother movements.
*   **Typing:** If you are typing, type at a steady, confident pace. Don't make typos and backspace (unless it's part of the script).
*   **Waiting:** After clicking, hold the mouse still for 0.5s before moving to the next target. This makes the edit cleaner.

### 3. The "Frame" (Post-Production)
*   **Do not show the raw screen edge-to-edge.**
*   Place your screen recording inside a **Device Mockup** (Laptop or Tablet frame) with a subtle shadow.
*   This adds a layer of "realism" that blends better with the photorealistic Veo footage.
*   You mentioned "Clay Mockups" in the script—this is exactly right.

---

## 🎙️ Part 2: Vertex AI Audio (Google Cloud TTS)

Yes, Google Vertex AI (via Google Cloud Text-to-Speech) produces incredible, grounded results. You want to avoid the "Salesman" voice and go for the "Product Architect" voice.

### Recommended Voices
Go to the **Google Cloud Text-to-Speech** console. Look for:

*   **Journey Voices:** These are the most conversational and realistic.
    *   `en-US-Journey-D` (Male, deep, confident)
    *   `en-US-Journey-F` (Female, professional, calm)
*   **Studio Voices:** excellent for narration.
    *   `en-US-Studio-M` (Male, very authoritative, "Newscaster" style)
    *   `en-US-Studio-O` (Female, very clean and clear)

### Prompt/SSML Strategy
To get the "without exaggeration" tone:
1.  **Speed:** Set speaking rate to **0.9** or **0.95**. Slightly slower sounds more premium/thoughtful.
2.  **Pitch:** Keep it neutral (0.0).
3.  **SSML:** Use pauses `<break time="300ms"/>` to let the visuals breathe. Don't rush.

---

## 📋 Recording Checklist (What to Capture)

**Scene A: The Reveal (0:20 - 0:45)**
1.  **Landing Page:** Start on the Home/Landing page. Scroll down to show "Great Covers" briefly.
2.  **Launch:** Click the "Launch Application" button.
3.  **Onboarding:** 
    *   Watch the "Initializing Core Systems" animation.
    *   Enter Name ("John Morrison") and Role ("Managing Director").
    *   Click "Authenticate Access".
    *   Wait for "Configuring Workspace" loader.
    *   **STOP** when you see the Selection Screen (Upload Term Sheet / Load Astra). (Or record the click on "Upload Term Sheet" as the start of Scene B).

**Scene B: The Core Flow (0:45 - 1:15)**
1.  **Selection:** Click "Upload Term Sheet".
2.  **Wizard Step 1:** Wait on the "Upload" step. (Simulate upload completes).
3.  **Wizard Step 2:** Click continue to "Jurisdiction" step. Briefly toggle an option.
4.  **Wizard Step 3:** Click "Generate Deal".
5.  **Generation:** Record the "Processing Request" animation fully.
6.  **Dashboard Reveal:** Record the Dashboard appearing with the "Documents Generated" success state.

**Scene C: Voice Commander (1:15 - 1:30)**
1.  **Mobile/Voice:** Click the Microphone icon (bottom right or wherever located).
2.  **Interaction:** Wait for "Listening..." -> "Processing...".
3.  **Result:** See the answer overlay appear ("Leverage Covenant is...").
4.  **Navigation:** See the app navigate to the Negotiation Hub automatically.

**Scene D: Negotiation Intelligence (1:30 - 1:55)**
1.  **Hub:** Start on Negotiation Hub.
2.  **Conflict:** Scroll to "Conflict Resolution Center" (Red/Gold glow).
3.  **Resolve:** Click "Resolve Conflict with AI".
4.  **Process:** Watch the 3-step AI analysis animation ("Analyzing", "Cross-referencing", "Synthesizing").
5.  **Result:** See the "Proposal Approved" and "Predicted Acceptance 85%" reveal.

**Scene E: ESG & ROI (1:55 - 2:20)**
1.  **Navigation:** Click/Navigate to "ESG Intelligence" (or Analytics).
2.  **Showcase:** Hover over "Green Bond Eligibility" or charts.
3.  **ROI:** Navigate back to Dashboard. Allow the "Deal ROI Calculator" card to animate in (or scroll to it). Capture the numbers counting up to $2M.
