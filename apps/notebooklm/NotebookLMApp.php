<?php
require_once __DIR__ . '/../BaseApp.php';

class NotebookLMApp extends BaseApp {
    public function getHTML() {
        return $this->loadTemplate();
    }
    
    public function getJS() {
        return $this->loadJS();
    }

    public function getInitFunction() {
        return 'initNotebookLMApp';
    }
}

