<?php
require __DIR__ . '/../src/bootstrap.php';
$pageTitle       = 'Get Involved — Happy Minds';
$pageDescription = 'Donate, volunteer or partner with Happy Minds to transform lives through education.';
$currentPage     = 'get-involved';
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
    <h1 data-r>Get Involved</h1>
    <p data-r style="--i:1">Join our community of changemakers and help transform lives through education</p>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap">
    <div class="grid g3" data-stagger>
      <article class="card org center">
        <div class="icon" style="margin:0 auto 16px;background:#ffffff30" aria-hidden="true">💛</div>
        <h3>Donate</h3>
        <p>Financial contributions help us provide materials and reach more children.</p>
        <p style="margin-top:20px"><a class="hm-btn light" href="donate.php">Donate now</a></p>
      </article>
      <article class="card dark center">
        <div class="icon" style="margin:0 auto 16px;background:#ffffff20" aria-hidden="true">🙌</div>
        <h3>Volunteer</h3>
        <p>Share your time and skills — teaching, mentoring, or helping events.</p>
        <p style="margin-top:20px"><a class="hm-btn line" href="#volunteer-form">Sign up</a></p>
      </article>
      <article class="card grn center">
        <div class="icon" style="margin:0 auto 16px;background:#ffffff20" aria-hidden="true">🤝</div>
        <h3>Partner</h3>
        <p>Organizations can amplify impact through corporate partnerships.</p>
        <p style="margin-top:20px"><a class="hm-btn line" href="contact.php">Contact us</a></p>
      </article>
    </div>
  </div>
</section>

<section class="sec sand">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:40px">
      <span class="eyebrow">Roles</span>
      <h2 class="h2">Volunteer opportunities</h2>
    </div>
    <div class="grid g3" data-stagger>
      <article class="card"><h3>Teaching Assistant</h3><p>Help educators with lesson delivery and student support.</p><span class="tag">4-8 hours/week</span></article>
      <article class="card"><h3>Mentor</h3><p>Provide one-on-one guidance to a student throughout the year.</p><span class="tag">2-4 hours/week</span></article>
      <article class="card"><h3>Event Coordinator</h3><p>Help organize community events and fundraisers.</p><span class="tag">Project-based</span></article>
    </div>
  </div>
</section>

<section class="sec" id="volunteer-form">
  <div class="hm-wrap" style="max-width:720px">
    <div class="formcard" data-r>
      <h2 class="h2 center">Ready to help?</h2>
      <form id="volunteerForm">
        <div class="hm-field"><label>Full name</label><input name="name" type="text" required autocomplete="name"></div>
        <div class="hm-field"><label>Email</label><input name="email" type="email" required autocomplete="email"></div>
        <div class="hm-field"><label>Phone</label><input name="phone" type="tel" autocomplete="tel"></div>
        <div class="hm-field">
          <label>How would you like to help?</label>
          <select name="role">
            <option>Teaching Assistant</option>
            <option>Mentor</option>
            <option>Event Coordinator</option>
            <option>Other</option>
          </select>
        </div>
        <div class="hm-field"><label>Anything else you'd like to share?</label><textarea name="about" rows="3"></textarea></div>
        <button class="hm-btn" style="width:100%;justify-content:center" type="submit">Submit application</button>
        <p class="note" id="volFeedback" role="status" hidden></p>
      </form>
    </div>
  </div>
</section>

</main>

<?php require SRC_PATH . '/includes/footer.php'; ?>
<?php require SRC_PATH . '/includes/scripts.php'; ?>
</body>
</html>
