/**
 * Desktop Core - Kernfunktionalität des Desktops
 */

// Globale Variablen
let windowCounter = 0;
let highestZIndex = 1000;
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    console.log('Desktop Core geladen');
    initializeDesktop();
    initializeBackgroundSlideshow();
});

function initializeDesktop() {
    // Desktop ist bereit
    console.log('Desktop initialisiert');
}

// Hintergrundbild-Slideshow (für Cream- und Dark-Theme)
let currentBackgroundIndex = 0;
let backgroundSlideshowInterval = null;

function initializeBackgroundSlideshow() {
    // Prüfe welches Theme aktiv ist
    if (!DesktopConfig || !DesktopConfig.theme) {
        return;
    }
    
    let backgrounds = [];
    let overlayClass = 'desktop-overlay';
    
    // Lade unterschiedliche Bilder je nach Theme
    if (DesktopConfig.theme === 'cream') {
        backgrounds = [
            'assets/images/bg.jpg',
            'assets/images/bg2.jpg',
            'assets/images/bg3.jpg'
        ];
        overlayClass = 'desktop-overlay desktop-overlay-cream';
    } else if (DesktopConfig.theme === 'dark') {
        backgrounds = [
            'assets/images/bg_dark.jpg',
            'assets/images/bg_dark2.jpg',
            'assets/images/bg_dark3.jpg'
        ];
        overlayClass = 'desktop-overlay desktop-overlay-dark';
    } else {
        return; // Keine Hintergrundbilder für andere Themes
    }
    
    const desktop = document.getElementById('desktop');
    if (!desktop) return;
    
    // Erstelle Hintergrundbilder-Elemente
    backgrounds.forEach((bgUrl, index) => {
        const bgElement = document.createElement('div');
        bgElement.className = 'desktop-background';
        bgElement.style.backgroundImage = `url('${bgUrl}')`;
        bgElement.dataset.index = index;
        
        if (index === 0) {
            bgElement.classList.add('active');
        }
        
        desktop.insertBefore(bgElement, desktop.firstChild);
    });
    
    // Erstelle Overlay mit Theme-spezifischer Klasse
    const overlay = document.createElement('div');
    overlay.className = overlayClass;
    desktop.insertBefore(overlay, desktop.firstChild);
    
    // Starte automatischen Wechsel (alle 8 Sekunden)
    backgroundSlideshowInterval = setInterval(() => {
        switchBackground();
    }, 8000);
    
    // Preload alle Bilder für flüssige Übergänge
    preloadBackgroundImages(backgrounds);
}

function switchBackground() {
    const backgrounds = document.querySelectorAll('.desktop-background');
    if (backgrounds.length === 0) return;
    
    // Entferne active-Klasse vom aktuellen Bild
    const currentBg = backgrounds[currentBackgroundIndex];
    if (currentBg) {
        currentBg.classList.remove('active');
        currentBg.classList.add('fade-out');
    }
    
    // Wechsle zum nächsten Bild
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    
    // Setze neues Bild als aktiv
    const nextBg = backgrounds[currentBackgroundIndex];
    if (nextBg) {
        nextBg.classList.remove('fade-out');
        nextBg.classList.add('active');
    }
}

function preloadBackgroundImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Hamburger-Menü
let hamburgerMenuOpen = false;

function toggleHamburgerMenu() {
    const dropdown = document.getElementById('hamburgerDropdown');
    const btn = document.getElementById('hamburgerBtn');
    
    if (!dropdown || !btn) return;
    
    hamburgerMenuOpen = !hamburgerMenuOpen;
    
    if (hamburgerMenuOpen) {
        dropdown.classList.add('show');
        btn.classList.add('active');
    } else {
        dropdown.classList.remove('show');
        btn.classList.remove('active');
    }
}

// Schließe Menü beim Klick außerhalb
document.addEventListener('click', function(event) {
    const menu = document.getElementById('hamburgerMenu');
    const btn = document.getElementById('hamburgerBtn');
    
    if (menu && btn && hamburgerMenuOpen) {
        if (!menu.contains(event.target)) {
            toggleHamburgerMenu();
        }
    }
});

// Theme-Wechsel
function changeTheme(themeName) {
    toggleHamburgerMenu(); // Schließe Menü
    const url = new URL(window.location);
    url.searchParams.set('theme', themeName);
    window.location.href = url.toString();
}

// Desktop-Icons ein-/ausblenden
let desktopIconsVisible = true;

function toggleDesktopIcons() {
    desktopIconsVisible = !desktopIconsVisible;
    const desktopIcons = document.getElementById('desktopIcons');
    const toggleText = document.getElementById('desktopIconsToggle');
    
    if (desktopIcons) {
        if (desktopIconsVisible) {
            desktopIcons.style.display = 'grid';
            if (toggleText) toggleText.textContent = 'Desktop-Icons ausblenden';
        } else {
            desktopIcons.style.display = 'none';
            if (toggleText) toggleText.textContent = 'Desktop-Icons einblenden';
        }
    }
}

// Erweiterte Einstellungen - App-Verwaltung
let appVisibility = {};

function openAdvancedSettings() {
    toggleHamburgerMenu(); // Schließe Hamburger-Menü
    
    // Initialisiere App-Sichtbarkeit falls noch nicht geschehen
    if (!DesktopConfig || !DesktopConfig.apps) {
        alert('App-Konfiguration nicht verfügbar');
        return;
    }
    
    // Lade gespeicherte Einstellungen oder setze alle auf sichtbar
    if (Object.keys(appVisibility).length === 0) {
        Object.keys(DesktopConfig.apps).forEach(appId => {
            appVisibility[appId] = true;
        });
    }
    
    // Erstelle Modal
    const modal = document.createElement('div');
    modal.className = 'advanced-modal-overlay';
    modal.id = 'advancedModal';
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeAdvancedSettings();
        }
    };
    
    let modalContent = '<div class="advanced-modal" onclick="event.stopPropagation()">';
    modalContent += '<div class="advanced-modal-header">';
    modalContent += '<h2>⚙️ Erweiterte Einstellungen</h2>';
    modalContent += '<button class="advanced-modal-close" onclick="closeAdvancedSettings()">×</button>';
    modalContent += '</div>';
    modalContent += '<div class="advanced-modal-content">';
    modalContent += '<div class="advanced-section-title">Apps verwalten</div>';
    modalContent += '<div class="advanced-apps-list">';
    
    // Erstelle Liste aller Apps
    Object.keys(DesktopConfig.apps).forEach(appId => {
        const app = DesktopConfig.apps[appId];
        const isVisible = appVisibility[appId] !== false;
        const icon = app.icon || '📱';
        const name = app.name || appId;
        
        modalContent += '<div class="advanced-app-item">';
        modalContent += `<div class="advanced-app-info">`;
        modalContent += `<span class="advanced-app-icon">${icon}</span>`;
        modalContent += `<span class="advanced-app-name">${name}</span>`;
        modalContent += `</div>`;
        modalContent += `<label class="advanced-toggle">`;
        modalContent += `<input type="checkbox" ${isVisible ? 'checked' : ''} onchange="toggleAppVisibility('${appId}', this.checked)">`;
        modalContent += `<span class="advanced-toggle-slider"></span>`;
        modalContent += `</label>`;
        modalContent += `</div>`;
    });
    
    modalContent += '</div>'; // advanced-apps-list
    modalContent += '<div class="advanced-modal-footer">';
    modalContent += '<button class="advanced-btn-secondary" onclick="resetAppVisibility()">Zurücksetzen</button>';
    modalContent += '<button class="advanced-btn-primary" onclick="closeAdvancedSettings()">Fertig</button>';
    modalContent += '</div>';
    modalContent += '</div>'; // advanced-modal
    modalContent += '</div>'; // advanced-modal-overlay
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeAdvancedSettings() {
    const modal = document.getElementById('advancedModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function toggleAppVisibility(appId, visible) {
    appVisibility[appId] = visible;
    
    // Finde das Desktop-Icon und blende es ein/aus
    const desktopIcons = document.getElementById('desktopIcons');
    if (!desktopIcons) return;
    
    const iconElement = desktopIcons.querySelector(`[data-app="${appId}"]`);
    if (iconElement) {
        if (visible) {
            iconElement.style.display = 'flex';
        } else {
            iconElement.style.display = 'none';
        }
    }
}

function resetAppVisibility() {
    if (!DesktopConfig || !DesktopConfig.apps) return;
    
    // Setze alle Apps auf sichtbar
    Object.keys(DesktopConfig.apps).forEach(appId => {
        appVisibility[appId] = true;
        toggleAppVisibility(appId, true);
    });
    
    // Aktualisiere Checkboxen
    document.querySelectorAll('#advancedModal input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
}

