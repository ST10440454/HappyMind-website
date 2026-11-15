/**
 * Happy Minds — Donate page (PayFast)
 *
 * Flow (same as the Android app):
 *   1. HMAuth.startPayment() asks the Cloudflare Worker for a PENDING donation + signed PayFast URL.
 *   2. We send the browser to PayFast, where the card is typed. Card data never touches this site.
 *   3. PayFast sends the donor back here (?payment=success|cancelled&donation=<id>) and, separately,
 *      notifies the Worker, which marks the donation COMPLETE in Firestore.
 *   4. Back on this page we watch donations/<id>.status, so the result shown is the confirmed one.
 */
(() => {
  const $ = id => document.getElementById(id);
  const STATUS_LABEL = {
    COMPLETE:  ['Paid',      'badge-green-sm'],
    PENDING:   ['Pending',   'badge-blue-sm'],
    FAILED:    ['Failed',    'badge-red-sm'],
    CANCELLED: ['Cancelled', 'badge-red-sm'],
  };
  let stopWatching = null;
  let pendingTimer = null;

  /* ── Payment method tabs ── */
  window.switchPayTab = function (tab) {
    $('pane-card').hidden = tab !== 'card';
    $('pane-eft').hidden  = tab !== 'eft';
    $('tab-card').classList.toggle('active', tab === 'card');
    $('tab-eft').classList.toggle('active',  tab === 'eft');
    $('tab-card').setAttribute('aria-selected', tab === 'card');
    $('tab-eft').setAttribute('aria-selected',  tab === 'eft');
  };

  $('donorName')?.addEventListener('input', function () {
    $('eftRef').textContent = this.value || 'Your full name';
  });

  /* ── Messages ── */
  function showDonateError(msg) {
    const fb = $('donateFeedback');
    fb.textContent = msg;
    fb.style.cssText = 'background:#fdecea;color:#8c1f1f;border-radius:12px;padding:12px 16px;font-size:.88rem;margin-top:12px';
    fb.hidden = false;
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function showDonateInfo(msg) {
    const fb = $('donateFeedback');
    fb.textContent = msg;
    fb.style.cssText = 'background:#e8f0fe;color:#1a4dad;border-radius:12px;padding:12px 16px;font-size:.88rem;margin-top:12px';
    fb.hidden = false;
  }

  /** kind: 'success' | 'pending' | 'problem' */
  function showResult(kind, icon, title, msg) {
    const box = $('resultBox');
    box.className = `result-box show ${kind === 'success' ? '' : kind}`.trim();
    $('resultIcon').textContent  = icon;
    $('resultTitle').textContent = title;
    $('resultMsg').textContent   = msg;
    $('donateForm').style.display = 'none';
    $('donorBanner').style.display = 'none';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function endWatching() {
    if (stopWatching) { stopWatching(); stopWatching = null; }
    clearTimeout(pendingTimer);
  }

  /* ── Donation history (signed-in users) ── */
  async function renderHistory() {
    const section = $('historySection');
    if (!HMAuth.isLoggedIn()) { section.style.display = 'none'; return; }
    section.style.display = '';

    const history = await HMAuth.getDonationsForUser();
    const tbody = $('historyBody'), empty = $('historyEmpty');
    tbody.textContent = '';
    if (!history.length) { empty.style.display = ''; return; }
    empty.style.display = 'none';

    const fmtDate = d => d.getTime() ? d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    for (const d of history) {
      const tr = document.createElement('tr');
      const dateTd = document.createElement('td'); dateTd.textContent = fmtDate(d.date);
      const amtTd = document.createElement('td');
      amtTd.style.cssText = 'font-weight:700;color:#d94a2b';
      amtTd.textContent = 'R' + d.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const stTd = document.createElement('td');
      const [label, cls] = STATUS_LABEL[d.status] || [d.status, 'badge-blue-sm'];
      const badge = document.createElement('span'); badge.className = cls; badge.textContent = label;
      stTd.appendChild(badge);
      tr.append(dateTd, amtTd, stTd);
      tbody.appendChild(tr);
    }
  }

  /* ── Coming back from PayFast ── */
  async function handleReturn() {
    const params = new URLSearchParams(location.search);
    const payment = params.get('payment');
    const donationId = params.get('donation') || '';
    if (!payment) return;
    history.replaceState(null, '', location.pathname);   // a refresh must not replay this message

    if (payment === 'cancelled') {
      showResult('problem', '↩️', 'Payment cancelled', 'No money was taken. You can try again whenever you are ready.');
      return;
    }
    if (payment !== 'success') return;

    const signedIn = HMAuth.isLoggedIn();
    if (!signedIn || !/^[A-Za-z0-9]{8,64}$/.test(donationId)) {
      showResult('pending', '⏳', 'Thanks — we are confirming your payment',
        signedIn ? 'It will appear in your donation history below once PayFast confirms it.'
                 : 'Sign in to see its status in your donation history.');
      return;
    }

    showResult('pending', '⏳', 'Confirming your payment…', 'PayFast is confirming your payment with us. This usually takes a few seconds.');
    pendingTimer = setTimeout(() => {
      $('resultMsg').textContent = 'This is taking longer than usual. You do not need to pay again; it will show as Paid in your donation history once PayFast confirms it.';
    }, 45000);

    stopWatching = await HMAuth.watchDonation(donationId, status => {
      if (status === 'COMPLETE') {
        endWatching();
        showResult('success', '🎉', 'Thank you for your donation! 💛', 'Your payment has been confirmed. Every rand goes straight to our programs.');
        renderHistory();
      } else if (status === 'FAILED' || status === 'CANCELLED') {
        endWatching();
        showResult('problem', '⚠️', 'The payment was not completed', 'No money was taken. You can try again below.');
        renderHistory();
      }
    }, () => {
      endWatching();
      showResult('pending', '⏳', 'We could not check your payment just now', 'Please look at your donation history below in a minute. It will show as Paid once PayFast confirms it.');
    });
  }

  /* ── Donate again ── */
  $('donateAgainBtn').addEventListener('click', () => {
    endWatching();
    $('resultBox').className = 'result-box';
    $('donateForm').style.display = '';
    $('donorBanner').style.display = HMAuth.isLoggedIn() ? 'none' : '';
    $('donateFeedback').hidden = true;
    setSubmitting(false);
    window.switchPayTab('card');
  });

  function setSubmitting(on) {
    const btn = $('submitBtn');
    btn.classList.toggle('loading', on);
    btn.disabled = on;
  }

  /* ── Submit: start the PayFast payment ── */
  $('donateForm').addEventListener('submit', async e => {
    e.preventDefault();
    if ($('pane-card').hidden) return;                 // EFT tab is information only
    $('donateFeedback').hidden = true;

    if (!HMAuth.isLoggedIn()) {
      showDonateError('Please sign in with your approved Happy Minds account to donate by card.');
      openAuthModal('login');
      return;
    }

    const f = e.target;
    setSubmitting(true);
    const result = await HMAuth.startPayment({
      amount:   f.elements['amount'].value,
      fullName: f.elements['name'].value,
      email:    f.elements['email'].value,
      method:   f.elements['cardType'].value,          // 'cc' or 'dc'
    });

    if (!result.ok) {
      showDonateError(result.error);
      setSubmitting(false);
      return;
    }
    showDonateInfo('Taking you to PayFast’s secure payment page…');
    window.location.assign(result.url);
  });

  // Coming back with the browser's Back button from PayFast: let the donor try again.
  window.addEventListener('pageshow', ev => { if (ev.persisted) setSubmitting(false); });

  /* ── Init (wait until we know who is signed in) ── */
  window.switchPayTab('card');
  HMAuth.ready.then(async () => {
    $('bannerLoginLink').addEventListener('click',    () => openAuthModal('login'));
    $('bannerRegisterLink').addEventListener('click', () => openAuthModal('register'));

    const user = HMAuth.currentUser();
    if (user) {
      $('donorBanner').style.display = 'none';
      $('donorName').value  = user.name;
      $('donorEmail').value = user.email;
      $('eftRef').textContent = user.name;
    }
    await renderHistory();
    await handleReturn();
  });
})();
