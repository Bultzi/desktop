<?php
require_once __DIR__ . '/../BaseApp.php';

class NotesApp extends BaseApp {
    public function getHTML() {
        return $this->loadTemplate();
    }
    
    public function getJS() {
        return $this->loadJS();
    }
    
    public function getInitFunction() {
        return 'initNotesApp';
    }
    
    public function init($windowId) {
        // Wird von JavaScript aufgerufen
    }
}

