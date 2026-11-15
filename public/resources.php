<?php
require __DIR__ . '/../src/bootstrap.php';
$pageTitle       = 'Resources — Happy Minds';
$pageDescription = 'Free hard-copy guides and trusted learning websites to support education at home.';
$currentPage     = 'resources';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require SRC_PATH . '/includes/head.php'; ?>
</head>
<body>
<?php require SRC_PATH . '/includes/header.php'; ?>

<main id="main">

<section class="page-hero">
  <div class="hm-wrap">
    <h1 data-r>Free Resources</h1>
    <p data-r style="--i:1">Learning materials, guides, and tools to support education at home</p>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:40px">
      <span class="eyebrow">Take home</span>
      <h2 class="h2">Hard Copy Guides</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card">
        <div class="icon" aria-hidden="true">📚</div>
        <h3>Reading List (Grades 1-3)</h3><p>Hard copy</p>
        <p style="margin-top:14px"><a href="mailto:Inquire@happyminds.org?subject=Reading List (Grades 1-3) - hard copy request" style="color:var(--od);font-weight:600">Ask for a copy →</a></p>
      </article>
      <article class="card">
        <div class="icon" aria-hidden="true">🔤</div>
        <h3>Phonics Workbook</h3><p>Hard copy</p>
        <p style="margin-top:14px"><a href="mailto:Inquire@happyminds.org?subject=Phonics Workbook - hard copy request" style="color:var(--od);font-weight:600">Ask for a copy →</a></p>
      </article>
      <article class="card">
        <div class="icon" aria-hidden="true">🎨</div>
        <h3>Creative Arts Activities</h3><p>Hard copy</p>
        <p style="margin-top:14px"><a href="mailto:Inquire@happyminds.org?subject=Creative Arts Activities - hard copy request" style="color:var(--od);font-weight:600">Ask for a copy →</a></p>
      </article>
      <article class="card">
        <div class="icon" aria-hidden="true">🔬</div>
        <h3>Science at Home</h3><p>Hard copy</p>
        <p style="margin-top:14px"><a href="mailto:Inquire@happyminds.org?subject=Science at Home - hard copy request" style="color:var(--od);font-weight:600">Ask for a copy →</a></p>
      </article>
      <article class="card">
        <div class="icon" aria-hidden="true">👨‍👩‍👧</div>
        <h3>Parent Learning Guide</h3><p>Hard copy</p>
        <p style="margin-top:14px"><a href="mailto:Inquire@happyminds.org?subject=Parent Learning Guide - hard copy request" style="color:var(--od);font-weight:600">Ask for a copy →</a></p>
      </article>
      <article class="card">
        <div class="icon" aria-hidden="true">🧩</div>
        <h3>Math Games &amp; Puzzles</h3><p>Hard copy</p>
        <p style="margin-top:14px"><a href="mailto:Inquire@happyminds.org?subject=Math Games and Puzzles - hard copy request" style="color:var(--od);font-weight:600">Ask for a copy →</a></p>
      </article>
    </div>
  </div>
</section>

<section class="sec sand">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:40px">
      <span class="eyebrow">Learn online</span>
      <h2 class="h2">External resources we trust</h2>
    </div>
    <div class="grid g3" data-stagger>
      <a class="card center" href="https://www.khanacademy.org" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><h3>Khan Academy</h3><p>Free online courses in every subject ↗</p></a>
      <a class="card center" href="https://storylineonline.net" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><h3>Storyline Online</h3><p>Children's books read by actors ↗</p></a>
      <a class="card center" href="https://pbskids.org" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><h3>PBS Kids</h3><p>Educational games and videos ↗</p></a>
    </div>
  </div>
</section>

</main>

<?php require SRC_PATH . '/includes/footer.php'; ?>
<?php require SRC_PATH . '/includes/scripts.php'; ?>
</body>
</html>
