<?php
require __DIR__ . '/../src/bootstrap.php';
$pageTitle       = 'Education for every child — Happy Minds';
$pageDescription = 'Happy Minds is a non-profit providing creative, joyful education to children in Pretoria communities.';
$currentPage     = 'home';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require SRC_PATH . '/includes/head.php'; ?>
</head>
<body>
<?php require SRC_PATH . '/includes/header.php'; ?>

<main id="main">

<section class="hero sec" style="padding:70px 0 90px">
  <span class="blob" style="width:260px;height:260px;background:#ffd9a3;top:-60px;left:-80px"></span>
  <span class="blob" style="width:160px;height:160px;background:#bfe8e1;bottom:30px;right:40%;animation-delay:-3s"></span>
  <div class="hm-wrap split" style="position:relative">
    <div>
      <span class="eyebrow" data-r>Since 2015 · Non-profit</span>
      <h1 data-r style="--i:1">Education that feels like <em>discovery</em></h1>
      <p class="lead" data-r style="--i:2">Every child deserves a place where learning is joyful, creative, and free. We work with communities to build that place — one smile at a time.</p>
      <p data-r style="--i:3;display:flex;gap:14px;flex-wrap:wrap;margin-top:30px">
        <a class="hm-btn" href="get-involved.php">Volunteer with us</a>
        <a class="hm-btn ghost" href="programs.php">Our programs</a>
      </p>
    </div>
    <div class="hero-photo" data-r style="--i:2">
      <div class="ph" data-slot="hero" role="img" aria-label="Children smiling and making heart shapes with their hands" style="--t1:#fde6dc;--t2:#ffe9b8">
        <span aria-hidden="true">🎒</span>
      </div>
      <div class="badge"><b>2,500+</b>Children educated</div>
    </div>
  </div>
</section>

<section class="stats">
  <div class="hm-wrap">
    <div class="grid g4 center" data-stagger>
      <div><span class="num" data-count="2500" data-suffix="+">2,500+</span><p>children reached</p></div>
      <div><span class="num" data-count="12"   data-suffix="">12</span><p>communities</p></div>
      <div><span class="num" data-count="150"  data-suffix="+">150+</span><p>active volunteers</p></div>
      <div><span class="num" data-count="95"   data-suffix="%">95%</span><p>literacy growth</p></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:44px">
      <span class="eyebrow">What we believe</span>
      <h2 class="h2">Our values in everything we do</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card"><div class="icon" aria-hidden="true">💛</div><h3>Compassion</h3><p>We see each child first, then the curriculum. Kindness is our baseline.</p></article>
      <article class="card"><div class="icon" aria-hidden="true">🎨</div><h3>Creativity</h3><p>Hands-on learning through art, play and curiosity — never just worksheets.</p></article>
      <article class="card"><div class="icon" aria-hidden="true">🏘️</div><h3>Community</h3><p>Real change grows from local roots. We partner with families and neighbourhoods.</p></article>
    </div>
  </div>
</section>

<section class="sec sand">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:44px">
      <span class="eyebrow">Programs</span>
      <h2 class="h2">What we offer</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card photo">
        <div class="ph" data-slot="literacy" role="img" aria-label="Literacy &amp; numeracy illustration" style="--t1:#fde6dc;--t2:#ffe9b8"><span aria-hidden="true">📚</span></div>
        <div class="body"><h3>Literacy &amp; numeracy</h3><p>Individualised reading support and math through games.</p></div>
      </article>
      <article class="card photo">
        <div class="ph" data-slot="arts" role="img" aria-label="Creative arts illustration" style="--t1:#e3f3f0;--t2:#fde6dc"><span aria-hidden="true">🎨</span></div>
        <div class="body"><h3>Creative arts</h3><p>Drama, painting, music — expression as part of learning.</p></div>
      </article>
      <article class="card photo">
        <div class="ph" data-slot="lifeskills" role="img" aria-label="Life skills illustration" style="--t1:#fff0cc;--t2:#e3f3f0"><span aria-hidden="true">🌱</span></div>
        <div class="body"><h3>Life skills</h3><p>Problem-solving, teamwork, emotional awareness.</p></div>
      </article>
    </div>
    <p class="center" style="margin-top:36px"><a class="hm-btn ghost" href="programs.php">View all programs →</a></p>
  </div>
</section>

<section class="sec band">
  <div class="hm-wrap" data-r>
    <h2 class="h2" style="color:#fff">Your gift creates ripples</h2>
    <p>R200 provides school supplies for one child for a month. R100 funds a full learning kit for three children.</p>
    <p style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a class="hm-btn light" href="donate.php">Give once</a>
      <a class="hm-btn line"  href="donate.php">Give by card</a>
    </p>
  </div>
</section>

</main>

<?php require SRC_PATH . '/includes/footer.php'; ?>
<?php require SRC_PATH . '/includes/scripts.php'; ?>
</body>
</html>
