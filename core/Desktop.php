<?php
/**
 * Desktop - Hauptklasse für den Desktop
 */
class Desktop {
    private $themeManager;
    private $appManager;
    private $settings;
    private $preset;
    
    public function __construct() {
        $this->themeManager = new ThemeManager();
        $this->appManager = new AppManager();
        $this->settings = require __DIR__ . '/../config/settings.php';
        
        // Bestimme Preset aus URL
        $this->preset = $_GET['preset'] ?? null;
    }
    
    /**
     * Rendert den kompletten Desktop
     * @return string HTML
     */
    public function render() {
        $html = '<!DOCTYPE html>' . "\n";
        $html .= '<html lang="de">' . "\n";
        $html .= '<head>' . "\n";
        $html .= $this->renderHead();
        $html .= '</head>' . "\n";
        $html .= '<body>' . "\n";
        $html .= $this->renderBody();
        $html .= '</body>' . "\n";
        $html .= '</html>';
        
        return $html;
    }
    
    /**
     * Rendert den Head-Bereich
     * @return string HTML
     */
    private function renderHead() {
        $html = '<meta charset="UTF-8">' . "\n";
        $html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0">' . "\n";
        $html .= '<title>KI Workflow Studio Pro</title>' . "\n";
        
        // Basis-CSS
        $html .= '<link rel="stylesheet" href="assets/css/base.css">' . "\n";
        
        // Theme-Variablen
        $html .= '<style>' . "\n";
        $html .= $this->themeManager->loadThemeVariables();
        $html .= "\n";
        $html .= $this->themeManager->loadThemeCSS();
        $html .= '</style>' . "\n";
        
        // App-CSS wird später dynamisch geladen
        
        return $html;
    }
    
    /**
     * Rendert den Body-Bereich
     * @return string HTML
     */
    private function renderBody() {
        $html = '<div class="desktop" id="desktop">' . "\n";
        $html .= '<div class="desktop-icons" id="desktopIcons">' . "\n";
        
        // Lade Apps basierend auf Preset oder alle
        if ($this->preset && isset($this->settings['presets'][$this->preset])) {
            $apps = $this->appManager->getAppsByPreset($this->preset);
        } else {
            $apps = $this->appManager->getAllApps();
        }
        
        // Desktop-Icons für Apps
        foreach ($apps as $appId => $appConfig) {
            $html .= $this->renderDesktopIcon($appId, $appConfig);
        }
        
        $html .= '</div>' . "\n"; // desktop-icons
        $html .= '</div>' . "\n"; // desktop
        
        // Hamburger-Menü (ersetzt Theme-Switcher)
        $html .= $this->themeManager->renderThemeSwitcher();
        
        // JavaScript
        $html .= '<script src="assets/js/desktop-core.js"></script>' . "\n";
        $html .= '<script src="assets/js/window-manager.js"></script>' . "\n";
        $html .= '<script src="assets/js/drag-drop.js"></script>' . "\n";
        
        // App-JavaScript wird später dynamisch geladen
        $html .= '<script>' . "\n";
        $html .= 'const DesktopConfig = ' . json_encode([
            'apps' => $apps,
            'theme' => $this->themeManager->getCurrentThemeName(),
            'preset' => $this->preset
        ], JSON_PRETTY_PRINT) . ';' . "\n";
        $html .= '</script>' . "\n";
        
        return $html;
    }
    
    /**
     * Rendert ein Desktop-Icon
     * @param string $appId App-ID
     * @param array $appConfig App-Konfiguration
     * @return string HTML
     */
    private function renderDesktopIcon($appId, $appConfig) {
        $html = sprintf(
            '<div class="desktop-icon" onclick="openApp(\'%s\')" data-app="%s">' . "\n",
            htmlspecialchars($appId),
            htmlspecialchars($appId)
        );
        $html .= '<div class="icon-image">' . htmlspecialchars($appConfig['icon']) . '</div>' . "\n";
        $html .= '<div class="icon-label">' . htmlspecialchars($appConfig['name']) . '</div>' . "\n";
        $html .= '</div>' . "\n";
        
        return $html;
    }
    
    /**
     * Gibt den ThemeManager zurück
     * @return ThemeManager
     */
    public function getThemeManager() {
        return $this->themeManager;
    }
    
    /**
     * Gibt den AppManager zurück
     * @return AppManager
     */
    public function getAppManager() {
        return $this->appManager;
    }
}

