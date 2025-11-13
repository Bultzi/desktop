/**
 * Folder App JavaScript - KI-Tools Datenbank
 */

// Tool-Details mit Beschreibungen und URLs
const toolDetails = {
  ChatGPT: {
    desc: "Conversational AI assistant for tasks, writing, and analysis",
    url: "https://openai.com",
  },
  Perplexity: {
    desc: "AI search engine combining conversation with web results",
    url: "https://perplexity.ai",
  },
  "Z.ai": {
    desc: "Multimodal AI assistant with code and creative capabilities",
    url: "https://z.ai",
  },
  Grok: {
    desc: "Real-time AI with internet access for current information",
    url: "https://grok.com",
  },
  Deepseek: {
    desc: "Advanced reasoning AI model for complex problems",
    url: "https://deepseek.com",
  },
  Claude: {
    desc: "Conversational AI focused on thoughtful, nuanced responses",
    url: "https://claude.ai",
  },
  Qwen: {
    desc: "Multilingual AI model with broad capabilities",
    url: "https://chat.qwen.ai/",
  },
  Kling: {
    desc: "Text-to-video generator with realistic motion",
    url: "https://kling.ai",
  },
  Sora: {
    desc: "OpenAI's advanced text-to-video model",
    url: "https://openai.com/sora",
  },
  Veo: {
    desc: "High-quality video generation from text prompts",
    url: "https://deepmind.google/technologies/veo",
  },
  Pika: {
    desc: "AI video generation with character consistency",
    url: "https://pika.art",
  },
  Wan: { desc: "Fast, efficient video generation", url: "https://wan.ai" },
  "Adobe Firefly": {
    desc: "Adobe's generative AI for creative content",
    url: "https://firefly.adobe.com",
  },
  "LTX AI": {
    desc: "Long-form video generation with narrative control",
    url: "https://ltx.studio",
  },
  "Invideo AI": {
    desc: "AI-powered video creation platform",
    url: "https://invideo.io",
  },
  NanoBanana: {
    desc: "Local image generation tool",
    url: "https://aistudio.google.com/models/gemini-2-5-flash-image",
  },
  Midjourney: {
    desc: "Premium AI image generator with distinctive style",
    url: "https://midjourney.com",
  },
  Leonardo: {
    desc: "AI art platform with fine-tuning controls",
    url: "https://leonardo.ai",
  },
  Seedream: {
    desc: "AI image and videogeneration with fine-tuning controls",
    url: "https://dreamina.capcut.com/ai-tool/home",
  },
  Suno: {
    desc: "AI music generation from text descriptions",
    url: "https://suno.ai",
  },
  Minimax: {
    desc: "Efficient multimodal-chat & audio generation model",
    url: "https://www.minimax.io/",
  },
  Hailuo: {
    desc: "Efficient Video generation model",
    url: "https://hailuoai.video/",
  },
  StabilityAI: {
    desc: "Sound effects and audio generation",
    url: "https://stability.ai",
  },
  ElevenLabs: {
    desc: "Natural-sounding AI voice synthesis",
    url: "https://elevenlabs.io",
  },
  Gemini: {
    desc: "Google's multimodal AI with audio",
    url: "https://gemini.google.com",
  },
  Adobe: { desc: "Adobe audio, image & video tools", url: "https://adobe.com" },
  "Hugging Face": {
    desc: "Open-source ML model hub and community",
    url: "https://huggingface.co",
  },
  GitHub: {
    desc: "Code repository and collaboration platform",
    url: "https://github.com",
  },
  Canva: {
    desc: "Design tool with AI-powered features",
    url: "https://canva.com",
  },
  "Google Labs": {
    desc: "Experimental AI projects from Google",
    url: "https://labs.google",
  },
  "Abacus AI": {
    desc: "AI platform for building custom models",
    url: "https://abacus.ai",
  },
  Civitai: { desc: "Community for AI art models", url: "https://civitai.com" },
};

// Tools nach Kategorien
const folderTools = {
  chat: [
    { name: "ChatGPT", icon: "🤖", color: "#d4c4e8" },
    { name: "Perplexity", icon: "🟣", color: "#b8d4e8" },
    { name: "Z.ai", icon: "🔵", color: "#bbecfa" },
    { name: "Grok", icon: "🦄", color: "#e8b4d0" },
    { name: "Deepseek", icon: "🌊", color: "#b8d4e8" },
    { name: "Claude", icon: "🦙", color: "#a8d5ba" },
    { name: "Qwen", icon: "🦚", color: "#ffe084" },
    { name: "Minimax", icon: "📈", color: "#a8d5ba" },
  ],
  video: [
    { name: "Grok", icon: "🦄", color: "#e8b4d0" },
    { name: "Kling", icon: "🎞️", color: "#a8d5ba" },
    { name: "Sora", icon: "🎥", color: "#b8d4e8" },
    { name: "Veo", icon: "📼", color: "#ffe084" },
    { name: "Pika", icon: "🐰", color: "#f7c5e6" },
    { name: "Wan", icon: "⚡", color: "#b6e7e5" },
    { name: "Adobe Firefly", icon: "🔥", color: "#f8bdad" },
    { name: "LTX AI", icon: "🎬", color: "#d4c4e8" },
    { name: "Invideo AI", icon: "📹", color: "#b8d4e8" },
    { name: "Hailuo", icon: "🌊", color: "#faae81" },
    { name: "Seedream", icon: "🌟", color: "#bab919" },
  ],
  bild: [
    { name: "ChatGPT", icon: "🤖", color: "#d4c4e8" },
    { name: "NanoBanana", icon: "🍌", color: "#ffe084" },
    { name: "Midjourney", icon: "⛵", color: "#b8d4e8" },
    { name: "Leonardo", icon: "🎨", color: "#e8b4d0" },
    { name: "Qwen", icon: "🦚", color: "#ffe084" },
    { name: "Grok", icon: "🦄", color: "#e8b4d0" },
    { name: "Adobe Firefly", icon: "🔥", color: "#f8bdad" },
    { name: "Seedream", icon: "🌟", color: "#bab919" },
  ],
  audio: [
    { name: "Suno", icon: "☀️", color: "#ffe084" },
    { name: "Minimax", icon: "📈", color: "#a8d5ba" },
    { name: "StabilityAI", icon: "⚖️", color: "#b8d4e8" },
    { name: "ElevenLabs", icon: "🔊", color: "#d4c4e8" },
    { name: "Gemini", icon: "💎", color: "#e8b4d0" },
    { name: "Adobe", icon: "🅰️", color: "#f8bdad" },
  ],
  x: [
    { name: "Hugging Face", icon: "🤗", color: "#ffe084" },
    { name: "GitHub", icon: "🐙", color: "#b8d4e8" },
    { name: "Canva", icon: "🎨", color: "#a8d5ba" },
    { name: "Google Labs", icon: "🧪", color: "#d4c4e8" },
    { name: "Abacus AI", icon: "🧮", color: "#e8b4d0" },
    { name: "Civitai", icon: "🌸", color: "#f8bdad" },
  ],
};

function initFolderApp(windowId) {
  // Warte kurz, damit das DOM bereit ist
  setTimeout(() => {
    // Rendere alle Tool-Grids
    Object.keys(folderTools).forEach((category) => {
      renderToolsGrid(category);
    });

    // Aktiviere den ersten Tab (chat)
    switchFolderTab("chat");
  }, 100);
}

function renderToolsGrid(category) {
  const grid = document.getElementById(`folder-${category}`);
  if (!grid) return;

  grid.innerHTML = "";

  const tools = folderTools[category] || [];
  tools.forEach((tool) => {
    const toolBtn = document.createElement("div");
    toolBtn.className = "folder-tool-btn";
    toolBtn.style.background = `linear-gradient(135deg, ${tool.color} 0%, ${tool.color}dd 100%)`;
    toolBtn.onclick = () => openToolDetails(tool.name);
    toolBtn.onmouseenter = () => showToolPreview(tool.name, toolBtn);

    toolBtn.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-name">${tool.name}</div>
        `;

    grid.appendChild(toolBtn);
  });
}

function switchFolderTab(category) {
  // Aktualisiere Tabs
  document.querySelectorAll(".folder-tab").forEach((tab) => {
    tab.classList.remove("active");
    if (tab.dataset.tab === category) {
      tab.classList.add("active");
    }
  });

  // Aktualisiere Content
  document.querySelectorAll(".folder-tools-grid").forEach((grid) => {
    grid.classList.add("hidden");
    grid.classList.remove("active");
    if (grid.dataset.content === category) {
      grid.classList.remove("hidden");
      grid.classList.add("active");
    }
  });

  // Stelle sicher, dass die Tools für diese Kategorie gerendert sind
  const grid = document.getElementById(`folder-${category}`);
  if (grid && grid.children.length === 0) {
    renderToolsGrid(category);
  }
}

function openToolDetails(toolName) {
  const tool = toolDetails[toolName];
  if (!tool) {
    alert(`Keine Details für ${toolName} verfügbar.`);
    return;
  }

  const details = `
        <strong>${toolName}</strong>\n\n${tool.desc}\n\nURL: ${tool.url}\n\n(Möchtest du diese Seite öffnen?)`;

  if (confirm(details)) {
    window.open(tool.url, "_blank");
  }
}

function showToolPreview(toolName, element) {
  const tool = toolDetails[toolName];
  if (!tool) return;

  // Erstelle Tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "tool-tooltip";
  tooltip.innerHTML = `
        <div class="tooltip-title">${toolName}</div>
        <div class="tooltip-desc">${tool.desc}</div>
        <div class="tooltip-url">${tool.url}</div>
    `;

  // Positioniere Tooltip
  const rect = element.getBoundingClientRect();
  tooltip.style.position = "fixed";
  tooltip.style.left = rect.left + rect.width / 2 + "px";
  tooltip.style.top = rect.bottom + 10 + "px";
  tooltip.style.transform = "translateX(-50%)";

  document.body.appendChild(tooltip);

  // Entferne Tooltip beim Verlassen
  element.addEventListener(
    "mouseleave",
    function removeTooltip() {
      tooltip.remove();
      element.removeEventListener("mouseleave", removeTooltip);
    },
    { once: true }
  );
}
