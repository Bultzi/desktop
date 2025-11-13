/**
 * Teleprompter App JavaScript
 */

let teleprompterInterval = null;
let currentScrollPosition = 0;
let teleprompterText = '';
let isScrolling = false;
let scrollSpeed = 5;
let escKeyHandler = null;

function initTeleprompterApp(windowId) {
    // Warte kurz, damit das DOM vollständig geladen ist
    setTimeout(() => {
        // Speichere windowId für später
        window[`teleprompterWindowId_${windowId}`] = windowId;
        
        // Überwache das Fenster, um beim Schließen aufzuräumen
        const windowElement = document.getElementById(windowId);
        if (windowElement) {
            const observer = new MutationObserver((mutations) => {
                if (!document.getElementById(windowId)) {
                    // Fenster wurde entfernt, räume auf
                    destroyTeleprompterApp(windowId);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        
        const controls = document.getElementById('teleprompter-controls');
        const textInput = document.getElementById('teleprompter-text-input');
        const startBtn = document.getElementById('teleprompter-start-btn');
        const stopBtn = document.getElementById('teleprompter-stop-btn');
        const resetBtn = document.getElementById('teleprompter-reset-btn');
        const speedSlider = document.getElementById('teleprompter-speed');
        const speedValue = document.getElementById('teleprompter-speed-value');
        const display = document.getElementById('teleprompter-display');
        const showControlsBtn = document.getElementById('teleprompter-show-controls-btn');
        
        if (!controls || !textInput || !startBtn || !stopBtn || !resetBtn || !speedSlider || !display || !showControlsBtn) {
            console.warn('Teleprompter-Elemente nicht gefunden!');
            return;
        }
        
        // Geschwindigkeits-Slider
        speedSlider.addEventListener('input', (e) => {
            scrollSpeed = parseInt(e.target.value);
            speedValue.textContent = scrollSpeed;
            // Wenn gerade gescrollt wird, aktualisiere die Geschwindigkeit
            if (isScrolling) {
                stopScrolling();
                startScrolling();
            }
        });
        
        // Start-Button
        startBtn.addEventListener('click', () => {
            const text = textInput.value.trim();
            if (!text) {
                alert('Bitte geben Sie einen Text ein.');
                return;
            }
            teleprompterText = text;
            updateDisplay();
            startScrolling();
        });
        
        // Stop-Button
        stopBtn.addEventListener('click', () => {
            stopScrolling();
        });
        
        // Reset-Button
        resetBtn.addEventListener('click', () => {
            resetTeleprompter();
        });
        
        // Enter-Taste im Textfeld startet auch das Scrolling
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                startBtn.click();
            }
        });
        
        // ESC-Taste zeigt Controls wieder an
        escKeyHandler = (e) => {
            if (e.key === 'Escape' && isScrolling) {
                e.preventDefault();
                showControls();
                stopScrolling();
            }
        };
        document.addEventListener('keydown', escKeyHandler);
        
        // Button zum Anzeigen der Controls
        showControlsBtn.addEventListener('click', () => {
            showControls();
            stopScrolling();
        });
        
        // Initialisiere Display
        updateDisplay();
    }, 50);
}

function hideControls() {
    const controls = document.getElementById('teleprompter-controls');
    const showControlsBtn = document.getElementById('teleprompter-show-controls-btn');
    if (controls) controls.classList.add('teleprompter-controls-hidden');
    if (showControlsBtn) showControlsBtn.style.display = 'block';
}

function showControls() {
    const controls = document.getElementById('teleprompter-controls');
    const showControlsBtn = document.getElementById('teleprompter-show-controls-btn');
    if (controls) controls.classList.remove('teleprompter-controls-hidden');
    if (showControlsBtn) showControlsBtn.style.display = 'none';
}

function startScrolling() {
    if (isScrolling) return;
    
    const display = document.getElementById('teleprompter-display');
    if (!display) return;
    
    isScrolling = true;
    currentScrollPosition = 0;
    
    const startBtn = document.getElementById('teleprompter-start-btn');
    const stopBtn = document.getElementById('teleprompter-stop-btn');
    
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    
    // Verstecke Controls beim Start
    hideControls();
    
    // Berechne Scroll-Geschwindigkeit (höhere Zahl = schneller)
    // Geschwindigkeit 1-10 wird zu 10-100ms Intervall
    const intervalMs = 110 - (scrollSpeed * 10);
    
    teleprompterInterval = setInterval(() => {
        currentScrollPosition += 1;
        display.scrollTop = currentScrollPosition;
        
        // Wenn das Ende erreicht ist, starte von vorne (Endlosschleife)
        if (currentScrollPosition >= display.scrollHeight - display.clientHeight) {
            currentScrollPosition = 0;
            display.scrollTop = 0;
        }
    }, intervalMs);
}

function stopScrolling() {
    if (!isScrolling) return;
    
    isScrolling = false;
    
    if (teleprompterInterval) {
        clearInterval(teleprompterInterval);
        teleprompterInterval = null;
    }
    
    const startBtn = document.getElementById('teleprompter-start-btn');
    const stopBtn = document.getElementById('teleprompter-stop-btn');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    
    // Zeige Controls wieder an beim Stoppen
    showControls();
}

function resetTeleprompter() {
    stopScrolling();
    currentScrollPosition = 0;
    teleprompterText = '';
    
    const textInput = document.getElementById('teleprompter-text-input');
    const display = document.getElementById('teleprompter-display');
    
    if (textInput) textInput.value = '';
    if (display) {
        display.scrollTop = 0;
        updateDisplay();
    }
    
    // Zeige Controls wieder an beim Zurücksetzen
    showControls();
}

function updateDisplay() {
    const display = document.getElementById('teleprompter-display');
    if (!display) return;
    
    if (!teleprompterText || teleprompterText.trim() === '') {
        display.innerHTML = '<div class="teleprompter-text-placeholder">Geben Sie einen Text ein und klicken Sie auf "Start"</div>';
    } else {
        // Formatiere den Text für bessere Lesbarkeit
        const formattedText = teleprompterText
            .split('\n')
            .map(line => `<div class="teleprompter-line">${line || '&nbsp;'}</div>`)
            .join('');
        
        display.innerHTML = formattedText;
        display.scrollTop = 0;
    }
}

// Cleanup-Funktion für wenn die App geschlossen wird
function destroyTeleprompterApp(windowId) {
    stopScrolling();
    resetTeleprompter();
    
    // Entferne ESC-Event-Listener
    if (escKeyHandler) {
        document.removeEventListener('keydown', escKeyHandler);
        escKeyHandler = null;
    }
    
    // Entferne Event-Listener und Variablen
    const textInput = document.getElementById('teleprompter-text-input');
    const startBtn = document.getElementById('teleprompter-start-btn');
    const stopBtn = document.getElementById('teleprompter-stop-btn');
    const resetBtn = document.getElementById('teleprompter-reset-btn');
    const speedSlider = document.getElementById('teleprompter-speed');
    
    if (textInput) textInput.value = '';
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (speedSlider) speedSlider.value = 5;
    
    // Lösche windowId-Variable
    if (window[`teleprompterWindowId_${windowId}`]) {
        delete window[`teleprompterWindowId_${windowId}`];
    }
}

// Exportiere die Init-Funktion global
window.initTeleprompterApp = initTeleprompterApp;

