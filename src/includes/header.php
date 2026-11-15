<?php
/**
 * includes/header.php
 * Shared sticky navigation header for all public pages.
 *
 * Required variable (set before including this file):
 *   $currentPage — string matching one of the nav keys below, e.g. 'about'
 *                  Used to add aria-current="page" to the active link.
 *
 * Nav keys: home, about, programs, impact, get-involved, resources, contact
 */
$currentPage = $currentPage ?? '';

$navLinks = [
    'home'         => ['href' => 'index.php',        'label' => 'Home'],
    'about'        => ['href' => 'about.php',         'label' => 'About'],
    'programs'     => ['href' => 'programs.php',      'label' => 'Programs'],
    'impact'       => ['href' => 'impact.php',        'label' => 'Impact'],
    'get-involved' => ['href' => 'get-involved.php',  'label' => 'Get involved'],
    'resources'    => ['href' => 'resources.php',     'label' => 'Resources'],
    'contact'      => ['href' => 'contact.php',       'label' => 'Contact'],
];
?>
<a class="hm-skip" href="#main">Skip to content</a>
<header class="hm-header">
  <div class="hm-wrap hm-nav">
    <a class="hm-logo" href="index.php">
      <span class="hm-mark" aria-hidden="true">♥</span>Happy Minds
    </a>

    <nav aria-label="Main">
      <ul class="hm-links">
        <?php foreach ($navLinks as $key => $link): ?>
          <li>
            <a href="<?= $link['href'] ?>"<?= $currentPage === $key ? ' aria-current="page"' : '' ?>>
              <?= $link['label'] ?>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </nav>

    <div style="display:flex;align-items:center;gap:10px">
      <a class="hm-btn hm-btn-sm" href="donate.php">Donate</a>
      <div id="headerAuthArea"></div>
    </div>

    <button class="hm-burger" id="menuToggle" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu">☰</button>
  </div>

  <nav class="hm-mobile" id="mobileNav" aria-label="Mobile">
    <?php foreach ($navLinks as $link): ?>
      <a href="<?= $link['href'] ?>"><?= $link['label'] ?></a>
    <?php endforeach; ?>
    <a href="donate.php">Donate</a>
  </nav>
</header>
