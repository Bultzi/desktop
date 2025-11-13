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
                        ${data.showHelp ? '<button class="window-btn btn-help" onclick="event.stopPropagation(); showCmdHelp()"></button>' : ''}
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

