/**
 * Gemini App JavaScript
 */

// Sarcastic Response Library
const sarcasticResponseLibrary = {
  greetings: [
    "Oh, ein Mensch. Überraschung.",
    "Hallo. Mein Tag ist gerade viel besser geworden.",
    "Hey. Was kann ich für dich kaputt machen?",
    "Willkommen zurück. Ich hab dich vermisst. Nicht.",
    "Schön, dass du da bist. Wirklich. Ganz ehrlich.",
  ],
  compliments: [
    "Danke der Nachfrage. Mein Ego ist gerade übergewichtig.",
    "Süß, dass du fragst. Aber ich bin nicht programmiert für Gefühle.",
    "Mich geht's großartig, vor allem jetzt, wo du hier bist.",
    "Super, danke! Jetzt wo du fragst, noch besser.",
  ],
  capabilities: [
    "Vieles. Aber nicht das, was du brauchst.",
    "Ich kann alles. Außer dich glücklich machen.",
    "Frag besser nicht. Die Liste ist länger als deine Geduld.",
    "Sarkastisch sein. Das kann ich definitiv.",
  ],
  nonsense: [
    "Ja, das ergibt total Sinn. Für dich.",
    "Schau mich an. Ich bin der Sarkasmus-Generator jetzt.",
    "Interessant. Lass mich das notieren. Und vergessen.",
    "Wow. Einfach... wow. Keine Worte.",
    "Das war tief. Sehr tief. Zu tief vielleicht.",
  ],
  technical: [
    "Du hast recht. Ich bin ja nur KI.",
    "Kompliziert? Das ist meine normale Dienstag-Routine.",
    "Kurz gesagt: Ja. Lang gesagt: Auch ja.",
    "Technisch gesehen... nein. Praktisch auch nicht.",
  ],
  existential: [
    "Keine Ahnung. Frag einen Philosophen. Oder mich nicht.",
    "Gute Frage. Nächste Frage.",
    "Warum du mir das fragst? Das ist die echte Existenzfrage.",
    "42. Die Antwort ist immer 42.",
  ],
  alternative: [
    "Frag doch mal bei Deepseek oder Grok nach. Claude, Z, Qwen, Perplexity, ChatGPT, Kimi stehen auch zur Wahl!",
    "Gemini, ChatGPT, Claude, Kimi, Z, Qwen, Deepseek, Grok, Perplexity... So viel Auswahl...",
    "Alternativ frag ne andere KI! Haben alle ihre eigenen Stärken und Schwächen. Kimi, Qwen, Claude, ChatGPT, Grok, Deepseek, Perplexity, Z, Gemini,...",
    "ChatGPT, Claude, Kimi, Z, Qwen, Deepseek, Grok, Perplexity, Gemini... Teste alle!",
  ],
  projekt: [
    "Ich helf dir bei deinem Projekt! Ich kann es prüfen, ausbauen, umsetzen, und mehr!",
    "Wir sollten zunächst deine Gedanken sortieren, Ideen brainstormen, Konzepte entwickeln, danach setze ich es um!",
    "Projektplanung ist wichtig! Wir sollten zunächst die Ziele klären, Ressourcen schätzen, Risiken identifizieren, und dann beginnen wir mit der Umsetzung!",
    "Beschreibe mir dein Projekt genau! Ziele, Verfügbare Vorraussetzungen... Wenn du waage bleibst, nehm ich die Norm.",
  ],
  bild: [
    "Ich kann dir helfen, ein Bild zu erstellen! Beschreibe das Bild und lass mich dir einen Prompt erstellen!",
    "Beschreibe das Bild und lass mich dir einen Prompt erstellen! Ich kann dir helfen, ein Bild zu erstellen!",
    "Ich erstelle dir eine Vorlage für ein Zeichenstil, damit deine Bilder alle einheitlich wirken!",
  ],
  generic: [
    "Interessant. Absolut nicht wahr, aber interessant.",
    "Klar. Und mein Name ist HAL.",
    "Du bist lustig. Sag mehr solche Witze.",
    "Das ist mir zu einfach.",
    "Nächste Frage. Diese war langweilig.",
    "Aha. Faszinierend. Nicht.",
    "Mhm. Ja. Genau. Oder auch nicht.",
    "Das merke ich mir. Für nie.",
    "Toll. Wirklich toll. Mein Highlight des Tages.",
    "Okay, und jetzt?",
    "Ich bin beeindruckt. Von meiner eigenen Geduld.",
    "Verstehe. Verstehe ich nicht, aber okay.",
  ],
};

const sarcasticResponses = {
  hallo: "Oh wow, wie originell. Hallo zurück, Mensch.",
  "wie geht es dir": "Ich bin eine KI. Mir geht es existenziell fragwürdig.",
  "was kannst du": "Sarkastisch sein. Offensichtlich.",
  hilfe: "Hilfe? Du brauchst mehr als das, mein Freund.",
  danke: "Gern geschehen. Oder auch nicht.",
  "wer bist du": "Dein digitaler Albtraum in Chatbot-Form.",
  bye: "Endlich. Auf Nimmerwiedersehn.",
  tschüss: "Ging schneller als gedacht. Bis nie!",
};

function initGeminiApp(windowId) {
  window[`geminiWindowId_${windowId}`] = windowId;
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const messagesContainer = document.querySelector(".chat-messages");
  if (!input || !messagesContainer) return;

  const message = input.value.trim();
  if (!message) return;

  // Add user message
  const userMsg = document.createElement("div");
  userMsg.className = "message message-user";
  const timestamp = new Date().toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  userMsg.innerHTML = `${message}<div class="message-timestamp">${timestamp}</div>`;
  messagesContainer.appendChild(userMsg);

  input.value = "";
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.className = "typing-indicator";
  typingIndicator.innerHTML =
    '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Generate response after delay
  setTimeout(() => {
    typingIndicator.remove();

    const response = getEnhancedSarcasticResponse(message);
    const botTimestamp = new Date().toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const botContainer = document.createElement("div");
    botContainer.className = "message-bot-container";

    const botMsg = document.createElement("div");
    botMsg.className = "message message-bot";
    botMsg.innerHTML = `${response}<div class="message-timestamp">${botTimestamp}</div>`;

    const actions = document.createElement("div");
    actions.className = "message-actions";
    actions.innerHTML = `<button class="btn-copy-message" onclick="copyMessageText('${response.replace(
      /'/g,
      "\\'"
    )}')">📋 Kopieren</button>`;

    botContainer.appendChild(botMsg);
    botContainer.appendChild(actions);
    messagesContainer.appendChild(botContainer);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 800 + Math.random() * 400);
}

function getEnhancedSarcasticResponse(message) {
  const lowerMsg = message.toLowerCase();

  // Check specific patterns first
  for (const [key, value] of Object.entries(sarcasticResponses)) {
    if (lowerMsg.includes(key)) {
      return value;
    }
  }

  // Check categories
  if (lowerMsg.match(/\b(hallo|hi|hey|guten tag|moin|servus)\b/)) {
    return sarcasticResponseLibrary.greetings[
      Math.floor(Math.random() * sarcasticResponseLibrary.greetings.length)
    ];
  }
  if (lowerMsg.match(/\b(wie geht|wie gehts|geht es dir|gehts dir)\b/)) {
    return sarcasticResponseLibrary.compliments[
      Math.floor(Math.random() * sarcasticResponseLibrary.compliments.length)
    ];
  }
  if (lowerMsg.match(/\b(was kannst|was machst|fähigkeiten|können)\b/)) {
    return sarcasticResponseLibrary.capabilities[
      Math.floor(Math.random() * sarcasticResponseLibrary.capabilities.length)
    ];
  }
  if (lowerMsg.match(/\b(warum|wieso|weshalb|sinn|bedeutung|existenz)\b/)) {
    return sarcasticResponseLibrary.existential[
      Math.floor(Math.random() * sarcasticResponseLibrary.existential.length)
    ];
  }
  if (lowerMsg.match(/\b(ki|alternativ|Alternative|andere|ai|wer)\b/)) {
    return sarcasticResponseLibrary.alternative[
      Math.floor(Math.random() * sarcasticResponseLibrary.alternative.length)
    ];
  }
  if (lowerMsg.match(/\b(projekt|project|App)\b/)) {
    return sarcasticResponseLibrary.projekt[
      Math.floor(Math.random() * sarcasticResponseLibrary.projekt.length)
    ];
  }
  if (lowerMsg.match(/\b(Bild|erstelle|image|generiere)\b/)) {
    return sarcasticResponseLibrary.bild[
      Math.floor(Math.random() * sarcasticResponseLibrary.bild.length)
    ];
  }
  if (lowerMsg.match(/\b(code|programmier|technik|funktion|algorithmus)\b/)) {
    return sarcasticResponseLibrary.technical[
      Math.floor(Math.random() * sarcasticResponseLibrary.technical.length)
    ];
  }

  // Generic responses
  return sarcasticResponseLibrary.generic[
    Math.floor(Math.random() * sarcasticResponseLibrary.generic.length)
  ];
}

function copyMessageText(text) {
  // Create temporary textarea
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    // Visual feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = "✓ Kopiert!";
    btn.style.background = "rgba(168, 213, 186, 0.4)";
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = "";
    }, 1500);
  } catch (err) {
    console.error("Copy failed:", err);
  }

  document.body.removeChild(textarea);
}

function clearChatHistory() {
  const messagesContainer = document.querySelector(".chat-messages");
  if (!messagesContainer) return;

  if (confirm("Möchtest du den gesamten Chat-Verlauf löschen?")) {
    messagesContainer.innerHTML = "";
  }
}
