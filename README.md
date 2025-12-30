# ◬ NeuralSign: Futuristic Sign Language Translator

[![Status](https://img.shields.io/badge/Status-Live-00ff88.svg?style=flat-square)]()
[![WebGL](https://img.shields.io/badge/Graphics-WebGL_2.0-b026ff.svg?style=flat-square)]()
[![Three.js](https://img.shields.io/badge/Engine-Three.js-00d4ff.svg?style=flat-square)]()

**NeuralSign** is a cutting-edge web application that bridges the gap between spoken language and visual sign communication. Utilizing the **Web Speech API** for real-time neural processing and **Three.js** for high-fidelity 3D rendering, it transforms spoken words into fluid avatar animations.

---

## 🚀 Key Features

* **Real-time Speech Recognition:** Low-latency voice-to-text processing using the Web Speech API.
* **Dynamic 3D Avatar:** A fully rigged 3D model that responds to specific verbal triggers.
* **Neon-Cyber Interface:** A futuristic "Neural Interface" UI with glassmorphism effects and dark/light mode support.
* **System Debug Suite:** Live monitoring of animation states, word detection, and system health.
* **Responsive Design:** Fully optimized for different screen sizes with a custom WebGL resize handler.

---

## 🛠️ Technical Stack

| Category | Technology |
| :--- | :--- |
| **Graphics** | Three.js (WebGL 2.0) |
| **Animation** | AnimationMixer & GLTFLoader |
| **Voice** | Web Speech API |
| **Styling** | CSS3 (Custom Properties & Glassmorphism) |
| **Logic** | Vanilla JavaScript (ES6+) |

---

## 📂 Project Structure

```text
Project_SignLang/
├── index.html        # App architecture & CDN dependencies
├── style.css         # Futuristic UI & Theme definitions
├── script.js         # Core Logic (Speech + 3D Engine)
├── avatar.glb        # 3D Assets (Required for full experience)
└── vite.svg          # Assets

## ⚙️ Setup & Deployment
To deploy this project locally or on platforms like Vercel, Netlify, or GitHub Pages:

1. Local Development
Since the project uses GLTFLoader to pull in the 3D model, you must run this through a local server to avoid CORS issues.
# If you have Python installed:
python -m http.server 8000

# If you have Node.js installed:
npx serve .
2. Deployment Steps
Prepare Assets: Ensure your avatar.glb file is in the root directory.

External Scripts: The project uses CDNs for Three.js and GLTFLoader, so no local installation is strictly required.

Hosting: * GitHub Pages: Push your code to a repository and enable "Pages" in settings.

Vercel: Connect your GitHub repo for instant deployment.
## 🕹️ How to Use
Initialize: Click the Activate Voice button to grant microphone permissions.

Speak: Say words like "Hello", "Help", "Run", or "Jump".

Observe: The 3D Avatar will perform the corresponding animation based on your speech.

Debug: Monitor the System Debug panel to see the neural processing in real-time.

##📜 Word-to-Animation Map
The system recognizes and animate the following triggers:

👋 Greetings: "Hello", "Hi", "Goodbye", "Bye"

✅ Responses: "Yes", "No", "Thanks", "Please"

🏃 Actions: "Run", "Walk", "Jump", "Dance"

🛑 Commands: "Stop", "Sit", "Stand"

##🛡️ License
Built for the future of accessible communication.
