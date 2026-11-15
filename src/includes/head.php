<?php
/**
 * includes/head.php
 * Shared <head> block for all public pages.
 *
 * Required variables (set before including this file):
 *   $pageTitle       — string, e.g. "About — Happy Minds"
 *   $pageDescription — string, meta description
 *   $extraCss        — (optional) string of additional <link> or <style> tags
 */
$pageTitle       = $pageTitle       ?? 'Happy Minds';
$pageDescription = $pageDescription ?? 'Happy Minds is a non-profit providing creative, joyful education to children in Pretoria communities.';
$extraCss        = $extraCss        ?? '';
?>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= htmlspecialchars($pageTitle) ?></title>
<meta name="description" content="<?= htmlspecialchars($pageDescription) ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/css/theme.css">
<script>document.documentElement.classList.add('js')</script>
<?= $extraCss ?>
