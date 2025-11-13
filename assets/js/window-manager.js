/**
 * Window Manager - Verwaltet Fenster
 */

// App öffnen
function openApp(appId) {
    if (!DesktopConfig || !DesktopConfig.apps[appId]) {
        console.error('App nicht gefunden:', appId);
        return;
    }
    
    const windowId = `window-${++windowCounter}`;
    const appConfig = DesktopConfig.apps[appId];
    
    // Lade App-Daten via AJAX
    loadAppWindow(windowId, appId, appConfig);
}

function loadAppWindow(windowId, appId, appConfig) {
    // Erstelle Fenster-Container
    const appWindow = document.createElement('div');
    // Setze spezielle Window-Klasse basierend auf App-ID
    appWindow.className = 'window';
    if (appId === 'gemini') {
        appWindow.className = 'window gemini-window';
    } else if (appId === 'notes') {
        appWindow.className = 'window notes-window';
    } else if (appId === 'whiteboard') {
        appWindow.className = 'window whiteboard-window';
    }
    appWindow.id = windowId;
    appWindow.style.zIndex = ++highestZIndex;
    
    // Zeige Ladeanzeige
    appWindow.innerHTML = `
        <div class="window-header" onmousedown="startDrag(event, '${windowId}')">
            <div class="window-title">Lädt...</div>
            <div class="window-controls">
                <button class="window-btn btn-minimize" onclick="event.stopPropagation()"></button>
                <button class="window-btn btn-maximize" onclick="event.stopPropagation()"></button>
                <button class="window-btn btn-close" onclick="closeWindow('${windowId}')"></button>
            </div>
        </div>
        <div class="window-content" id="content-${windowId}">
            <div style="padding: 40px; text-align: center; color: #999;">Lädt App...</div>
        </div>
    `;
    
    document.getElementById('desktop').appendChild(appWindow);
    centerWindow(appWindow);
    bringToFront(appWindow);
    
    // Lade App-Inhalt via PHP
    fetch(`api/app-data.php?app=${appId}&window=${windowId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('API Fehler:', data.error);
                appWindow.querySelector('.window-content').innerHTML = 
                    `<div style="padding: 20px; color: #c0152f;">Fehler: ${data.error}</div>`;
                return;
            }
            
            // Setze Window-Klasse erneut (falls sie geändert werden muss)
            if (appId === 'gemini') {
                appWindow.className = 'window gemini-window';
            } else if (appId === 'notes') {
                appWindow.className = 'window notes-window';
            } else if (appId === 'whiteboard') {
                appWindow.className = 'window whiteboard-window';
            } else if (appId === 'nanobanana') {
                appWindow.className = 'window nanobanana-window';
            } else if (appId === 'vscode') {
                appWindow.className = 'window vscode-window';
            } else if (appId === 'folder') {
                appWindow.className = 'window folder-window';
            }
            
            appWindow.innerHTML = `
                <div class="window-header" onmousedown="startDrag(event, '${windowId}')">
                    <div class="window-title">${data.title || appConfig.name}</div>
                    <div class="window-controls">
                        <button class="window-btn btn-minimize" onclick="event.stopPropagation()"></button>
                        <button class="window-btn btn-maximize" onclick="event.stopPropagation()"></button>
                        ${data.showHelp ? (appId === 'geminicli' ? '<button class="window-btn btn-help" onclick="event.stopPropagation(); showGeminiCLIHelp()"></button>' : '<button class="window-btn btn-help" onclick="event.stopPropagation(); showCmdHelp()"></button>') : ''}
                        <button class="window-btn btn-close" onclick="closeWindow('${windowId}')"></button>
                    </div>
                </div>
                <div class="window-content" id="content-${windowId}" style="padding: ${appId === 'gemini' || appId === 'notes' || appId === 'whiteboard' ? '0' : '20px'};">
                    ${data.html || '<div style="padding: 20px;">Kein Inhalt verfügbar</div>'}
                </div>
            `;
            
            // Füge CSS hinzu (nur einmal pro App)
            if (data.css && !document.getElementById(`app-css-${appId}`)) {
                const style = document.createElement('style');
                style.id = `app-css-${appId}`;
                style.textContent = data.css;
                document.head.appendChild(style);
            }
            
            // Füge JavaScript hinzu (nur einmal pro App)
            if (data.js && !document.getElementById(`app-js-${appId}`)) {
                const script = document.createElement('script');
                script.id = `app-js-${appId}`;
                script.textContent = data.js;
                document.body.appendChild(script);
            }
            
            // Initialisiere App nach kurzer Verzögerung, damit JS geladen ist
            setTimeout(() => {
                if (data.init && typeof window[data.init] === 'function') {
                    window[data.init](windowId);
                } else {
                    console.warn('Init-Funktion nicht gefunden für App:', appId, '->', data.init);
                }
            }, 100);
        })
        .catch(error => {
            console.error('Fehler beim Laden der App:', error);
            appWindow.querySelector('.window-content').innerHTML = 
                `<div style="padding: 20px; color: #c0152f;">Fehler beim Laden: ${error.message}</div>`;
        });
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.remove();
    }
}

function centerWindow(window) {
    const desktop = document.getElementById('desktop');
    const desktopRect = desktop.getBoundingClientRect();
    const windowRect = window.getBoundingClientRect();
    
    const left = (desktopRect.width - windowRect.width) / 2 + (Math.random() * 100 - 50);
    const top = (desktopRect.height - windowRect.height) / 2 + (Math.random() * 50 - 25);
    
    window.style.left = left + 'px';
    window.style.top = top + 'px';
}

function bringToFront(window) {
    window.style.zIndex = ++highestZIndex;
}

function showCmdHelp() {
    alert('CMD Hilfe:\n\nhelp - Zeigt verfügbare Befehle\n\ndir - Zeigt Verzeichnisinhalt\n\ncls - Löscht Bildschirm\n\necho [text] - Gibt Text aus');
}

function showGeminiCLIHelp() {
    // Erstelle Popup-Overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    };
    
    // Erstelle Popup-Box
    const popup = document.createElement('div');
    popup.style.cssText = 'background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 24px; max-width: 600px; max-height: 80vh; overflow-y: auto; color: #c9d1d9; font-family: "Consolas", "Monaco", monospace; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);';
    
    popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #30363d; padding-bottom: 12px;">
            <h2 style="margin: 0; color: #58a6ff; font-size: 20px;">Gemini CLI - Befehlsübersicht</h2>
            <button onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="background: transparent; border: none; color: #c9d1d9; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
        </div>
        <div style="line-height: 1.8;">
            <h3 style="color: #58a6ff; margin-top: 0; margin-bottom: 12px;">Installation:</h3>
            <div style="margin-left: 16px; margin-bottom: 16px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">node --version</code>
                <span style="margin-left: 8px; color: #8b949e;">Installiert Node.js (falls nicht vorhanden)</span>
            </div>
            <div style="margin-left: 16px; margin-bottom: 16px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">npm --version</code>
                <span style="margin-left: 8px; color: #8b949e;">Zeigt npm Version</span>
            </div>
            <div style="margin-left: 16px; margin-bottom: 20px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">npm install -g gemini-cli</code>
                <span style="margin-left: 8px; color: #8b949e;">Installiert Gemini-CLI global</span>
            </div>
            
            <h3 style="color: #58a6ff; margin-top: 20px; margin-bottom: 12px;">Gemini-CLI Befehle:</h3>
            <div style="margin-left: 16px; margin-bottom: 16px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">gemini [prompt]</code>
                <span style="margin-left: 8px; color: #8b949e;">Sendet einen Prompt an Gemini</span>
            </div>
            <div style="margin-left: 16px; margin-bottom: 16px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">gemini --interactive</code>
                <span style="margin-left: 8px; color: #8b949e;">Startet interaktiven Modus</span>
            </div>
            <div style="margin-left: 16px; margin-bottom: 16px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">gemini --version</code>
                <span style="margin-left: 8px; color: #8b949e;">Zeigt Version</span>
            </div>
            <div style="margin-left: 16px; margin-bottom: 20px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">gemini --help</code>
                <span style="margin-left: 8px; color: #8b949e;">Zeigt Hilfe</span>
            </div>
            
            <h3 style="color: #58a6ff; margin-top: 20px; margin-bottom: 12px;">Weitere Befehle:</h3>
            <div style="margin-left: 16px; margin-bottom: 16px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">help</code>
                <span style="margin-left: 8px; color: #8b949e;">Zeigt diese Hilfe</span>
            </div>
            <div style="margin-left: 16px; margin-bottom: 16px;">
                <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">clear</code>
                <span style="margin-left: 8px; color: #8b949e;">Löscht den Bildschirm</span>
            </div>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #30363d; color: #8b949e; font-size: 13px;">
                <strong style="color: #c9d1d9;">Tipp:</strong> Starte mit <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">node --version</code> um Node.js zu installieren, dann <code style="color: #79c0ff; background: #161b22; padding: 2px 6px; border-radius: 3px;">npm install -g gemini-cli</code> um Gemini-CLI zu installieren.
            </div>
        </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // ESC-Taste zum Schließen
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

