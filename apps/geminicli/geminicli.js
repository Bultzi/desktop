/**
 * Gemini CLI App JavaScript
 * Simuliert die globale Installation und den Aufruf von Gemini-CLI
 */

// Installationsstatus pro Fenster
const installationState = {};

function getTerminal(windowId) {
  const windowElement = document.getElementById(windowId);
  if (!windowElement) return null;

  const contentElement = windowElement.querySelector(".window-content");
  if (!contentElement) return null;

  return contentElement.querySelector("#geminicli-terminal");
}

function addTerminalLine(
  terminal,
  text,
  className = "terminal-line",
  delay = 0
) {
  setTimeout(() => {
    const line = document.createElement("div");
    line.className = className;
    line.innerHTML = text;
    const inputLine = terminal.querySelector(".terminal-input-line");
    if (inputLine) {
      terminal.insertBefore(line, inputLine);
    }
    terminal.scrollTop = terminal.scrollHeight;
  }, delay);
}

function initGeminiCLIApp(windowId) {
  // Initialisiere Installationsstatus für dieses Fenster
  if (!installationState[windowId]) {
    installationState[windowId] = {
      nodeInstalled: false,
      geminiInstalled: false,
      initialized: false,
    };
  }

  setTimeout(() => {
    const terminal = getTerminal(windowId);
    if (!terminal) {
      console.error("Terminal not found for window:", windowId);
      return;
    }

    // Füge Event-Listener für Eingabe hinzu
    const input = terminal.querySelector("#geminicli-input");
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          const command = this.value.trim();
          if (command) {
            executeCommand(command, windowId);
            this.value = "";
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          // History-Funktion könnte hier implementiert werden
        }
      });

      // Fokussiere Input-Feld
      setTimeout(() => input.focus(), 50);

      // Fokussiere beim Klick auf Terminal
      terminal.addEventListener("click", function () {
        input.focus();
      });
    }

    // Zeige Willkommensnachricht
    if (!installationState[windowId].initialized) {
      addTerminalLine(
        terminal,
        '<span style="color: #00ff00;">Willkommen im Gemini CLI Terminal</span>',
        "terminal-line",
        100
      );
      addTerminalLine(
        terminal,
        'Tippe einen Befehl ein (z.B. "node --version" oder "npm install -g gemini-cli")',
        "terminal-line",
        300
      );
      addTerminalLine(terminal, "", "terminal-line", 500);
      installationState[windowId].initialized = true;
    }
  }, 150);
}

function executeCommand(command, windowId) {
  const terminal = getTerminal(windowId);
  if (!terminal) return;

  // Stelle sicher, dass State initialisiert ist
  if (!installationState[windowId]) {
    installationState[windowId] = {
      nodeInstalled: false,
      geminiInstalled: false,
      initialized: false,
    };
  }

  const state = installationState[windowId];

  // Zeige eingegebenen Befehl
  addTerminalLine(
    terminal,
    `<span class="terminal-prompt">$</span> ${command}`,
    "terminal-line",
    0
  );

  // Parse Befehl
  const parts = command.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  // Node.js Befehle
  if (cmd === "node") {
    handleNodeCommand(args, terminal, windowId);
    return;
  }

  // npm Befehle
  if (cmd === "npm") {
    handleNpmCommand(args, terminal, windowId);
    return;
  }

  // gemini Befehle (nach Installation)
  if (cmd === "gemini") {
    handleGeminiCommand(args, terminal, windowId);
    return;
  }

  // Andere Befehle
  if (cmd === "clear" || cmd === "cls") {
    setTimeout(() => {
      const lines = terminal.querySelectorAll(".terminal-line");
      lines.forEach((line) => {
        if (!line.querySelector(".terminal-input-line")) line.remove();
      });
    }, 100);
    return;
  }

  if (cmd === "help") {
    addTerminalLine(terminal, getHelpText(state), "terminal-line", 200);
    return;
  }

  // Unbekannter Befehl
  addTerminalLine(
    terminal,
    `<span style="color: #ff4444;">Befehl nicht gefunden: ${cmd}</span>`,
    "terminal-line",
    200
  );
  addTerminalLine(
    terminal,
    "Verfügbare Befehle: node, npm, gemini, help, clear",
    "terminal-line",
    400
  );
}

function handleNodeCommand(args, terminal, windowId) {
  const state = installationState[windowId];

  if (args.length === 0) {
    addTerminalLine(
      terminal,
      "Verwendung: node [Optionen] [Skript]",
      "terminal-line",
      200
    );
    return;
  }

  if (args[0] === "--version" || args[0] === "-v") {
    if (!state.nodeInstalled) {
      addTerminalLine(
        terminal,
        '<span style="color: #ffaa00;">Node.js wird installiert...</span>',
        "terminal-line",
        200
      );

      // Simuliere Node.js Installation
      const steps = [
        { delay: 500, text: "📦 Lade Node.js Installer herunter..." },
        { delay: 1000, text: "⬇ Download abgeschlossen (25.3 MB)" },
        { delay: 1500, text: "⚙ Installiere Node.js v20.11.0..." },
        { delay: 2000, text: "✓ Node.js erfolgreich installiert" },
        { delay: 2500, text: '<span style="color: #00ff00;">v20.11.0</span>' },
      ];

      steps.forEach((step) => {
        addTerminalLine(terminal, step.text, "terminal-line", step.delay);
      });

      setTimeout(() => {
        state.nodeInstalled = true;
      }, 3000);
    } else {
      addTerminalLine(
        terminal,
        '<span style="color: #00ff00;">v20.11.0</span>',
        "terminal-line",
        200
      );
    }
  } else {
    addTerminalLine(
      terminal,
      `<span style="color: #ff4444;">Unbekannte Node.js Option: ${args[0]}</span>`,
      "terminal-line",
      200
    );
  }
}

function handleNpmCommand(args, terminal, windowId) {
  const state = installationState[windowId];

  if (args.length === 0) {
    addTerminalLine(
      terminal,
      "Verwendung: npm <command>",
      "terminal-line",
      200
    );
    addTerminalLine(
      terminal,
      "Verfügbare Befehle: install, uninstall, list, --version",
      "terminal-line",
      400
    );
    return;
  }

  if (args[0] === "--version" || args[0] === "-v") {
    if (!state.nodeInstalled) {
      addTerminalLine(
        terminal,
        '<span style="color: #ff4444;">Fehler: Node.js ist nicht installiert</span>',
        "terminal-line",
        200
      );
      addTerminalLine(
        terminal,
        "Bitte installiere zuerst Node.js mit: node --version",
        "terminal-line",
        400
      );
    } else {
      addTerminalLine(
        terminal,
        '<span style="color: #00ff00;">10.2.4</span>',
        "terminal-line",
        200
      );
    }
    return;
  }

  if (args[0] === "install") {
    if (!state.nodeInstalled) {
      addTerminalLine(
        terminal,
        '<span style="color: #ff4444;">Fehler: Node.js ist nicht installiert</span>',
        "terminal-line",
        200
      );
      addTerminalLine(
        terminal,
        "Bitte installiere zuerst Node.js mit: node --version",
        "terminal-line",
        400
      );
      return;
    }

    // Prüfe ob global installiert werden soll
    const isGlobal = args.includes("-g") || args.includes("--global");
    // Finde Paketname (alles was nicht mit - beginnt und nicht 'install' ist)
    const packageName = args.find(
      (arg) => !arg.startsWith("-") && arg !== "install"
    );

    if (!packageName) {
      addTerminalLine(
        terminal,
        '<span style="color: #ff4444;">Fehler: Kein Paketname angegeben</span>',
        "terminal-line",
        200
      );
      return;
    }

    if (packageName === "gemini-cli" && isGlobal) {
      if (state.geminiInstalled) {
        addTerminalLine(
          terminal,
          '<span style="color: #ffaa00;">gemini-cli ist bereits installiert</span>',
          "terminal-line",
          200
        );
        return;
      }

      // Simuliere Gemini-CLI Installation
      addTerminalLine(
        terminal,
        '<span style="color: #00aaff;">npm WARN deprecated</span> Einige Pakete verwenden veraltete APIs',
        "terminal-line",
        300
      );
      addTerminalLine(terminal, "", "terminal-line", 500);

      const steps = [
        { delay: 800, text: "📦 npm install -g gemini-cli" },
        { delay: 1000, text: "⬇ Lade Pakete herunter..." },
        { delay: 1200, text: "📥 gemini-cli@2.1.0" },
        { delay: 1400, text: "📦 + gemini-cli@2.1.0" },
        { delay: 1600, text: "📥 + @google/generative-ai@0.2.1" },
        { delay: 1800, text: "📥 + commander@11.1.0" },
        { delay: 2000, text: "📥 + dotenv@16.3.1" },
        { delay: 2200, text: "📥 + chalk@5.3.0" },
        { delay: 2400, text: "⚙ Verknüpfe Binärdateien..." },
        {
          delay: 2800,
          text: '<span style="color: #00ff00;">✓ Gemini-CLI wurde erfolgreich global installiert!</span>',
        },
        {
          delay: 3000,
          text: '<span style="color: #00aaff;">Verwendung: gemini [prompt] oder gemini --interactive</span>',
        },
      ];

      steps.forEach((step) => {
        addTerminalLine(terminal, step.text, "terminal-line", step.delay);
      });

      setTimeout(() => {
        state.geminiInstalled = true;
      }, 3200);
    } else {
      addTerminalLine(
        terminal,
        `📦 Installiere ${packageName}...`,
        "terminal-line",
        300
      );
      addTerminalLine(
        terminal,
        `<span style="color: #00ff00;">✓ ${packageName} installiert</span>`,
        "terminal-line",
        1000
      );
    }
    return;
  }

  addTerminalLine(
    terminal,
    `<span style="color: #ff4444;">Unbekannter npm Befehl: ${args[0]}</span>`,
    "terminal-line",
    200
  );
}

function handleGeminiCommand(args, terminal, windowId) {
  // Stelle sicher, dass State initialisiert ist
  if (!installationState[windowId]) {
    installationState[windowId] = {
      nodeInstalled: false,
      geminiInstalled: false,
      initialized: false,
    };
  }

  const state = installationState[windowId];

  if (!state.geminiInstalled) {
    addTerminalLine(
      terminal,
      '<span style="color: #ff4444;">Fehler: Gemini-CLI ist nicht installiert</span>',
      "terminal-line",
      200
    );
    addTerminalLine(
      terminal,
      "Installiere es mit: npm install -g gemini-cli",
      "terminal-line",
      400
    );
    return;
  }

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    addTerminalLine(
      terminal,
      '<span style="color: #00aaff;">Gemini CLI v2.1.0</span>',
      "terminal-line",
      200
    );
    addTerminalLine(terminal, "", "terminal-line", 400);
    addTerminalLine(terminal, "Verwendung:", "terminal-line", 600);
    addTerminalLine(
      terminal,
      "  gemini [prompt]           - Sende einen Prompt an Gemini",
      "terminal-line",
      800
    );
    addTerminalLine(
      terminal,
      "  gemini --interactive     - Starte interaktiven Modus",
      "terminal-line",
      1000
    );
    addTerminalLine(
      terminal,
      "  gemini --version         - Zeige Version",
      "terminal-line",
      1200
    );
    return;
  }

  if (args[0] === "--version" || args[0] === "-v") {
    addTerminalLine(
      terminal,
      '<span style="color: #00ff00;">gemini-cli v2.1.0</span>',
      "terminal-line",
      200
    );
    return;
  }

  if (args[0] === "--interactive" || args[0] === "-i") {
    addTerminalLine(
      terminal,
      '<span style="color: #00aaff;">Gemini Interactive Mode</span>',
      "terminal-line",
      300
    );
    addTerminalLine(
      terminal,
      'Tippe "exit" um zu beenden',
      "terminal-line",
      500
    );
    addTerminalLine(terminal, "", "terminal-line", 700);
    addTerminalLine(
      terminal,
      '<span style="color: #00ff00;">Gemini&gt;</span> Bereit für Eingaben...',
      "terminal-line",
      900
    );
    return;
  }

  // Normale Prompt-Verarbeitung
  const prompt = args.join(" ");
  addTerminalLine(
    terminal,
    '<span style="color: #00aaff;">[Gemini]</span> Verarbeite Anfrage...',
    "terminal-line",
    300
  );

  // Simuliere Antwort von Gemini
  setTimeout(() => {
    const response = generateGeminiResponse(prompt);
    addTerminalLine(
      terminal,
      `<span style="color: #00ff00;">[Gemini]</span> ${response}`,
      "terminal-line",
      1000
    );
  }, 1500);
}

function generateGeminiResponse(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  // Spezielle Antworten für häufige Prompts
  if (lowerPrompt.includes("hallo") || lowerPrompt.includes("hello")) {
    return "Hallo! Wie kann ich dir heute helfen?";
  }

  if (lowerPrompt.includes("was ist") || lowerPrompt.includes("was sind")) {
    return "Das ist eine interessante Frage. Könntest du etwas spezifischer sein?";
  }

  if (lowerPrompt.includes("hilf") || lowerPrompt.includes("help")) {
    return "Gerne helfe ich dir! Stelle mir einfach eine konkrete Frage.";
  }

  if (lowerPrompt.includes("test")) {
    return "Test erfolgreich! Gemini-CLI funktioniert einwandfrei. ✓";
  }

  // Standard-Antwort
  return `Ich habe deine Anfrage erhalten: "${prompt}". Dies ist eine simulierte Antwort. In der echten Gemini-CLI würde hier die Antwort von Googles Gemini-Modell stehen.`;
}

function getHelpText(state) {
  let help = '<span style="color: #00aaff;">Verfügbare Befehle:</span><br>';
  help += "<br>";
  help +=
    '<span style="color: #00ff00;">node --version</span> - Installiert Node.js (falls nicht vorhanden) oder zeigt Version<br>';
  help +=
    '<span style="color: #00ff00;">npm --version</span> - Zeigt npm Version<br>';
  help +=
    '<span style="color: #00ff00;">npm install -g gemini-cli</span> - Installiert Gemini-CLI global<br>';
  help +=
    '<span style="color: #00ff00;">gemini [prompt]</span> - Sendet einen Prompt an Gemini<br>';
  help +=
    '<span style="color: #00ff00;">gemini --interactive</span> - Startet interaktiven Modus<br>';
  help +=
    '<span style="color: #00ff00;">gemini --help</span> - Zeigt Hilfe<br>';
  help +=
    '<span style="color: #00ff00;">clear</span> - Löscht den Bildschirm<br>';
  help += "<br>";
  help += '<span style="color: #ffaa00;">Installationsstatus:</span><br>';
  help += `Node.js: ${
    state.nodeInstalled
      ? '<span style="color: #00ff00;">✓ Installiert</span>'
      : '<span style="color: #ff4444;">✗ Nicht installiert</span>'
  }<br>`;
  help += `Gemini-CLI: ${
    state.geminiInstalled
      ? '<span style="color: #00ff00;">✓ Installiert</span>'
      : '<span style="color: #ff4444;">✗ Nicht installiert</span>'
  }`;

  return help;
}
