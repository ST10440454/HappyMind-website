<?php
require __DIR__ . '/../src/bootstrap.php';
$pageTitle       = 'Donate — Happy Minds';
$pageDescription = 'Support Happy Minds with a secure card donation through PayFast, or give by bank EFT.';
$currentPage     = ''; // "Donate" is a CTA button, not a standard nav link

/* Donate page has extra CSS for payment UI */
$extraCss = '<link rel="stylesheet" href="assets/css/donate.css">';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require SRC_PATH . '/includes/head.php'; ?>
</head>
<body>
<?php require SRC_PATH . '/includes/header.php'; ?>

<main id="main">

<section class="page-hero" style="background:linear-gradient(135deg,#d94a2b,#b83a1f);color:#fff">
  <div class="hm-wrap">
    <h1 style="color:#fff" data-r>Support Our Mission</h1>
    <p style="color:#ffe9e1" data-r>Your generosity transforms lives. 100% of donations go directly to our programs.</p>
  </div>
</section>

<!-- Amount selector -->
<section class="sec">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:36px">
      <span class="eyebrow">Step 1</span>
      <h2 class="h2">Choose an amount</h2>
    </div>
    <div class="amts" data-stagger>
      <button type="button" class="amt" data-amt="50"  aria-pressed="false"><b>R50</b>School supplies<br>for 1 child/month</button>
      <button type="button" class="amt" data-amt="100" aria-pressed="false"><b>R100</b>Supports a child's<br>education for 1 month</button>
      <button type="button" class="amt" data-amt="250" aria-pressed="false"><b>R250</b>Learning kit<br>for 3 children</button>
      <button type="button" class="amt" data-amt="500" aria-pressed="false"><b>R500</b>Sponsors a child<br>for full semester</button>
    </div>

    <div class="formcard" style="max-width:640px;margin:auto" data-r>

      <!-- Payment result (shown when PayFast sends the donor back to this page) -->
      <div class="result-box" id="resultBox" role="status" aria-live="polite">
        <div class="s-icon" id="resultIcon">⏳</div>
        <h3 id="resultTitle">Confirming your payment…</h3>
        <p id="resultMsg"></p>
        <p style="margin-top:18px">
          <a class="hm-btn ghost" href="index.php">Back to home</a>
          &nbsp;
          <button type="button" class="hm-btn" id="donateAgainBtn" style="margin-top:8px">Donate again</button>
        </p>
      </div>

      <!-- Donor banner (shown when not signed in) -->
      <div class="donor-banner" id="donorBanner">
        <span>💡</span>
        <span>
          Card donations are for approved Happy Minds accounts, the same account you use in the app.
          <a id="bannerLoginLink">Sign in</a> or
          <a id="bannerRegisterLink">create an account</a>.
        </span>
      </div>

      <!-- Main donate form -->
      <form id="donateForm" autocomplete="off" novalidate>
        <div class="hm-field">
          <label for="amount">Donation amount (R)</label>
          <input id="amount" name="amount" type="number" min="10" max="50000" step="0.01" placeholder="Enter amount (R10 – R50 000)" value="100" required>
        </div>
        <div class="hm-field">
          <label for="donorName">Full name</label>
          <input id="donorName" name="name" type="text" required autocomplete="name" placeholder="e.g. Kelebogile Nkosi">
        </div>
        <div class="hm-field">
          <label for="donorEmail">Email</label>
          <input id="donorEmail" name="email" type="email" required autocomplete="email" placeholder="e.g. kelebogile@gmail.com">
        </div>

        <!-- Payment method -->
        <h3 style="font:600 1.1rem 'Playfair Display',serif;margin:22px 0 14px">Payment method</h3>
        <div class="pay-tabs" role="tablist" aria-label="Payment method">
          <button type="button" class="pay-tab active" id="tab-card" role="tab" aria-selected="true"  aria-controls="pane-card" onclick="switchPayTab('card')">
            <span class="tab-icon">💳</span>Card
          </button>
          <button type="button" class="pay-tab"        id="tab-eft"  role="tab" aria-selected="false" aria-controls="pane-eft"  onclick="switchPayTab('eft')">
            <span class="tab-icon">🏦</span>Bank&nbsp;EFT
          </button>
        </div>

        <!-- Card pane (PayFast) -->
        <div id="pane-card" role="tabpanel">
          <div class="card-type" role="radiogroup" aria-label="Card type">
            <label><input type="radio" name="cardType" value="cc" checked> Credit card</label>
            <label><input type="radio" name="cardType" value="dc"> Debit card</label>
          </div>
          <p class="pf-note">
            🔒 You'll be taken to <strong>PayFast's secure page</strong> to enter your card details.
            Happy Minds never sees or stores your card number.
          </p>
          <button class="hm-btn" id="submitBtn" style="width:100%;justify-content:center;margin-top:6px" type="submit">
            <span class="btn-label">Donate with PayFast</span>
            <span class="spinner"></span>
          </button>
          <p class="note" id="donateFeedback" role="status" hidden></p>
        </div>

        <!-- EFT pane (information only: EFT payments are not tracked on the website) -->
        <div id="pane-eft" role="tabpanel" hidden>
          <table class="eft-table">
            <tr><td>Bank</td><td>First National Bank (FNB)</td></tr>
            <tr><td>Account number</td><td>62847301956</td></tr>
            <tr><td>Branch code</td><td>250655</td></tr>
            <tr><td>Account type</td><td>Cheque / Current</td></tr>
            <tr><td>Reference</td><td id="eftRef">Your full name</td></tr>
          </table>
          <p class="pf-note">
            After paying, please
            <a href="mailto:Inquire@happyminds.org?subject=Donation%20proof%20of%20payment">email your proof of payment</a>
            so we can acknowledge your gift. EFT donations don't appear in your donation history below.
          </p>
        </div>
      </form>
    </div>
  </div>
</section>

<!-- Tax section -->
<section class="sec sand center">
  <div class="hm-wrap" data-r>
    <h2 class="h2">Tax-deductible</h2>
    <p class="lead">Happy Minds is a registered non-profit. You'll receive a receipt for tax purposes.</p>
    <p style="margin-top:8px;font-size:.88rem;color:var(--mut)">Tax ID: 12-876</p>
  </div>
</section>

<!-- Donation history (shown for signed-in users) -->
<section class="sec" id="historySection" style="display:none">
  <div class="hm-wrap">
    <div class="center" style="margin-bottom:28px">
      <span class="eyebrow">Your account</span>
      <h2 class="h2">Donation history</h2>
    </div>
    <div class="formcard" style="max-width:640px;margin:auto;padding:0;overflow:hidden">
      <div style="overflow-x:auto">
        <table class="history-table">
          <thead>
            <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody id="historyBody"></tbody>
        </table>
      </div>
      <p id="historyEmpty" style="text-align:center;padding:36px;color:#9aada8;display:none">No card donations yet — make your first gift above!</p>
    </div>
  </div>
</section>

</main>

<?php require SRC_PATH . '/includes/footer.php'; ?>

<?php $extraScripts = '<script type="module" src="assets/js/donate.js"></script>'; ?>
<?php require SRC_PATH . '/includes/scripts.php'; ?>
</body>
</html>
