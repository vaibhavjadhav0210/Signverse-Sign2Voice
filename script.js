// ============================================
// FUTURISTIC SIGN LANGUAGE TRANSLATOR
// Speech Recognition + 3D Avatar Animation
// ============================================

// Global Variables
let scene, camera, renderer, avatar, mixer, animations;
let isListening = false;
let recognition;
let recognizedWords = [];

// DOM Elements
const micButton = document.getElementById('micButton');
const textDisplay = document.getElementById('textDisplay');
const wordCount = document.getElementById('wordCount');
const debugStatus = document.getElementById('debugStatus');
const debugAnimation = document.getElementById('debugAnimation');
const debugWord = document.getElementById('debugWord');
const themeToggle = document.getElementById('themeToggle');

// ============================================
// THEME MANAGEMENT
// ============================================

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === 'light') {
    root.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  } else {
    root.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const isLight = root.classList.contains('light-mode');
  applyTheme(isLight ? 'dark' : 'light');
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
  initTheme();
  initThreeJS();
  initSpeechRecognition();
  setupEventListeners();
  updateDebug('Idle', 'None', '--');
}

// ============================================
// THREE.JS SETUP
// ============================================

function initThreeJS() {
  const canvas = document.getElementById('avatarCanvas');
  const container = canvas.parentElement;

  // Scene Setup
  scene = new THREE.Scene();
  scene.background = null; // Transparent background

  // Camera Setup
  camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.5, 3);
  camera.lookAt(0, 1, 0);

  // Renderer Setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xb026ff, 0.8);
  directionalLight.position.set(2, 4, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0x00ff88, 0.4);
  fillLight.position.set(-2, 2, -2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.6);
  rimLight.position.set(0, 2, -3);
  scene.add(rimLight);

  // Load 3D Model
  loadAvatar();

  // Handle Window Resize
  window.addEventListener('resize', onWindowResize);

  // Start Animation Loop
  animate();
}

function loadAvatar() {
  if (!THREE.GLTFLoader) {
    console.error('GLTFLoader not available');
    updateDebug('GLTFLoader Missing', 'Error', '--');
    createFallbackAvatar();
    return;
  }

  const loader = new THREE.GLTFLoader();

  loader.load(
    'avatar.glb',
    (gltf) => {
      avatar = gltf.scene;
      avatar.scale.set(1, 1, 1);
      avatar.position.set(0, 0, 0);

      // Enable shadows
      avatar.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;

          // Add neon glow to materials
          if (node.material) {
            node.material.emissive = new THREE.Color(0xb026ff);
            node.material.emissiveIntensity = 0.2;
          }
        }
      });

      scene.add(avatar);

      // Setup Animations
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(avatar);
        animations = {};

        gltf.animations.forEach((clip) => {
          animations[clip.name.toLowerCase()] = clip;
        });

        console.log('Available animations:', Object.keys(animations));
        updateDebug('Model Loaded', 'Ready', '--');
      } else {
        console.log('No animations found in model');
        updateDebug('Model Loaded (No Animations)', 'Ready', '--');
      }
    },
    (xhr) => {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(`Loading: ${Math.round(percentComplete)}%`);
      updateDebug(`Loading Model ${Math.round(percentComplete)}%`, 'None', '--');
    },
    (error) => {
      console.error('Error loading avatar:', error);
      updateDebug('Model Load Failed', 'Error', '--');

      // Create a fallback cube with neon effect
      createFallbackAvatar();
    }
  );
}

function createFallbackAvatar() {
  const geometry = new THREE.BoxGeometry(1, 2, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xb026ff,
    emissive: 0xb026ff,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2
  });

  avatar = new THREE.Mesh(geometry, material);
  avatar.position.set(0, 1, 0);
  avatar.castShadow = true;
  scene.add(avatar);

  console.log('Fallback avatar created');
}

function playAnimation(animationName) {
  if (!mixer || !animations) {
    console.log('Animation system not ready');
    return;
  }

  const clip = animations[animationName.toLowerCase()];

  if (clip) {
    mixer.stopAllAction();
    const action = mixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.play();

    console.log(`Playing animation: ${animationName}`);
    updateDebug('Animation Playing', animationName, '--');

    // Reset after animation completes
    setTimeout(() => {
      updateDebug('Listening...', 'None', '--');
    }, clip.duration * 1000);
  } else {
    console.log(`Animation "${animationName}" not found`);
    // Fallback: rotate the avatar
    rotateFallback();
  }
}

function rotateFallback() {
  if (!avatar) return;

  const startRotation = avatar.rotation.y;
  const endRotation = startRotation + Math.PI * 2;
  const duration = 1000;
  const startTime = Date.now();

  function rotate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    avatar.rotation.y = startRotation + (endRotation - startRotation) * progress;

    if (progress < 1) {
      requestAnimationFrame(rotate);
    }
  }

  rotate();
  updateDebug('Animation Playing', 'Fallback Rotation', '--');
}

function animate() {
  requestAnimationFrame(animate);

  // Update animation mixer
  if (mixer) {
    mixer.update(0.016); // ~60fps
  }

  // Gentle idle rotation for avatar
  if (avatar && !mixer) {
    avatar.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  const canvas = document.getElementById('avatarCanvas');
  const container = canvas.parentElement;

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// ============================================
// SPEECH RECOGNITION SETUP
// ============================================

function initSpeechRecognition() {
  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error('Speech Recognition not supported');
    updateDebug('Speech API Not Supported', 'Error', '--');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    console.log('Speech recognition started');
    isListening = true;
    micButton.classList.add('active');
    updateDebug('Listening...', 'None', '--');
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      processRecognizedText(finalTranscript.trim());
    }

    // Update display with interim results
    if (interimTranscript) {
      updateTextDisplay(recognizedWords.join(' ') + ' ' + interimTranscript);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    updateDebug(`Error: ${event.error}`, 'None', '--');
  };

  recognition.onend = () => {
    console.log('Speech recognition ended');
    isListening = false;
    micButton.classList.remove('active');

    if (micButton.dataset.shouldRestart === 'true') {
      recognition.start();
    } else {
      updateDebug('Stopped', 'None', '--');
    }
  };
}

function processRecognizedText(text) {
  const words = text.toLowerCase().split(' ').filter(word => word.length > 0);

  words.forEach(word => {
    recognizedWords.push(word);

    // Trigger animation based on word
    triggerAnimationForWord(word);

    // Update debug panel
    updateDebug('Word Detected', 'Processing', word);
  });

  updateTextDisplay(recognizedWords.join(' '));
  wordCount.textContent = recognizedWords.length;
}

function triggerAnimationForWord(word) {
  // Map common words to potential animations
  const wordAnimationMap = {
    'hello': 'wave',
    'hi': 'wave',
    'goodbye': 'wave',
    'bye': 'wave',
    'yes': 'nod',
    'no': 'shake',
    'thank': 'thank',
    'thanks': 'thank',
    'please': 'please',
    'sorry': 'sorry',
    'help': 'help',
    'stop': 'stop',
    'go': 'walk',
    'walk': 'walk',
    'run': 'run',
    'sit': 'sit',
    'stand': 'stand',
    'dance': 'dance',
    'jump': 'jump'
  };

  const animationName = wordAnimationMap[word] || word;

  console.log(`Word "${word}" triggered animation "${animationName}"`);
  playAnimation(animationName);
}

function updateTextDisplay(text) {
  textDisplay.innerHTML = `<p class="recognized-text">${text}</p>`;

  // Auto-scroll to bottom
  textDisplay.scrollTop = textDisplay.scrollHeight;
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  micButton.addEventListener('click', toggleListening);
  themeToggle.addEventListener('click', toggleTheme);
}

function toggleListening() {
  if (!recognition) {
    alert('Speech Recognition is not supported in your browser. Please use Chrome or Edge.');
    return;
  }

  if (isListening) {
    recognition.stop();
    micButton.dataset.shouldRestart = 'false';
    micButton.querySelector('.button-text').textContent = 'ACTIVATE VOICE';
  } else {
    recognizedWords = [];
    textDisplay.innerHTML = '<p class="placeholder-text">Listening...</p>';
    wordCount.textContent = '0';

    try {
      recognition.start();
      micButton.dataset.shouldRestart = 'true';
      micButton.querySelector('.button-text').textContent = 'DEACTIVATE VOICE';
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  }
}

// ============================================
// DEBUG PANEL UPDATE
// ============================================

function updateDebug(status, animation, word) {
  debugStatus.textContent = status;
  debugAnimation.textContent = animation;
  debugWord.textContent = word;

  // Add glow effect on update
  debugStatus.style.textShadow = '0 0 10px var(--neon-cyan)';
  setTimeout(() => {
    debugStatus.style.textShadow = '0 0 5px var(--neon-cyan)';
  }, 200);
}

// ============================================
// START APPLICATION
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
