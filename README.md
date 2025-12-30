# ◬ NeuralSign: Advanced 3D Neural Interface & Sign Language Translator

[![WebGL](https://img.shields.io/badge/Graphics-WebGL_2.0-b026ff.svg?style=for-the-badge&logo=opengl)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![Three.js](https://img.shields.io/badge/Engine-Three.js-00d4ff.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Status](https://img.shields.io/badge/System-Active-00ff88.svg?style=for-the-badge)](https://github.com/)

**NeuralSign** is a high-performance web application designed to bridge the gap between spoken language and visual sign communication. By integrating the **Web Speech API** for real-time linguistic parsing and **Three.js** for hardware-accelerated 3D rendering, the system achieves low-latency translation via an interactive digital avatar.

---

## 🏗️ Technical Architecture

The application operates on a triple-layer architecture to ensure seamless translation:

1.  **Linguistic Layer:** Utilizes `SpeechRecognition` to capture and tokenize audio streams into normalized text arrays.
2.  **Logic Controller:** A dynamic mapping engine that matches identified tokens to specific animation clips or falls back to procedural rotation if triggers are undefined.
3.  **Rendering Engine:** A `WebGLRenderer` environment with custom lighting (Ambient, Directional, Rim, and Fill) and a 60FPS animation mixer loop.

---

## 🚀 Key Features

* **Real-time Speech Tokenization:** Continuous voice-to-text processing with interim results display.
* **GLTF Animation Pipeline:** Advanced rigging support for `.glb` models using `AnimationMixer`.
* **Procedural Fallbacks:** Automated Euler rotation logic for the avatar if specific animation data is missing.
* **System Diagnostics:** A dedicated Debug Panel providing real-time state telemetry (Status, Active Clip, and Last Token).
* **Dynamic Theme Engine:** LocalStorage-persistent theme switching with custom CSS variables for neon-cyan and neon-purple glow effects.

---

## 📂 System Structure

```text
Project_SignLang/
├── index.html        # App Entry Point & UI Architecture
├── script.js         # Speech & Three.js Core Logic
├── style.css         # Futuristic Glassmorphism & Themes
├── avatar.glb        # 3D Asset Binary (Required)
└── vite.svg          # Branding Assets
