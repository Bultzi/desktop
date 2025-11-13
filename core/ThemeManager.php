<?php
/**
 * ThemeManager - Verwaltet Themes und lädt CSS-Variablen
 */
class ThemeManager {
    private $themes;
    private $currentTheme;
    private $settings;
    
    public function __construct() {
        $this->themes = require __DIR__ . '/../config/themes.php';
        $this->settings = require __DIR__ . '/../config/settings.php';
        
        // Bestimme aktuelles Theme aus URL-Parameter oder Settings
        $preset = $_GET['preset'] ?? null;
        if ($preset && isset($this->settings['presets'][$preset])) {
            $this->currentTheme = $this->settings['presets'][$preset]['theme'];
        } else {
            $this->currentTheme = $_GET['theme'] ?? $this->settings['defaultTheme'];
        }
        
        // Validiere Theme
        if (!isset($this->themes[$this->currentTheme])) {
            $this->currentTheme = $this->settings['defaultTheme'];
        }
    }
    
    /**
     * Gibt den Pfad zum aktuellen Theme zurück
     * @return string
     */
    public function getCurrentThemePath() {
        return $this->themes[$this->currentTheme]['path'];
    }
    
    /**
     * Gibt den Namen des aktuellen Themes zurück
     * @return string
     */
    public function getCurrentThemeName() {
        return $this->currentTheme;
    }
    
    /**
     * Gibt alle verfügbaren Themes zurück
     * @return array
     */
    public function getAvailableThemes() {
        return $this->themes;
    }
    
    /**
     * Lädt die CSS-Variablen des aktuellen Themes
     * @return string CSS-Code
     */
    public function loadThemeVariables() {
        $themePath = $this->getCurrentThemePath();
        $variablesFile = $themePath . 'variables.css';
        
        if (file_exists($variablesFile)) {
            return file_get_contents($variablesFile);
        }
        
        // Fallback: Leere Variablen
        return ':root {}';
    }
    
    /**
     * Lädt das Theme-CSS
     * @return string CSS-Code
     */
    public function loadThemeCSS() {
        $themePath = $this->getCurrentThemePath();
        $themeFile = $themePath . 'theme.css';
        
        if (file_exists($themeFile)) {
            return file_get_contents($themeFile);
        }
        
        return '';
    }
    
    /**
     * Gibt Theme-Metadaten zurück
     * @return array
     */
    public function getThemeMetadata() {
        $themePath = $this->getCurrentThemePath();
        $metadataFile = $themePath . 'theme.json';
        
        if (file_exists($metadataFile)) {
            $metadata = json_decode(file_get_contents($metadataFile), true);
            return $metadata ?: [];
        }
        
        return [];
    }
    
    /**
     * Erstellt HTML für Hamburger-Menü
     * @return string HTML
     */
    public function renderThemeSwitcher() {
        $html = '<div class="hamburger-menu" id="hamburgerMenu">';
        $html .= '<button class="hamburger-btn" id="hamburgerBtn" onclick="toggleHamburgerMenu()">☰</button>';
        $html .= '<div class="hamburger-dropdown" id="hamburgerDropdown">';
        
        // Theme-Sektion
        $html .= '<div class="menu-section">';
        $html .= '<div class="menu-section-title">🎨 Theme</div>';
        foreach ($this->themes as $themeId => $theme) {
            $active = $themeId === $this->currentTheme ? 'active' : '';
            $html .= sprintf(
                '<div class="menu-item %s" onclick="changeTheme(\'%s\')">%s</div>',
                $active,
                htmlspecialchars($themeId),
                htmlspecialchars($theme['displayName'])
            );
        }
        $html .= '</div>';
        
        // Desktop-Elemente Sektion
        $html .= '<div class="menu-section">';
        $html .= '<div class="menu-section-title">🖥️ Desktop-Elemente</div>';
        $html .= '<div class="menu-item" onclick="toggleDesktopIcons()">';
        $html .= '<span id="desktopIconsToggle">Desktop-Icons ausblenden</span>';
        $html .= '</div>';
        $html .= '<div class="menu-item" onclick="openAdvancedSettings()">';
        $html .= '⚙️ Erweitert';
        $html .= '</div>';
        $html .= '</div>';
        
        $html .= '</div>'; // hamburger-dropdown
        $html .= '</div>'; // hamburger-menu
        
        return $html;
    }
}

