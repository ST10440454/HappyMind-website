<?php
/**
 * includes/scripts.php
 * Shared script tags loaded at the bottom of every public page's <body>.
 * They are ES modules (auth.js imports the Firebase SDK); modules run in document order.
 *
 * Optional variable:
 *   $extraScripts — string of additional <script type="module"> tags specific to a page
 */
$extraScripts = $extraScripts ?? '';
?>
<script type="module" src="assets/js/auth.js"></script>
<script type="module" src="assets/js/auth-modal.js"></script>
<script type="module" src="assets/js/main.js"></script>
<script type="module" src="assets/js/header-auth.js"></script>
<?= $extraScripts ?>
