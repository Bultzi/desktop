<?php
/**
 * Haupt-Einstiegspunkt für den Virtuellen Desktop
 */

// Lade Core-Klassen
require_once __DIR__ . '/core/ThemeManager.php';
require_once __DIR__ . '/core/AppManager.php';
require_once __DIR__ . '/core/Desktop.php';

// Erstelle Desktop-Instanz und rendere
$desktop = new Desktop();
echo $desktop->render();

