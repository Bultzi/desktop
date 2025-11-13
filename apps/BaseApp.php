<?php
/**
 * BaseApp - Abstrakte Basisklasse für alle Apps
 */
abstract class BaseApp {
    protected $appId;
    protected $config;
    
    public function __construct($appId, $config) {
        $this->appId = $appId;
        $this->config = $config;
    }
    
    /**
     * Gibt den HTML-Inhalt der App zurück
     * @return string HTML-Content
     */
    abstract public function getHTML();
    
    /**
     * Gibt den JavaScript-Code der App zurück
     * @return string JavaScript-Code
     */
    abstract public function getJS();
    
    /**
     * Gibt den CSS-Code der App zurück
     * @return string CSS-Code
     */
    public function getCSS() {
        $cssFile = __DIR__ . '/../' . $this->config['path'] . $this->appId . '.css';
        if (file_exists($cssFile)) {
            return file_get_contents($cssFile);
        }
        return '';
    }
    
    /**
     * Initialisiert die App nach dem Laden
     * @param string $windowId Die eindeutige Window-ID
     */
    public function init($windowId) {
        // Kann von abgeleiteten Klassen überschrieben werden
    }
    
    /**
     * Wird aufgerufen wenn die App geschlossen wird
     * @param string $windowId Die eindeutige Window-ID
     */
    public function destroy($windowId) {
        // Kann von abgeleiteten Klassen überschrieben werden
    }
    
    /**
     * Gibt die App-Konfiguration zurück
     * @return array
     */
    public function getConfig() {
        return $this->config;
    }
    
    /**
     * Lädt ein HTML-Template
     * @param string $templateName Name des Templates
     * @return string HTML-Content
     */
    protected function loadTemplate($templateName = null) {
        if ($templateName === null) {
            $templateName = $this->appId;
        }
        $templateFile = __DIR__ . '/../' . $this->config['path'] . $templateName . '.html';
        if (file_exists($templateFile)) {
            return file_get_contents($templateFile);
        }
        return '';
    }
    
    /**
     * Lädt JavaScript-Datei
     * @param string $jsName Name der JS-Datei
     * @return string JavaScript-Code
     */
    protected function loadJS($jsName = null) {
        if ($jsName === null) {
            $jsName = $this->appId;
        }
        $jsFile = __DIR__ . '/../' . $this->config['path'] . $jsName . '.js';
        if (file_exists($jsFile)) {
            return file_get_contents($jsFile);
        }
        return '';
    }
}

