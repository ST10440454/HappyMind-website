/**
 * Happy Minds — Auth Modal (Login / Register)
 * ─────────────────────────────────────────────
 * Requires auth.js to be loaded first.
 * Usage from any page: openAuthModal('login') | openAuthModal('register')
 *
 * FIX NOTE: All handlers use addEventListener — no inline onsubmit/onclick
 * in injected HTML, which caused silent failures in strict-mode browsers.
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════
     1. STYLES
  ══════════════════════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
    .hm-modal-overlay {
      position: fixed; inset: 0; z-index: 9000;
      background: rgba(30,42,47,.6);
      backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; transition: opacity .25s ease;
      pointer-events: none;
    }
    .hm-modal-overlay.hm-open {
      opacity: 1; pointer-events: all;
    }
    .hm-modal-box {
      background: #fefcf8; border-radius: 28px;
      width: 100%; max-width: 440px;
      box-shadow: 0 28px 70px rgba(30,42,47,.24);
      overflow: hidden;
      transform: translateY(22px) scale(.96);
      transition: transform .3s cubic-bezier(.2,.7,.2,1);
    }
    .hm-modal-overlay.hm-open .hm-modal-box {
      transform: none;
    }

    /* Header */
    .hm-modal-hd {
      background: linear-gradient(135deg, #1e2a2f 0%, #2d4a44 100%);
      padding: 26px 28px 22px; position: relative;
    }
    .hm-modal-logo { font: 600 1.25rem 'Playfair Display',serif; color: #ede3d4; }
    .hm-modal-sub  { font-size: .84rem; color: #9aada8; margin-top: 2px; }
    .hm-modal-x {
      position: absolute; top: 14px; right: 16px;
      width: 30px; height: 30px; border-radius: 50%;
      background: rgba(255,255,255,.12); border: none; color: #fff;
      font-size: 1.1rem; cursor: pointer; line-height: 1;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s;
    }
    .hm-modal-x:hover { background: rgba(255,255,255,.26); }

    /* Tabs */
    .hm-modal-tabs {
      display: flex; border-bottom: 2px solid #f0e8df;
      margin-bottom: 20px;
    }
    .hm-modal-tab {
      flex: 1; padding: 11px 8px; border: none; background: none;
      font: 600 .88rem Inter,sans-serif; color: #9aada8; cursor: pointer;
      border-bottom: 3px solid transparent; margin-bottom: -2px;
      transition: color .2s, border-color .2s;
    }
    .hm-modal-tab.hm-active { color: #d94a2b; border-bottom-color: #d94a2b; }

    /* Body */
    .hm-modal-bd { padding: 24px 28px 28px; }

    /* Fields */
    .hm-mfield { margin-bottom: 14px; }
    .hm-mfield label {
      display: block; font-size: .82rem; font-weight: 600;
      color: #2c423f; margin-bottom: 5px;
    }
    .hm-mfield input {
      width: 100%; padding: 12px 14px;
      border: 1.5px solid #dccfbb; border-radius: 12px;
      font-family: Inter,sans-serif; font-size: .93rem;
      background: #fffdf9; color: #1e2a2f;
      transition: border-color .2s, box-shadow .2s;
      box-sizing: border-box;
    }
    .hm-mfield input:focus {
      outline: none; border-color: #d94a2b;
      box-shadow: 0 0 0 3px rgba(217,74,43,.18);
    }
    .hm-pw-row { position: relative; }
    .hm-pw-eye {
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      color: #9aada8; font-size: .78rem;
      font-family: inherit; cursor: pointer; padding: 2px 4px;
    }

    /* Submit */
    .hm-modal-btn {
      width: 100%; background: #d94a2b; color: #fff;
      border: none; padding: 13px; border-radius: 40px;
      font: 600 .95rem Inter,sans-serif; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background .2s, transform .1s; margin-top: 6px;
    }
    .hm-modal-btn:hover { background: #b83a1f; }
    .hm-modal-btn:active { transform: scale(.98); }
    .hm-modal-btn:disabled { background: #d4b8a8; cursor: not-allowed; transform: none; }
    .hm-btn-spin {
      display: none; width: 18px; height: 18px;
      border: 2.5px solid rgba(255,255,255,.4);
      border-top-color: #fff; border-radius: 50%;
      animation: hm-spin .7s linear infinite;
    }
    .hm-modal-btn.hm-loading .hm-btn-lbl { display: none; }
    .hm-modal-btn.hm-loading .hm-btn-spin { display: block; }
    @keyframes hm-spin { to { transform: rotate(360deg); } }

    /* Error */
    .hm-modal-err {
      background: #fdecea; color: #8c1f1f;
      border-radius: 10px; padding: 10px 14px;
      font-size: .82rem; margin-bottom: 14px; display: none;
    }
    .hm-modal-err.hm-visible { display: block; }

    /* Google button */
    .hm-google-btn {
      width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
      background: #fff; color: #2c423f; border: 1.5px solid #d8e0dd;
      padding: 11px; border-radius: 40px; cursor: pointer;
      font: 600 .93rem Inter,sans-serif; transition: background .15s, border-color .15s;
    }
    .hm-google-btn:hover { background: #f6f8f7; border-color: #b9c6c1; }
    .hm-google-btn:disabled { opacity: .6; cursor: not-allowed; }
    .hm-or {
      display: flex; align-items: center; gap: 12px; margin: 16px 0 14px;
      color: #9aada8; font-size: .78rem; text-transform: uppercase; letter-spacing: .06em;
    }
    .hm-or::before, .hm-or::after { content: ''; flex: 1; height: 1px; background: #e3eae7; }

    .hm-modal-info {
      background: #e6f4ec; color: #1f6b3e;
      border-radius: 10px; padding: 10px 14px;
      font-size: .82rem; margin-bottom: 14px; display: none;
    }
    .hm-modal-info.hm-visible { display: block; }
    .hm-forgot {
      background: none; border: none; padding: 0; margin: -4px 0 12px;
      color: #d94a2b; font: 600 .8rem Inter,sans-serif; cursor: pointer; text-decoration: underline;
    }

    /* Success panel */
    .hm-modal-ok {
      text-align: center; padding: 12px 0 6px; display: none;
    }
    .hm-modal-ok.hm-visible { display: block; }
    .hm-modal-ok .ok-em  { font-size: 2.6rem; margin-bottom: 10px; }
    .hm-modal-ok h4 { font: 600 1.2rem 'Playfair Display',serif; color: #1e2a2f; margin-bottom: 6px; }
    .hm-modal-ok p  { font-size: .88rem; color: #4a5b56; }

    @media(max-width:460px) {
      .hm-modal-bd { padding: 20px 18px 24px; }
      .hm-modal-hd { padding: 20px 18px 18px; }
    }
  `;
  document.head.appendChild(style);

  /* ══════════════════════════════════════════════
     2. BUILD DOM  (no inline event attributes)
  ══════════════════════════════════════════════ */
  const overlay = document.createElement('div');
  overlay.id        = 'hmAuthOverlay';
  overlay.className = 'hm-modal-overlay';
  overlay.setAttribute('role',       'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Sign in or register');

  overlay.innerHTML = `
    <div class="hm-modal-box" id="hmModalBox">

      <div class="hm-modal-hd">
        <button class="hm-modal-x" id="hmModalX" aria-label="Close dialog">✕</button>
        <div class="hm-modal-logo">♥ Happy Minds</div>
        <div class="hm-modal-sub" id="hmModalSub">Your account</div>
      </div>

      <div class="hm-modal-bd">
        <div class="hm-modal-tabs">
          <button class="hm-modal-tab hm-active" id="hmTabLogin"    type="button">Sign in</button>
          <button class="hm-modal-tab"            id="hmTabRegister" type="button">Create account</button>
        </div>

        <div class="hm-modal-err" id="hmModalErr" role="alert" aria-live="polite"></div>
        <div class="hm-modal-info" id="hmModalInfo" role="status" aria-live="polite"></div>
        <div class="hm-modal-ok"  id="hmModalOk">
          <div class="ok-em">🎉</div>
          <h4 id="hmOkTitle"></h4>
          <p  id="hmOkBody"></p>
        </div>

        <!-- ── GOOGLE ── -->
        <div id="hmGoogleWrap">
          <button type="button" class="hm-google-btn" id="hmGoogleBtn">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            <span>Continue with Google</span>
          </button>
          <div class="hm-or"><span>or use your email</span></div>
        </div>

        <!-- ── LOGIN FORM ── -->
        <form id="hmLoginForm" novalidate>
          <div class="hm-mfield">
            <label for="hmLEmail">Email address</label>
            <input id="hmLEmail" type="email" required placeholder="you@example.com" autocomplete="email">
          </div>
          <div class="hm-mfield">
            <label for="hmLPass">Password</label>
            <div class="hm-pw-row">
              <input id="hmLPass" type="password" required placeholder="••••••••" autocomplete="current-password">
              <button type="button" class="hm-pw-eye" data-target="hmLPass">Show</button>
            </div>
          </div>
          <button type="button" class="hm-forgot" id="hmForgot">Forgot password?</button>
          <button type="submit" class="hm-modal-btn" id="hmLoginBtn">
            <span class="hm-btn-lbl">Sign in</span>
            <span class="hm-btn-spin"></span>
          </button>
        </form>

        <!-- ── REGISTER FORM ── -->
        <form id="hmRegisterForm" novalidate style="display:none">
          <div class="hm-mfield">
            <label for="hmRName">Full name</label>
            <input id="hmRName" type="text" required placeholder="Kelebogile Nkosi" autocomplete="name">
          </div>
          <div class="hm-mfield">
            <label for="hmREmail">Email address</label>
            <input id="hmREmail" type="email" required placeholder="you@example.com" autocomplete="email">
          </div>
          <div class="hm-mfield">
            <label for="hmRPass">Password</label>
            <div class="hm-pw-row">
              <input id="hmRPass" type="password" required minlength="6" placeholder="Minimum 6 characters" autocomplete="new-password">
              <button type="button" class="hm-pw-eye" data-target="hmRPass">Show</button>
            </div>
          </div>
          <div class="hm-mfield">
            <label for="hmRPass2">Confirm password</label>
            <div class="hm-pw-row">
              <input id="hmRPass2" type="password" required placeholder="Repeat password" autocomplete="new-password">
              <button type="button" class="hm-pw-eye" data-target="hmRPass2">Show</button>
            </div>
          </div>
          <button type="submit" class="hm-modal-btn" id="hmRegisterBtn">
            <span class="hm-btn-lbl">Create account</span>
            <span class="hm-btn-spin"></span>
          </button>
        </form>

      </div><!-- /bd -->
    </div><!-- /box -->
  `;

  document.body.appendChild(overlay);

  /* ══════════════════════════════════════════════
     3. ELEMENT REFERENCES
  ══════════════════════════════════════════════ */
  const $ = id => document.getElementById(id);

  const els = {
    overlay,
    box:         $('hmModalBox'),
    sub:         $('hmModalSub'),
    tabLogin:    $('hmTabLogin'),
    tabRegister: $('hmTabRegister'),
    err:         $('hmModalErr'),
    info:        $('hmModalInfo'),
    ok:          $('hmModalOk'),
    okTitle:     $('hmOkTitle'),
    okBody:      $('hmOkBody'),
    loginForm:   $('hmLoginForm'),
    regForm:     $('hmRegisterForm'),
    lEmail:      $('hmLEmail'),
    lPass:       $('hmLPass'),
    rName:       $('hmRName'),
    rEmail:      $('hmREmail'),
    rPass:       $('hmRPass'),
    rPass2:      $('hmRPass2'),
    googleWrap:  $('hmGoogleWrap'),
    googleBtn:   $('hmGoogleBtn'),
    loginBtn:    $('hmLoginBtn'),
    registerBtn: $('hmRegisterBtn'),
  };

  /* ══════════════════════════════════════════════
     4. HELPERS
  ══════════════════════════════════════════════ */
  function showErr(msg) {
    els.err.textContent = msg;
    els.err.classList.add('hm-visible');
  }
  function clearErr() {
    els.err.textContent = '';
    els.err.classList.remove('hm-visible');
    els.info.textContent = '';
    els.info.classList.remove('hm-visible');
  }
  function showInfo(msg) {
    clearErr();
    els.info.textContent = msg;
    els.info.classList.add('hm-visible');
  }
  function showOk(title, body) {
    els.loginForm.style.display  = 'none';
    els.regForm.style.display    = 'none';
    els.googleWrap.style.display = 'none';
    clearErr();
    els.okTitle.textContent = title;
    els.okBody.textContent  = body;
    els.ok.classList.add('hm-visible');
  }
  function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.classList.toggle('hm-loading', loading);
  }

  /* ══════════════════════════════════════════════
     5. TAB SWITCHING
  ══════════════════════════════════════════════ */
  function switchTab(tab) {
    const isLogin = tab === 'login';
    els.loginForm.style.display = isLogin ? ''     : 'none';
    els.regForm.style.display   = isLogin ? 'none' : '';
    els.googleWrap.style.display = '';
    els.tabLogin.classList.toggle('hm-active',    isLogin);
    els.tabRegister.classList.toggle('hm-active', !isLogin);
    els.sub.textContent = isLogin ? 'Sign in to your account' : 'Create a free account';
    els.ok.classList.remove('hm-visible');
    clearErr();
  }

  els.tabLogin.addEventListener('click',    () => switchTab('login'));
  els.tabRegister.addEventListener('click', () => switchTab('register'));

  /* ══════════════════════════════════════════════
     6. PASSWORD SHOW / HIDE
  ══════════════════════════════════════════════ */
  overlay.addEventListener('click', e => {
    if (!e.target.classList.contains('hm-pw-eye')) return;
    const inp = $(e.target.dataset.target);
    if (!inp) return;
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    e.target.textContent = show ? 'Hide' : 'Show';
  });

  /* Forgot password (same behaviour as the app) */
  $('hmForgot').addEventListener('click', async () => {
    const email = els.lEmail.value.trim();
    if (!email) { showErr('Enter your email above, then click Forgot password.'); els.lEmail.focus(); return; }
    const result = await HMAuth.sendPasswordReset(email);
    if (result.ok) showInfo('If an account exists, a reset email has been sent.');
    else showErr(result.error);
  });

  /* ══════════════════════════════════════════════
     7. LOGIN SUBMIT
  ══════════════════════════════════════════════ */
  els.loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearErr();

    const email    = els.lEmail.value.trim();
    const password = els.lPass.value;

    if (!email)    { showErr('Please enter your email address.'); els.lEmail.focus(); return; }
    if (!password) { showErr('Please enter your password.');      els.lPass.focus();  return; }

    setLoading(els.loginBtn, true);

    try {
      const result = await Promise.resolve(HMAuth.login({ email, password }));
      if (!result.ok) {
        showErr(result.error);
      } else {
        showOk(
          `Welcome back, ${result.user.name.split(' ')[0]}!`,
          'You are now signed in. Refreshing…'
        );
        setTimeout(() => location.reload(), 1600);
      }
    } catch (err) {
      showErr('Something went wrong. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(els.loginBtn, false);
    }
  });

  /* ══════════════════════════════════════════════
     7b. GOOGLE SIGN-IN (works for both "Sign in" and "Create account")
  ══════════════════════════════════════════════ */
  els.googleBtn.addEventListener('click', async function () {
    clearErr();
    els.googleBtn.disabled = true;
    try {
      const result = await Promise.resolve(HMAuth.loginWithGoogle());
      if (result.cancelled) return;                         // the visitor closed the Google window
      if (!result.ok) {
        showErr(result.error);
      } else if (result.pending) {
        // New Google account: registered, but an admin must approve it before it can be used.
        showOk(
          'Registration sent!',
          'Your Google account has been registered. Please wait for admin approval, then come back and continue with Google.'
        );
      } else {
        showOk(
          `Welcome back, ${result.user.name.split(' ')[0]}!`,
          'You are now signed in. Refreshing…'
        );
        setTimeout(() => location.reload(), 1600);
      }
    } catch (err) {
      showErr('Something went wrong. Please try again.');
      console.error('Google sign-in error:', err);
    } finally {
      els.googleBtn.disabled = false;
    }
  });

  /* ══════════════════════════════════════════════
     8. REGISTER SUBMIT
  ══════════════════════════════════════════════ */
  els.regForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearErr();

    const name     = els.rName.value.trim();
    const email    = els.rEmail.value.trim();
    const password = els.rPass.value;
    const confirm  = els.rPass2.value;

    if (!name)              { showErr('Please enter your full name.');          els.rName.focus();  return; }
    if (!email)             { showErr('Please enter your email address.');      els.rEmail.focus(); return; }
    if (password.length < 6){ showErr('Password must be at least 6 characters.'); els.rPass.focus(); return; }
    if (password !== confirm){ showErr('Passwords do not match.');              els.rPass2.focus(); return; }

    setLoading(els.registerBtn, true);

    try {
      const result = await Promise.resolve(HMAuth.register({ name, email, password }));
      if (!result.ok) {
        showErr(result.error);
      } else {
        // Accounts must be approved by an admin first, so the visitor is NOT signed in yet.
        showOk(
          'Registration sent!',
          'Please wait for admin approval. Once approved, sign in here or in the Happy Minds app with the same email and password.'
        );
      }
    } catch (err) {
      showErr('Something went wrong. Please try again.');
      console.error('Register error:', err);
    } finally {
      setLoading(els.registerBtn, false);
    }
  });

  /* ══════════════════════════════════════════════
     9. CLOSE HANDLERS
  ══════════════════════════════════════════════ */
  $('hmModalX').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('hm-open')) closeModal();
  });

  function closeModal() {
    overlay.classList.remove('hm-open');
  }

  /* ══════════════════════════════════════════════
     10. PUBLIC API
  ══════════════════════════════════════════════ */
  window.openAuthModal = function (tab) {
    switchTab(tab || 'login');
    // Reset forms
    els.loginForm.reset();
    els.regForm.reset();
    els.ok.classList.remove('hm-visible');
    clearErr();
    // Show
    overlay.classList.add('hm-open');
    // Focus first field
    setTimeout(() => {
      (tab === 'register' ? els.rName : els.lEmail).focus();
    }, 120);
  };

  window.closeAuthModal = closeModal;

})();
