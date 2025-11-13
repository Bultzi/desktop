/**
 * AI Studio Vibe-Coding App JavaScript
 */

let elementCount = 0;
const COLUMNS = 3;
const GRID_GAP = 20;
const ELEMENT_WIDTH = 150;
const ELEMENT_HEIGHT = 120;

// Komponenten-Definitionen
const COMPONENTS = {
  button: { icon: "🔘", label: "Button", color: "#2196f3" },
  input: { icon: "📝", label: "Input", color: "#4caf50" },
  panel: { icon: "📋", label: "Panel", color: "#ff9800" },
  card: { icon: "🎴", label: "Card", color: "#9c27b0" },
  table: { icon: "🔢", label: "Table", color: "#607d8b" },
  chart: { icon: "📊", label: "Chart", color: "#e91e63" },
  map: { icon: "🗺️", label: "Map", color: "#795548" },
  calendar: { icon: "📅", label: "Calendar", color: "#607d8b" },
  image: { icon: "🖼️", label: "Image", color: "#4cae50" },
  video: { icon: "📹", label: "Video", color: "#e91e63" },
  audio: { icon: "🎵", label: "Audio", color: "#795548" },
  file: { icon: "📄", label: "File", color: "#697998" },
  link: { icon: "🔗", label: "Link", color: "#9c27b0" },
  email: { icon: "📧", label: "Email", color: "#e99999" },
  phone: { icon: "📱", label: "Phone", color: "#3bfdf9" },
  login: { icon: "🔒", label: "Login", color: "#21aef3" },
  blogpost: { icon: "📝", label: "Blog Post", color: "#f2f8f9" },
  newsletter: { icon: "📧", label: "Newsletter", color: "#667d8b" },
  contact: { icon: "📞", label: "Contact", color: "#ae88b0" },
  about: { icon: "👤", label: "About", color: "#333333" },
  privacy: { icon: "🔒", label: "Privacy", color: "#121212" },
  terms: { icon: "🔒", label: "Terms", color: "#9c33b0" },
  faq: { icon: "❓", label: "FAQ", color: "#effe63" },
  search: { icon: "🔍", label: "Search", color: "#888888" },
  settings: { icon: "⚙️", label: "Settings", color: "#99ae99" },
  user: { icon: "👤", label: "User", color: "#99ff99" },
  ki: { icon: "🤖", label: "KI", color: "#ea8e09" },
};

/**
 * Erkennt Komponenten-Keywords im Text (case-insensitive)
 */
function detectComponent(text) {
  const lowerText = text.toLowerCase();
  for (const [key, component] of Object.entries(COMPONENTS)) {
    if (lowerText.includes(key)) {
      return component;
    }
  }
  return null;
}

/**
 * Berechnet die Position für ein neues Element im Grid
 */
function calculatePosition(index) {
  const row = Math.floor(index / COLUMNS);
  const col = index % COLUMNS;
  const x = col * (ELEMENT_WIDTH + GRID_GAP) + GRID_GAP;
  const y = row * (ELEMENT_HEIGHT + GRID_GAP) + GRID_GAP;
  return { x, y };
}

/**
 * Erstellt ein neues App-Element mit Animation
 */
function createAppElement(component) {
  const canvas = document.getElementById("app-canvas");
  if (!canvas) return;

  const position = calculatePosition(elementCount);
  elementCount++;

  const element = document.createElement("div");
  element.className = "app-element";
  element.id = `app-element-${elementCount}`;
  element.style.left = position.x + "px";
  element.style.top = position.y + "px";
  element.style.borderColor = component.color;

  element.innerHTML = `
        <div class="element-label">${component.label}</div>
        <div class="element-icon">${component.icon}</div>
    `;

  // Füge Element hinzu - CSS-Animation wird automatisch ausgelöst
  canvas.appendChild(element);
}

/**
 * Ordnet alle Elemente zufällig neu an mit Animation
 */
function shuffleElements() {
  const canvas = document.getElementById("app-canvas");
  if (!canvas) return;

  const elements = Array.from(canvas.querySelectorAll(".app-element"));
  if (elements.length === 0) return;

  // Erstelle Array mit verfügbaren Positionen
  const positions = [];
  for (let i = 0; i < elements.length; i++) {
    positions.push(calculatePosition(i));
  }

  // Mische die Positionen zufällig
  const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);

  // Füge Animation-Klasse hinzu und bewege Elemente
  elements.forEach((element, index) => {
    const newPos = shuffledPositions[index];

    // Aktiviere Transition für Animation
    element.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    element.style.transform = "scale(0.9) rotate(5deg)";

    // Kurze Verzögerung für gestaffelte Animation
    setTimeout(() => {
      element.style.left = newPos.x + "px";
      element.style.top = newPos.y + "px";
      element.style.transform = "scale(1) rotate(0deg)";
    }, index * 30);

    // Entferne Transition nach Animation
    setTimeout(() => {
      element.style.transition = "";
    }, 600 + index * 30);
  });
}

/**
 * Prüft ob der Text ein Shuffle-Keyword enthält
 */
function isShuffleCommand(text) {
  const lowerText = text.toLowerCase();
  const shuffleKeywords = [
    "zufall",
    "random",
    "layout",
    "ordnen",
    "anordnen",
    "shuffle",
    "design",
  ];
  return shuffleKeywords.some((keyword) => lowerText.includes(keyword));
}

/**
 * Verarbeitet den Chat-Input
 */
function processVibeInput(text) {
  if (!text || text.trim() === "") return;

  // Prüfe zuerst auf Shuffle-Command
  if (isShuffleCommand(text)) {
    shuffleElements();
    return;
  }

  // Ansonsten suche nach Komponenten
  const component = detectComponent(text);
  if (component) {
    createAppElement(component);
  }
}

/**
 * Initialisiert die Vibe-Coding App
 */
function initVibeCoding() {
  // Warte kurz, damit das DOM vollständig geladen ist
  setTimeout(function () {
    const vibeInput = document.getElementById("vibe-input");

    if (vibeInput) {
      // Enter-Taste Handler
      vibeInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          const text = this.value.trim();
          if (text) {
            processVibeInput(text);
            this.value = ""; // Input leeren
          }
        }
      });

      // Focus auf Input setzen
      vibeInput.focus();
    } else {
      console.error("Vibe-Input nicht gefunden");
    }
  }, 50);
}

// Initialisierung - funktioniert sowohl bei DOMContentLoaded als auch bei dynamischem Laden
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVibeCoding);
} else {
  // DOM ist bereits geladen
  initVibeCoding();
}
