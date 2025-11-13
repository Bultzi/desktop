<?php
/**
 * Globale Einstellungen
 */
return [
    'defaultTheme' => 'cream',
    'defaultApps' => ['gemini', 'notes', 'vscode'],
    
    // Video-Presets für verschiedene Video-Typen
    'presets' => [
        'ki-chat-tutorial' => [
            'name' => 'KI-Chat Tutorial',
            'description' => 'Für Videos über KI-Chat-Workflows',
            'apps' => ['gemini', 'notes'],
            'theme' => 'cream'
        ],
        'development-workflow' => [
            'name' => 'Development Workflow',
            'description' => 'Für Videos über Entwicklungs-Workflows',
            'apps' => ['vscode', 'cmd', 'notes'],
            'theme' => 'dark'
        ],
        'creative-workflow' => [
            'name' => 'Creative Workflow',
            'description' => 'Für kreative Workflows',
            'apps' => ['whiteboard', 'aistudio', 'notes'],
            'theme' => 'modern'
        ],
        'full-studio' => [
            'name' => 'Full Studio',
            'description' => 'Alle Apps verfügbar',
            'apps' => ['gemini', 'notes', 'vscode', 'cmd', 'whiteboard', 'aistudio', 'notebooklm', 'geminicli'],
            'theme' => 'cream'
        ]
    ],
    
    // Performance-Einstellungen
    'lazyLoadApps' => true,
    'minifyAssets' => false,
    
    // Video-Produktion Features
    'recordingMode' => false,
    'presentationMode' => false
];

