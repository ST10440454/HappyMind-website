<?php
require __DIR__ . '/../src/bootstrap.php';
$pageTitle       = 'Programs — Happy Minds';
$pageDescription = 'Literacy, creative arts, life skills, digital literacy, STEM and community programs for children aged 4 to 14.';
$currentPage     = 'programs';
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
    <h1 data-r>Our Programs</h1>
    <p data-r style="--i:1">Comprehensive educational programs designed to nurture every child's potential</p>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap">
    <div class="grid g3" data-stagger>
      <article class="card photo">
        <div class="ph" data-slot="literacy" role="img" aria-label="Literacy &amp; Numeracy illustration" style="--t1:#fde6dc;--t2:#ffe9b8"><span aria-hidden="true">📚</span></div>
        <div class="body"><h3>Literacy &amp; Numeracy</h3><p>Building strong foundations in reading, writing, and mathematics through interactive learning.</p><span class="tag">95% literacy achievement</span></div>
      </article>
      <article class="card photo">
        <div class="ph" data-slot="arts" role="img" aria-label="Creative Arts illustration" style="--t1:#e3f3f0;--t2:#fde6dc"><span aria-hidden="true">🎨</span></div>
        <div class="body"><h3>Creative Arts</h3><p>Drawing, painting, music, drama — fostering creativity and self-expression.</p></div>
      </article>
      <article class="card photo">
        <div class="ph" data-slot="lifeskills" role="img" aria-label="Life Skills illustration" style="--t1:#fff0cc;--t2:#e3f3f0"><span aria-hidden="true">🌱</span></div>
        <div class="body"><h3>Life Skills</h3><p>Communication, teamwork, problem-solving, and leadership development.</p></div>
      </article>
      <article class="card photo">
        <div class="ph" data-slot="digital" role="img" aria-label="Digital Literacy illustration" style="--t1:#e8e4fa;--t2:#e3f3f0"><span aria-hidden="true">💻</span></div>
        <div class="body"><h3>Digital Literacy</h3><p>Computer skills, internet safety, and introduction to coding.</p></div>
      </article>
      <article class="card photo">
        <div class="ph" data-slot="stem" role="img" aria-label="STEM Education illustration" style="--t1:#e3f3f0;--t2:#fff0cc"><span aria-hidden="true">🔬</span></div>
        <div class="body"><h3>STEM Education</h3><p>Hands-on science experiments, robotics, and math exploration.</p></div>
      </article>
      <article class="card photo">
        <div class="ph" data-slot="community" role="img" aria-label="Community Integration illustration" style="--t1:#fde6dc;--t2:#e3f3f0"><span aria-hidden="true">🤝</span></div>
        <div class="body"><h3>Community Integration</h3><p>Service projects, environmental awareness, and family engagement.</p></div>
      </article>
    </div>
  </div>
</section>

<section class="sec sand">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:40px">
      <span class="eyebrow">Age groups</span>
      <h2 class="h2">Learning for every stage</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card"><div class="icon" aria-hidden="true">🌼</div><h3>Early Learners</h3><p>Ages 4–6</p></article>
      <article class="card"><div class="icon" aria-hidden="true">📖</div><h3>Primary</h3><p>Ages 7–10</p></article>
      <article class="card"><div class="icon" aria-hidden="true">🚀</div><h3>Junior Scholars</h3><p>Ages 11–14</p></article>
    </div>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:40px">
      <span class="eyebrow">When we meet</span>
      <h2 class="h2">Program schedule</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card"><div class="icon" aria-hidden="true">🎒</div><h3>After-school programs</h3><p>Homework help, enrichment activities, and creative learning.</p><p class="tag">Monday – Friday, 3:00 PM – 6:00 PM</p></article>
      <article class="card"><div class="icon" aria-hidden="true">🧪</div><h3>Weekend workshops</h3><p>Special focus sessions in arts, STEM, and life skills.</p><p class="tag">Saturdays, 10:00 AM – 2:00 PM</p></article>
      <article class="card"><div class="icon" aria-hidden="true">☀️</div><h3>Summer camps</h3><p>Intensive learning with field trips and hands-on projects.</p><p class="tag">June – August</p></article>
    </div>
  </div>
</section>

<section class="sec band">
  <div class="hm-wrap" data-r>
    <h2 class="h2" style="color:#fff">Ready to join a program?</h2>
    <p>Contact us to enrol your child, or volunteer to help run a session.</p>
    <p style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a class="hm-btn light" href="contact.php">Enquire now</a>
      <a class="hm-btn line"  href="get-involved.php">Volunteer</a>
    </p>
  </div>
</section>

</main>

<?php require SRC_PATH . '/includes/footer.php'; ?>
<?php require SRC_PATH . '/includes/scripts.php'; ?>
</body>
</html>
