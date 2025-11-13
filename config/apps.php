<?php
/**
 * App Registry
 * Alle verfügbaren Apps werden hier registriert
 */
return [
    'gemini' => [
        'name' => 'Gemini',
        'class' => 'GeminiApp',
        'icon' => '💎',
        'category' => 'chat',
        'enabled' => true,
        'path' => 'apps/gemini/'
    ],
    'notes' => [
        'name' => 'Notizen',
        'class' => 'NotesApp',
        'icon' => '📝',
        'category' => 'productivity',
        'enabled' => true,
        'path' => 'apps/notes/'
    ],
    'vscode' => [
        'name' => 'Visual Studio Code',
        'class' => 'VSCodeApp',
        'icon' => '💻',
        'category' => 'development',
        'enabled' => true,
        'path' => 'apps/vscode/'
    ],
    'cmd' => [
        'name' => 'Eingabeaufforderung',
        'class' => 'CmdApp',
        'icon' => '⌘',
        'category' => 'system',
        'enabled' => true,
        'path' => 'apps/cmd/'
    ],
    'whiteboard' => [
        'name' => 'Whiteboard',
        'class' => 'WhiteboardApp',
        'icon' => '✏️',
        'category' => 'creative',
        'enabled' => true,
        'path' => 'apps/whiteboard/'
    ],
    'aistudio' => [
        'name' => 'AI Studio',
        'class' => 'AIStudioApp',
        'icon' => '🏛️',
        'category' => 'development',
        'enabled' => true,
        'path' => 'apps/aistudio/'
    ],
    'notebooklm' => [
        'name' => 'NotebookLM',
        'class' => 'NotebookLMApp',
        'icon' => '📓',
        'category' => 'productivity',
        'enabled' => true,
        'path' => 'apps/notebooklm/'
    ],
    'geminicli' => [
        'name' => 'Gemini CLI',
        'class' => 'GeminiCLIApp',
        'icon' => '⚡',
        'category' => 'chat',
        'enabled' => true,
        'path' => 'apps/geminicli/'
    ],
    'nanobanana' => [
        'name' => 'NanoBanana',
        'class' => 'NanoBananaApp',
        'icon' => '🍌',
        'category' => 'creative',
        'enabled' => true,
        'path' => 'apps/nanobanana/'
    ],
    'folder' => [
        'name' => 'KI-Helfer Ordner',
        'class' => 'FolderApp',
        'icon' => '📁',
        'category' => 'productivity',
        'enabled' => true,
        'path' => 'apps/folder/'
    ]
];

