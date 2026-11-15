/**
 * Happy Minds — Header auth controls
 * Renders "Hi, Name | Sign out" or "Sign in" inside #headerAuthArea.
 * Load after auth.js and auth-modal.js.
 */
(async function () {
  const area = document.getElementById('headerAuthArea');
  if (!area) return;

  await HMAuth.ready;
  const user = HMAuth.currentUser();
  area.textContent = '';

  if (user) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:8px';

    const greeting = document.createElement('span');
    greeting.style.cssText = 'font-size:.85rem;color:#4a5b56;font-weight:500';
    greeting.textContent = `Hi, ${user.name.split(' ')[0]}`;

    const btn = document.createElement('button');
    btn.textContent = 'Sign out';
    btn.style.cssText = 'background:none;border:none;color:#d94a2b;font-weight:600;cursor:pointer;font-size:.85rem;font-family:inherit;padding:0';
    btn.addEventListener('click', async () => { await HMAuth.logout(); location.reload(); });

    wrap.append(greeting, btn);
    area.appendChild(wrap);
  } else {
    const btn = document.createElement('button');
    btn.textContent = 'Sign in';
    btn.style.cssText = 'background:none;border:none;color:#4a5b56;font-weight:600;cursor:pointer;font-size:.88rem;font-family:inherit;padding:4px 10px';
    btn.addEventListener('click', () => openAuthModal('login'));
    area.appendChild(btn);
  }
})();
