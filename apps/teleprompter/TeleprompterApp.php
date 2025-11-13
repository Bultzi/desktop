<?php
require_once __DIR__ . '/../BaseApp.php';

class TeleprompterApp extends BaseApp {
    public function getHTML() {
        return $this->loadTemplate();
    }
    
    public function getJS() {
        return $this->loadJS();
    }
    
    public function getInitFunction() {
        return 'initTeleprompterApp';
    }
    
    public function init($windowId) {
        // Wird von JavaScript aufgerufen
    }
    
    public function destroy($windowId) {
        // Wird aufgerufen wenn die App geschlossen wird
        // JavaScript kümmert sich um das Zurücksetzen
    }
}

