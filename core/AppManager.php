<?php
/**
 * AppManager - Verwaltet Apps und lädt sie dynamisch
 */
class AppManager {
    private $apps;
    private $loadedApps = [];
    
    public function __construct() {
        $this->apps = require __DIR__ . '/../config/apps.php';
    }
    
    /**
     * Gibt alle registrierten Apps zurück
     * @return array
     */
    public function getAllApps() {
        return array_filter($this->apps, function($app) {
            return $app['enabled'] ?? true;
        });
    }
    
    /**
     * Gibt Apps basierend auf Preset zurück
     * @param string $presetName Preset-Name
     * @return array
     */
    public function getAppsByPreset($presetName) {
        $settings = require __DIR__ . '/../config/settings.php';
        
        if (!isset($settings['presets'][$presetName])) {
            return $this->getAllApps();
        }
        
        $preset = $settings['presets'][$presetName];
        $appIds = $preset['apps'] ?? [];
        
        $result = [];
        foreach ($appIds as $appId) {
            if (isset($this->apps[$appId]) && ($this->apps[$appId]['enabled'] ?? true)) {
                $result[$appId] = $this->apps[$appId];
            }
        }
        
        return $result;
    }
    
    /**
     * Lädt eine App-Klasse
     * @param string $appId App-ID
     * @return BaseApp|null
     */
    public function loadApp($appId) {
        if (!isset($this->apps[$appId])) {
            return null;
        }
        
        if (isset($this->loadedApps[$appId])) {
            return $this->loadedApps[$appId];
        }
        
        $appConfig = $this->apps[$appId];
        $appPath = __DIR__ . '/../' . $appConfig['path'];
        $appClassFile = $appPath . $appConfig['class'] . '.php';
        
        if (!file_exists($appClassFile)) {
            return null;
        }
        
        require_once $appClassFile;
        
        if (!class_exists($appConfig['class'])) {
            return null;
        }
        
        $appInstance = new $appConfig['class']($appId, $appConfig);
        $this->loadedApps[$appId] = $appInstance;
        
        return $appInstance;
    }
    
    /**
     * Gibt die App-Konfiguration zurück
     * @param string $appId App-ID
     * @return array|null
     */
    public function getAppConfig($appId) {
        return $this->apps[$appId] ?? null;
    }
    
    /**
     * Prüft ob eine App aktiviert ist
     * @param string $appId App-ID
     * @return bool
     */
    public function isAppEnabled($appId) {
        return isset($this->apps[$appId]) && ($this->apps[$appId]['enabled'] ?? true);
    }
}

