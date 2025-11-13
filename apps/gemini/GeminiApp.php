<?php
require_once __DIR__ . '/../BaseApp.php';

class GeminiApp extends BaseApp {
    public function getHTML() {
        return $this->loadTemplate();
    }
    
    public function getJS() {
        return $this->loadJS();
    }
    
    public function getInitFunction() {
        return 'initGeminiApp';
    }
    
    public function init($windowId) {
        // Wird von JavaScript aufgerufen
    }
}

