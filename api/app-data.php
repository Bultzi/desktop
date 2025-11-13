<?php
/**
 * API-Endpunkt für App-Daten
 */

header('Content-Type: application/json');

// Setze Fehlerbehandlung für Debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../apps/BaseApp.php';
require_once __DIR__ . '/../core/AppManager.php';

$appId = $_GET['app'] ?? null;
$windowId = $_GET['window'] ?? null;

if (!$appId) {
    echo json_encode(['error' => 'App-ID fehlt'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $appManager = new AppManager();
    $app = $appManager->loadApp($appId);

    if (!$app) {
        echo json_encode(['error' => 'App nicht gefunden: ' . $appId], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $appConfig = $appManager->getAppConfig($appId);

    // Lade App-Daten
    $html = $app->getHTML();
    $js = $app->getJS();
    $css = $app->getCSS();

    $data = [
        'title' => $appConfig['name'],
        'html' => $html ?: '<div style="padding: 20px; text-align: center; color: #999;">App-Inhalt konnte nicht geladen werden</div>',
        'js' => $js ?: '',
        'css' => $css ?: '',
        'showHelp' => false,
        'init' => null
    ];

    // Spezielle Behandlung für bestimmte Apps
    if ($appId === 'cmd') {
        $data['showHelp'] = true;
    }
    
    if ($appId === 'geminicli') {
        $data['showHelp'] = true;
    }

    // Prüfe ob App eine init-Methode hat
    if (method_exists($app, 'getInitFunction')) {
        $data['init'] = $app->getInitFunction();
    }

    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $e) {
    echo json_encode([
        'error' => 'Fehler beim Laden der App',
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_UNESCAPED_UNICODE);
}

