<?php
require __DIR__ . '/../src/bootstrap.php';
$pageTitle       = 'Contact — Happy Minds';
$pageDescription = 'Get in touch with Happy Minds in Pretoria: address, phone, email, office hours and a message form.';
$currentPage     = 'contact';
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
    <h1 data-r>Contact Us</h1>
    <p data-r style="--i:1">We'd love to hear from you — whether it's a question, an idea, or just to say hello</p>
  </div>
</section>

<section class="sec">
  <div class="hm-wrap split" style="align-items:start">

    <div class="grid" data-stagger>
      <div class="card"><h3>📍 Visit us</h3><p>303 Mohale Street, Pretoria, South Africa</p></div>
      <div class="card"><h3>📞 Call us</h3><p>+27 12 957 4266</p></div>
      <div class="card"><h3>✉️ Email</h3><p>Inquire@happyminds.org<br>volunteer@happyminds.org</p></div>
      <div class="card"><h3>🕘 Office hours</h3><p>Monday – Friday: 9am – 6pm<br>Saturday: 10am – 4pm</p></div>
    </div>

    <div class="formcard" data-r>
      <h2 class="h2">Send a message</h2>
      <form id="contactForm">
        <div class="hm-field"><label>Full name</label><input name="name" type="text" required autocomplete="name"></div>
        <div class="hm-field"><label>Email</label><input name="email" type="email" required autocomplete="email"></div>
        <div class="hm-field">
          <label>Subject</label>
          <select name="subject">
            <option>General inquiry</option>
            <option>Volunteer</option>
            <option>Partnership</option>
            <option>Other</option>
          </select>
        </div>
        <div class="hm-field"><label>Message</label><textarea name="message" rows="4" required></textarea></div>
        <button class="hm-btn" style="width:100%;justify-content:center" type="submit">Send message</button>
        <p class="note" id="formFeedback" role="status" hidden></p>
      </form>
    </div>

  </div>
</section>

<section class="sec sand">
  <div class="hm-wrap" style="max-width:820px">
    <div class="center" style="margin-bottom:36px">
      <span class="eyebrow">Quick answers</span>
      <h2 class="h2">Frequently asked questions</h2>
    </div>
    <details class="faq" open>
      <summary>How can I enroll my child?</summary>
      <p>Visit our office during hours or email us — we'll guide you through the simple process.</p>
    </details>
    <details class="faq">
      <summary>Are your programs really free?</summary>
      <p>Yes! All programs are completely free thanks to donations and volunteers.</p>
    </details>
    <details class="faq">
      <summary>What ages do you serve?</summary>
      <p>Children ages 4–14 across three age groups: Early Learners (4–6), Primary (7–10), Junior Scholars (11–14).</p>
    </details>
  </div>
</section>

</main>

<?php require SRC_PATH . '/includes/footer.php'; ?>
<?php require SRC_PATH . '/includes/scripts.php'; ?>
</body>
</html>
