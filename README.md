# KI Workflow Studio Pro - Modulares Virtueller Desktop System

Ein modulares, framework-freies Desktop-System für Shared Hosting (PHP + HTML/CSS/JS) zum Erstellen von YouTube-Workflows mit KI-Tools.

## Highlights

- **Modulare App-Architektur**: Jede App ist isoliert (HTML, JS, CSS) + PHP-Klasse
- **Dynamisches Laden**: App-Inhalte werden bei Bedarf via `api/app-data.php` geladen
- **Theme-System**: Wechselbare Themes (Cream, Dark, Modern) per URL oder Menü
- **Hamburger-Menü**: Theme-Auswahl + Desktop-Elemente ein-/ausblenden + „Erweitert“-Dialog
- **Presets**: Vordefinierte App-Kombinationen über URL-Parameter
- **Erweiterbarkeit**: Apps/Themes/Preset-Konfigurationen leicht ergänzbar

## Systemvoraussetzungen

- Shared Hosting mit PHP 8.x (keine Shell, keine Node-Abhängigkeiten)

## Installation

1. Projekt hochladen (z. B. `public_html/desktop/`)
2. PHP muss aktiviert sein
3. `index.php` im Browser öffnen

## Startvarianten

- Standard-Desktop: `index.php`
- Mit Preset:
  ```
  index.php?preset=ki-chat-tutorial
  index.php?preset=development-workflow
  index.php?preset=creative-workflow
  index.php?preset=full-studio
  ```
- Mit Theme:
  ```
  index.php?theme=dark
  index.php?theme=modern
  index.php?theme=cream
  ```

## Projektstruktur

```
core/                # Desktop, ThemeManager, AppManager
apps/                # Einzelne Apps (HTML/JS/CSS + PHP-Klasse)
api/app-data.php     # API zum Ausliefern der App-Inhalte (HTML/JS/CSS)
assets/css/          # Basis-Styles (z. B. Fenster-Styles)
assets/js/           # Desktop-Core, Window-Manager, Drag&Drop
config/              # apps.php, themes.php, settings.php (Presets)
themes/              # Theme-Variablen, Styles, Metadaten
DOCS/                # Vorlagen/Referenzdateien (simple/complex)
```

## Architekturüberblick

- `core/Desktop.php`: Rendert die Desktop-Struktur + lädt `assets/js/*`
- `core/ThemeManager.php`: Lädt Theme-Variablen/CSS und rendert das **Hamburger-Menü**
- `core/AppManager.php`: Registry und Lifecycle von Apps (Konfiguration aus `config/apps.php`)
- `apps/BaseApp.php`: Abstrakte Basis mit Helfern `loadTemplate()`, `loadJS()`, `getCSS()`
- `assets/js/window-manager.js`: Öffnet Fenster, lädt App-Inhalte via API und initialisiert Apps (ruft `getInitFunction()` der App auf)

## Hamburger-Menü & „Erweitert“

- Button oben rechts (☰)
- **Theme-Auswahl** direkt im Menü
- **Desktop-Icons ein-/ausblenden**
- **Erweitert**: Popup zum Ein-/Ausblenden einzelner Apps (per Toggle)

## Verfügbare Apps

- **Gemini** 💎 – Chat (sarkastische Antworten)
- **Notes** 📝 – Notizen mit localStorage (automatisches Speichern)
- **VSCode** 💻 – Editor-Simulation mit Tabs/Terminal/AI-Helfer
- **CMD** ⌘ – Terminal-Simulation mit Befehlen/Help
- **Whiteboard** ✏️ – Zeichenbrett (Freihand, Formen, Pfeile, Text, Radierer, Fülleimer, Icons)
- **AI Studio** 🏛️ – App-Builder (Drag&Drop Platzhalter)
- **NotebookLM** 📓 – Projekt-Verwaltung (Demo-Projekt, Karten, Detail-Dialoge)
- **Gemini CLI** ⚡ – CLI-Simulation mit Kommandos
- **NanoBanana** 🍌 – Bildgenerator (simuliert) mit Galerie
- **KI‑Helfer Ordner** 📁 – KI-Tools-Datenbank (Kategorien + Links)

## Fenstergrößen je App

Fenstergrößen werden per CSS-Klasse gesteuert (`assets/css/base.css`). Beispiel:

```css
.window.gemini-window { width: 450px; height: 650px; }
.window.notes-window { width: 850px; height: 650px; }
.window.whiteboard-window { width: 900px; height: 80vh; }
.window.vscode-window { width: 1200px; height: 800px; }
.window.nanobanana-window { width: 1200px; height: 850px; }
.window.folder-window { width: 750px; height: 550px; }
```

## Neue App hinzufügen

1. Ordner `apps/myapp/` erstellen
2. Dateien anlegen:
   - `MyAppApp.php` – PHP Klasse, die `BaseApp` erweitert
   - `myapp.html` – App-HTML
   - `myapp.js` – App-JavaScript
   - `myapp.css` – App-Styles (optional)
3. In `config/apps.php` registrieren:
   ```php
   'myapp' => [
       'name' => 'Meine App',
       'class' => 'MyAppApp',
       'icon' => '🎯',
       'category' => 'productivity',
       'enabled' => true,
       'path' => 'apps/myapp/'
   ]
   ```
4. Optionale Initialisierung definieren (wenn die App eine JS-Init-Funktion braucht):
   - In `MyAppApp.php`:
     ```php
     public function getInitFunction() { return 'initMyApp'; }
     ```
   - In `myapp.js` am Ende sicherstellen:
     ```js
     window.initMyApp = initMyApp; // Funktion global exportieren
     ```

> Hinweis: Der Window-Manager lädt JS/CSS nur einmal pro App und ruft nach dem Laden `window[getInitFunction()]` auf.

## Themes & Presets

- **Themes** in `config/themes.php` registrieren, Dateien im Ordner `themes/<name>/`
- **Presets** in `config/settings.php` definieren und über `?preset=<id>` nutzen

## Troubleshooting

- **App-Fenster ist leer**
  - Prüfe `api/app-data.php?app=<id>` im Browser – kommt HTML/JS/CSS zurück?
  - Implementiert die App `getHTML()`/`getJS()` (BaseApp lädt Dateien automatisch)?
  - Gibt die App eine `getInitFunction()` zurück und ist diese als `window.<fn>` global verfügbar?
- **Whiteboard zeichnet nicht / falscher Cursor**
  - Harte Aktualisierung (Strg+F5). Das Whiteboard initialisiert DPI-korrekt; der Canvas füllt die gesamte Fläche. Es muss in der Konsole „Whiteboard initialized …“ erscheinen.
- **Theme/Icons**
  - Über ☰-Menü Theme wechseln und Desktop-Icons ein-/ausblenden
  - Über „Erweitert“ einzelne Apps toggeln

## Technische Details

- **PHP**: App-Verwaltung/Registry, Theme-Lader, API (`api/app-data.php`)
- **JS**: Vanilla-Module
  - `assets/js/desktop-core.js` (Basis, globale Config)
  - `assets/js/window-manager.js` (Fenster, App-Lade-Logik, Init-Aufruf)
  - `assets/js/drag-drop.js` (Fenster ziehen)
- **CSS**: Variables/Theme-Styles + Basis-Fenster-Styles

## Lizenz

Für interne Nutzung – KI Workflow Studio Pro

