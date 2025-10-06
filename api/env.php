<?php
function env($key, $default = null) {
    static $vars = null;
    if ($vars === null) {
        $vars = [];
        $lines = file(__DIR__ . '/../.env');
        foreach ($lines as $line) {
            if (preg_match('/^([A-Z_]+)=(.*)$/', trim($line), $matches)) {
                $vars[$matches[1]] = $matches[2];
            }
        }
    }
    return $vars[$key] ?? $default;
}
?>
