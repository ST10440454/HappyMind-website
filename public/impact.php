<?php
require __DIR__ . '/../src/bootstrap.php';
$pageTitle       = 'Impact — Happy Minds';
$pageDescription = 'Measuring success through transformed lives and stronger communities at Happy Minds.';
$currentPage     = 'impact';
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
    <h1 data-r>Our Impact</h1>
    <p data-r style="--i:1">Measuring success through transformed lives and stronger communities</p>
  </div>
</section>

<section class="stats">
  <div class="hm-wrap">
    <div class="grid g4 center" data-stagger>
      <div><span class="num" data-count="2500" data-suffix="+">2,500+</span><p>children educated</p></div>
      <div><span class="num" data-count="12"   data-suffix="">12</span><p>communities served</p></div>
      <div><span class="num" data-count="150"  data-suffix="+">150+</span><p>active volunteers</p></div>
      <div><span class="num" data-count="95"   data-suffix="%">95%</span><p>literacy rate</p></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:40px">
      <span class="eyebrow">Learning outcomes</span>
      <h2 class="h2">Academic improvement</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card">
        <h3>Reading</h3>
        <p class="tag" style="margin:6px 0 14px">45% → 92% proficiency after 1 year</p>
        <div class="bar" aria-hidden="true"><b style="--w:45%"></b></div>
        <div class="bar" aria-hidden="true"><b style="--w:92%"></b></div>
      </article>
      <article class="card">
        <h3>Writing</h3>
        <p class="tag" style="margin:6px 0 14px">40% → 88% proficiency after 1 year</p>
        <div class="bar" aria-hidden="true"><b style="--w:40%"></b></div>
        <div class="bar" aria-hidden="true"><b style="--w:88%"></b></div>
      </article>
      <article class="card">
        <h3>Math</h3>
        <p class="tag" style="margin:6px 0 14px">50% → 90% proficiency after 1 year</p>
        <div class="bar" aria-hidden="true"><b style="--w:50%"></b></div>
        <div class="bar" aria-hidden="true"><b style="--w:90%"></b></div>
      </article>
    </div>
  </div>
</section>

<section class="sec sand">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:40px">
      <span class="eyebrow">Beyond the classroom</span>
      <h2 class="h2">Long-term outcomes</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card center"><span class="num" style="font:700 2.8rem 'Playfair Display',serif;color:var(--o)" data-count="85" data-suffix="%">85%</span><p>continue education beyond secondary school</p></article>
      <article class="card center"><span class="num" style="font:700 2.8rem 'Playfair Display',serif;color:var(--o)" data-count="70" data-suffix="%">70%</span><p>return as volunteers or mentors</p></article>
      <article class="card center"><span class="num" style="font:700 2.8rem 'Playfair Display',serif;color:var(--o)" data-count="90" data-suffix="%">90%</span><p>report improved family relationships</p></article>
    </div>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:40px">
      <span class="eyebrow">In their words</span>
      <h2 class="h2">Success stories</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card"><p style="font:italic 500 1.15rem 'Playfair Display',serif;color:var(--ink)">"Happy Minds taught me that learning can be fun. Now I love reading and want to become a teacher too!"</p><p style="margin-top:16px;font-weight:600;color:var(--od)">— Amara, Age 12</p></article>
      <article class="card"><p style="font:italic 500 1.15rem 'Playfair Display',serif;color:var(--ink)">"My daughter's confidence has grown so much. The teachers here really care about each child."</p><p style="margin-top:16px;font-weight:600;color:var(--od)">— Mrs. Rodriguez, Parent</p></article>
      <article class="card"><p style="font:italic 500 1.15rem 'Playfair Display',serif;color:var(--ink)">"Volunteering here has been life-changing. Seeing these kids' faces light up is priceless."</p><p style="margin-top:16px;font-weight:600;color:var(--od)">— James, Volunteer</p></article>
    </div>
  </div>
</section>

<section class="sec band">
  <div class="hm-wrap" data-r>
    <h2 class="h2" style="color:#fff">Help us reach more children</h2>
    <p>Every volunteer hour and every rand moves a child closer to their potential.</p>
    <p style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a class="hm-btn light" href="donate.php">Donate</a>
      <a class="hm-btn line"  href="get-involved.php">Volunteer</a>
    </p>
  </div>
</section>

</main>

<?php require SRC_PATH . '/includes/footer.php'; ?>
<?php require SRC_PATH . '/includes/scripts.php'; ?>
</body>
</html>
