/**
 * Gemini CLI App JavaScript
 */

// Verfügbare Apps
const AVAILABLE_APPS = {
    'gemini': { name: 'Gemini', icon: '💎' },
    'notes': { name: 'Notizen', icon: '📝' },
    'vscode': { name: 'Visual Studio Code', icon: '💻' },
    'cmd': { name: 'Eingabeaufforderung', icon: '⌘' },
    'whiteboard': { name: 'Whiteboard', icon: '✏️' },
    'aistudio': { name: 'AI Studio', icon: '🏛️' },
    'notebooklm': { name: 'NotebookLM', icon: '📓' },
    'nanobanana': { name: 'NanoBanana', icon: '🍌' },
    'folder': { name: 'KI-Helfer Ordner', icon: '📁' }
};

// Installationsstatus (simuliert) - pro Fenster
const installedAppsMap = {};

function getTerminal(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return null;
    
    const contentElement = windowElement.querySelector('.window-content');
    if (!contentElement) return null;
    
    return contentElement.querySelector('.terminal') || contentElement.querySelector('#geminicli-terminal');
}

function initGeminiCLIApp(windowId) {
    // Initialisiere installierte Apps für dieses Fenster
    if (!installedAppsMap[windowId]) {
        installedAppsMap[windowId] = {
            'geminicli': { name: 'Gemini CLI', status: 'installed', version: '1.0.0' }
        };
    }
    
    setTimeout(() => {
        const terminal = getTerminal(windowId);
        if (!terminal) {
            console.error('Terminal not found for window:', windowId);
            return;
        }
        
        // Füge Event-Listener für Eingabe hinzu
        const input = terminal.querySelector('.terminal-input') || terminal.querySelector('#geminicli-input');
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const command = this.value.trim();
                    if (command) {
                        executeGeminiCommand(command, windowId);
                        this.value = '';
                    }
                }
            });
            
            // Fokussiere Input-Feld
            setTimeout(() => input.focus(), 50);
            
            // Fokussiere beim Klick auf Terminal
            terminal.addEventListener('click', function() {
                input.focus();
            });
        }
    }, 150);
}

function executeGeminiCommand(command, windowId) {
    const terminal = getTerminal(windowId);
    if (!terminal) {
        console.error('Terminal not found for window:', windowId);
        return;
    }
    
    // Zeige eingegebenen Befehl
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="terminal-prompt">gemini&gt;</span> ${command}`;
    const inputLine = terminal.querySelector('.terminal-input-line');
    if (inputLine) {
        terminal.insertBefore(commandLine, inputLine);
    }
    
    // Verarbeite Befehl
    const cmdParts = command.trim().split(' ');
    const cmd = cmdParts[0].toLowerCase();
    const args = cmdParts.slice(1);
    
    // Spezielle Behandlung für install, start, uninstall
    if (cmd === 'install' && args.length > 0) {
        handleInstallCommand(args[0], terminal, windowId);
        return;
    }
    
    if (cmd === 'start' && args.length > 0) {
        handleStartCommand(args[0], terminal, windowId);
        return;
    }
    
    if (cmd === 'uninstall' && args.length > 0) {
        handleUninstallCommand(args[0], terminal, windowId);
        return;
    }
    
    // Normale Befehle
    const response = getGeminiCLIResponse(cmd, args, windowId);
    
    if (response !== null && response !== '') {
        setTimeout(() => {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            responseLine.innerHTML = response.replace(/\n/g, '<br>');
            const inputLine = terminal.querySelector('.terminal-input-line');
            if (inputLine) {
                terminal.insertBefore(responseLine, inputLine);
            }
            terminal.scrollTop = terminal.scrollHeight;
        }, 300);
    }
}

function handleInstallCommand(appName, terminal, windowId) {
    const appKey = appName.toLowerCase();
    const installedApps = installedAppsMap[windowId] || {};
    
    if (!AVAILABLE_APPS[appKey]) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        responseLine.style.color = '#ff4444';
        responseLine.innerHTML = `✗ Fehler: App "${appName}" nicht gefunden. Verwende 'apps' um verfügbare Apps anzuzeigen.`;
        const inputLine = terminal.querySelector('.terminal-input-line');
        if (inputLine) {
            terminal.insertBefore(responseLine, inputLine);
        }
        terminal.scrollTop = terminal.scrollHeight;
        return;
    }
    
    if (installedApps[appKey]) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        responseLine.style.color = '#ffaa00';
        responseLine.innerHTML = `⚠ Warnung: "${AVAILABLE_APPS[appKey].name}" ist bereits installiert.`;
        const inputLine = terminal.querySelector('.terminal-input-line');
        if (inputLine) {
            terminal.insertBefore(responseLine, inputLine);
        }
        terminal.scrollTop = terminal.scrollHeight;
        return;
    }
    
    // Simuliere Installationsprozess
    const steps = [
        { delay: 500, text: `📦 Starte Installation von "${AVAILABLE_APPS[appKey].name}"...` },
        { delay: 800, text: `⏳ Verbinde mit Repository...` },
        { delay: 1100, text: `⬇ Lade Pakete herunter...` },
        { delay: 1400, text: `📥 Installiere Abhängigkeiten...` },
        { delay: 1700, text: `⚙ Konfiguriere App...` },
        { delay: 2000, text: `✓ Installation abgeschlossen!` },
        { delay: 2300, text: `✓ "${AVAILABLE_APPS[appKey].name}" erfolgreich installiert.` }
    ];
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            if (step.text.includes('✓')) {
                responseLine.style.color = '#00ff00';
            }
            responseLine.innerHTML = step.text;
            const inputLine = terminal.querySelector('.terminal-input-line');
            if (inputLine) {
                terminal.insertBefore(responseLine, inputLine);
            }
            terminal.scrollTop = terminal.scrollHeight;
            
            // Am Ende: App als installiert markieren
            if (index === steps.length - 1) {
                if (!installedAppsMap[windowId]) {
                    installedAppsMap[windowId] = {};
                }
                installedAppsMap[windowId][appKey] = {
                    name: AVAILABLE_APPS[appKey].name,
                    status: 'installed',
                    version: '1.0.0'
                };
            }
        }, step.delay);
    });
}

function handleStartCommand(appName, terminal, windowId) {
    const appKey = appName.toLowerCase();
    const installedApps = installedAppsMap[windowId] || {};
    
    if (!AVAILABLE_APPS[appKey]) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        responseLine.style.color = '#ff4444';
        responseLine.innerHTML = `✗ Fehler: App "${appName}" nicht gefunden.`;
        const inputLine = terminal.querySelector('.terminal-input-line');
        if (inputLine) {
            terminal.insertBefore(responseLine, inputLine);
        }
        terminal.scrollTop = terminal.scrollHeight;
        return;
    }
    
    if (!installedApps[appKey]) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        responseLine.style.color = '#ff4444';
        responseLine.innerHTML = `✗ Fehler: "${AVAILABLE_APPS[appKey].name}" ist nicht installiert. Verwende 'install ${appName}' um die App zu installieren.`;
        const inputLine = terminal.querySelector('.terminal-input-line');
        if (inputLine) {
            terminal.insertBefore(responseLine, inputLine);
        }
        terminal.scrollTop = terminal.scrollHeight;
        return;
    }
    
    // Simuliere Startprozess
    const steps = [
        { delay: 500, text: `🚀 Starte "${AVAILABLE_APPS[appKey].name}"...` },
        { delay: 800, text: `⏳ Initialisiere Module...` },
        { delay: 1100, text: `📂 Lade Konfiguration...` },
        { delay: 1400, text: `✓ "${AVAILABLE_APPS[appKey].name}" wurde erfolgreich gestartet!` },
        { delay: 1700, text: `💡 Tipp: Die App sollte jetzt im Desktop verfügbar sein.` }
    ];
    
    steps.forEach((step) => {
        setTimeout(() => {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            if (step.text.includes('✓')) {
                responseLine.style.color = '#00ff00';
            }
            responseLine.innerHTML = step.text;
            const inputLine = terminal.querySelector('.terminal-input-line');
            if (inputLine) {
                terminal.insertBefore(responseLine, inputLine);
            }
            terminal.scrollTop = terminal.scrollHeight;
        }, step.delay);
    });
}

function handleUninstallCommand(appName, terminal, windowId) {
    const appKey = appName.toLowerCase();
    const installedApps = installedAppsMap[windowId] || {};
    
    if (!AVAILABLE_APPS[appKey]) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        responseLine.style.color = '#ff4444';
        responseLine.innerHTML = `✗ Fehler: App "${appName}" nicht gefunden.`;
        const inputLine = terminal.querySelector('.terminal-input-line');
        if (inputLine) {
            terminal.insertBefore(responseLine, inputLine);
        }
        terminal.scrollTop = terminal.scrollHeight;
        return;
    }
    
    if (!installedApps[appKey]) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        responseLine.style.color = '#ffaa00';
        responseLine.innerHTML = `⚠ Warnung: "${AVAILABLE_APPS[appKey].name}" ist nicht installiert.`;
        const inputLine = terminal.querySelector('.terminal-input-line');
        if (inputLine) {
            terminal.insertBefore(responseLine, inputLine);
        }
        terminal.scrollTop = terminal.scrollHeight;
        return;
    }
    
    // Simuliere Deinstallationsprozess
    const steps = [
        { delay: 500, text: `🗑 Starte Deinstallation von "${AVAILABLE_APPS[appKey].name}"...` },
        { delay: 800, text: `⏳ Entferne Dateien...` },
        { delay: 1100, text: `🧹 Bereinige Konfiguration...` },
        { delay: 1400, text: `✓ Deinstallation abgeschlossen!` },
        { delay: 1700, text: `✓ "${AVAILABLE_APPS[appKey].name}" wurde erfolgreich entfernt.` }
    ];
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            if (step.text.includes('✓')) {
                responseLine.style.color = '#00ff00';
            }
            responseLine.innerHTML = step.text;
            const inputLine = terminal.querySelector('.terminal-input-line');
            if (inputLine) {
                terminal.insertBefore(responseLine, inputLine);
            }
            terminal.scrollTop = terminal.scrollHeight;
            
            // Am Ende: App als nicht installiert markieren
            if (index === steps.length - 1 && installedAppsMap[windowId]) {
                delete installedAppsMap[windowId][appKey];
            }
        }, step.delay);
    });
}

function getGeminiCLIResponse(command, args = [], windowId = null) {
    const installedApps = windowId ? (installedAppsMap[windowId] || {}) : {};
    
    const responses = {
        'help': `Verfügbare Befehle:
  help                    - Zeigt diese Hilfe
  apps                    - Listet alle verfügbaren Apps
  install [app-name]      - Installiert eine App
  start [app-name]        - Startet eine installierte App
  uninstall [app-name]    - Deinstalliert eine App
  status                  - Zeigt Installationsstatus
  clear                   - Löscht den Terminal-Bildschirm
  
Beispiele:
  install gemini          - Installiert die Gemini App
  start notes             - Startet die Notizen App
  uninstall vscode        - Deinstalliert Visual Studio Code`,

        'apps': (() => {
            let output = 'Verfügbare Apps:<br>';
            Object.keys(AVAILABLE_APPS).forEach(key => {
                const app = AVAILABLE_APPS[key];
                const installed = installedApps[key] ? ' [INSTALLIERT]' : '';
                output += `  ${app.icon} ${app.name} (${key})${installed}<br>`;
            });
            return output;
        })(),

        'status': (() => {
            const installed = Object.keys(installedApps);
            if (installed.length === 0) {
                return 'Keine Apps installiert. Verwende "install [app-name]" um Apps zu installieren.';
            }
            let output = 'Installierte Apps:<br>';
            installed.forEach(key => {
                const app = installedApps[key];
                output += `  ✓ ${app.name} (v${app.version})<br>`;
            });
            return output;
        })(),

        'clear': () => {
            setTimeout(() => {
                const terminal = getTerminal(windowId);
                if (terminal) {
                    const lines = terminal.querySelectorAll('.terminal-line');
                    lines.forEach(line => {
                        if (!line.querySelector('.terminal-input-line')) line.remove();
                    });
                }
            }, 100);
            return '';
        }
    };
    
    if (command === 'clear') {
        setTimeout(() => {
            const terminal = getTerminal(windowId);
            if (terminal) {
                const lines = terminal.querySelectorAll('.terminal-line');
                lines.forEach(line => {
                    if (!line.querySelector('.terminal-input-line')) line.remove();
                });
            }
        }, 100);
        return '';
    }
    
    return responses[command] || `Unbekannter Befehl: "${command}". Tippe 'help' für Hilfe.`;
}

