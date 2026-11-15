<?php
require __DIR__ . '/../src/bootstrap.php';
$pageTitle       = 'About — Happy Minds';
$pageDescription = 'Our story, mission, vision and team at Happy Minds.';
$currentPage     = 'about';
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
    <h1 data-r>About Happy Minds</h1>
    <p data-r style="--i:1">Building brighter futures through education, one child at a time</p>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap split">
    <div data-r>
      <span class="eyebrow">Our story</span>
      <h2 class="h2">Where it all began</h2>
      <p class="lead">Happy Minds was founded in 2015 with a simple yet powerful vision: every child, regardless of their economic background, deserves access to quality education that nurtures their potential.</p>
      <p class="lead" style="margin-top:16px">What started as a small community initiative with 20 children has grown into a comprehensive program serving over 2,500 children across 12 communities.</p>
    </div>
    <div data-r style="--i:2" class="hero-photo">
      <div class="ph" data-slot="about" data-img="https://images.unsplash.com/photo-1637148734636-906c24feeb55?w=800&auto=format" role="img" aria-label="Children learning together at Happy Minds" style="--t1:#fde6dc;--t2:#e3f3f0">
        <span aria-hidden="true">🏫</span>
      </div>
    </div>
  </div>
</section>

<section class="sec sand">
  <div class="hm-wrap grid g2" data-stagger>
    <article class="card"><div class="icon" aria-hidden="true">🎯</div><h3>Our mission</h3><p>To provide quality education to children through creative, engaging teaching methods that inspire curiosity and build brighter futures.</p></article>
    <article class="card"><div class="icon" aria-hidden="true">👁️</div><h3>Our vision</h3><p>A world where every child, regardless of circumstances, has access to transformative education that unlocks their full potential.</p></article>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:44px">
      <span class="eyebrow">The people</span>
      <h2 class="h2">Meet our team</h2>
    </div>
    <div class="grid g4 center" data-stagger>
      <article class="card"><div class="avatar" aria-hidden="true">SJ</div><h3>Sarah Johnson</h3><p>Founder &amp; Director</p></article>
      <article class="card"><div class="avatar" aria-hidden="true">MC</div><h3>Michael Chen</h3><p>Program Manager</p></article>
      <article class="card"><div class="avatar" aria-hidden="true">PP</div><h3>Priya Patel</h3><p>Lead Educator</p></article>
      <article class="card"><div class="avatar" aria-hidden="true">DW</div><h3>David Williams</h3><p>Community Outreach</p></article>
    </div>
  </div>
</section>

<section class="sec band">
  <div class="hm-wrap" data-r>
    <h2 class="h2" style="color:#fff">Be part of the story</h2>
    <p>Volunteer your time, share your skills or give a gift that changes a child's year.</p>
    <p style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a class="hm-btn light" href="get-involved.php">Get involved</a>
      <a class="hm-btn line"  href="donate.php">Donate</a>
    </p>
  </div>
</section>

</main>

<?php require SRC_PATH . '/includes/footer.php'; ?>
<?php require SRC_PATH . '/includes/scripts.php'; ?>
</body>
</html>
