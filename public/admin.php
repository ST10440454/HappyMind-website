<?php
/**
 * admin.php — Staff portal (login + dashboard)
 * Standalone page: does NOT use the public header/footer/scripts includes.
 * Signs in with Firebase Authentication (an account listed in the admins collection)
 * and reads/writes Firestore; see assets/js/admin-portal.js.
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Happy Minds</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <style>
    /* Hide the sign-in screen until we know whether a saved admin session exists (no flash).
       The animation reveals it anyway after 4s, so a failed script can never leave a blank page. */
    body.checking #loginScreen { visibility: hidden; animation: hm-reveal 0s 4s forwards; }
    @keyframes hm-reveal { to { visibility: visible; } }
  </style>
</head>
<body class="checking">

<!-- ══════════════════════════════════════════════
     LOGIN SCREEN
════════════════════════════════════════════════ -->
<div id="loginScreen">
  <div class="login-left">
    <div class="login-left-inner">
      <span class="logo-text">Happy Minds</span>
      <p class="tagline">Education for every child.<br>This portal is for staff &amp; administrators only.</p>
      <div class="feat">
        <div class="feat-icon">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="feat-text"><strong>Volunteer management</strong><span>Review &amp; approve applications</span></div>
      </div>
      <div class="feat">
        <div class="feat-icon">
          <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
        </div>
        <div class="feat-text"><strong>Donation records</strong><span>Track every contribution</span></div>
      </div>
      <div class="feat">
        <div class="feat-icon">
          <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </div>
        <div class="feat-text"><strong>Live actions</strong><span>Approve, reject &amp; send receipts</span></div>
      </div>
    </div>
  </div>

  <div class="login-right">
    <div class="login-card">
      <p class="eyebrow">Staff portal</p>
      <h2>Welcome back</h2>
      <p class="sub">Sign in to manage volunteers and donations.</p>
      <label class="lbl">Email</label>
      <input class="linput" type="email" id="loginUser" placeholder="Enter email" autocomplete="username">
      <label class="lbl">Password</label>
      <input class="linput" type="password" id="loginPass" placeholder="••••••••" autocomplete="current-password">
      <button class="login-btn" id="loginBtn" type="button">Sign in →</button>
      <p id="loginError" role="alert">Incorrect email or password. Please try again.</p>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════
     DASHBOARD
════════════════════════════════════════════════ -->
<div id="adminDashboard">
  <div class="admin-layout">

    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <span class="logo-text">Happy Minds <span class="admin-pill">ADMIN</span></span>
      </div>

      <nav class="sidebar-nav">
        <p class="sidebar-section-label">Management</p>
        <a id="nav-users" class="active">
          <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Users</span>
          <span class="nav-badge" id="usersBadge">0</span>
        </a>
        <a id="nav-volunteers">
          <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Volunteers</span>
          <span class="nav-badge" id="pendingBadge">0</span>
        </a>
        <a id="nav-donations">
          <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          <span>Donations</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <a href="index.php">
          <svg viewBox="0 0 24 24"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          <span>Back to site</span>
        </a>
        <a href="#" id="signOutLink">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Sign out</span>
        </a>
      </div>
    </aside>

    <!-- Main content -->
    <div class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-left">
          <h1 id="pageTitle">All users</h1>
        </div>
        <div class="topbar-right">
          <span class="topbar-date" id="todayDate"></span>
          <div class="admin-user">
            <span>Admin</span>
            <div class="admin-avatar" id="adminAvatar">AD</div>
          </div>
        </div>
      </header>

      <div class="admin-content">

        <!-- USERS TAB -->
        <div id="tab-users" class="tab-panel active">
          <div class="summary-cards">
            <div class="summary-card">
              <div class="stat-icon orange"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div class="stat-body"><div class="stat-label">Total users</div><div class="stat-value" id="usr-total">0</div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon teal"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div class="stat-body"><div class="stat-label">Pending</div><div class="stat-value" id="usr-pending">0</div><div class="stat-sub" id="usr-pending-sub"></div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon green"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
              <div class="stat-body"><div class="stat-label">Approved</div><div class="stat-value" id="usr-approved">0</div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon blue"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
              <div class="stat-body"><div class="stat-label">This month</div><div class="stat-value" id="usr-month">0</div></div>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header">
              <h3>Accounts</h3>
              <div class="filter-bar">
                <input class="fselect" type="search" id="usr-search" placeholder="Search name or email" aria-label="Search users" style="min-width:190px">
                <select class="fselect" id="usr-filter">
                  <option value="all">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <select class="fselect" id="usr-type-filter">
                  <option value="all">All types</option>
                  <option value="Learner">Learners</option>
                  <option value="Volunteer">Volunteers</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Child</th><th>Type</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody id="usrTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- VOLUNTEERS TAB -->
        <div id="tab-volunteers" class="tab-panel">
          <div class="summary-cards">
            <div class="summary-card">
              <div class="stat-icon orange"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div class="stat-body"><div class="stat-label">Total</div><div class="stat-value" id="vol-total">0</div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon teal"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div class="stat-body"><div class="stat-label">Pending</div><div class="stat-value" id="vol-pending">0</div><div class="stat-sub" id="vol-pending-sub"></div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon green"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
              <div class="stat-body"><div class="stat-label">Approved</div><div class="stat-value" id="vol-approved">0</div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon blue"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
              <div class="stat-body"><div class="stat-label">This month</div><div class="stat-value" id="vol-month">0</div></div>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header">
              <h3>Applications</h3>
              <div class="filter-bar">
                <select class="fselect" id="vol-filter">
                  <option value="all">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <select class="fselect" id="vol-role-filter">
                  <option value="all">All roles</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody id="volTableBody"></tbody>
              </table>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header"><h3>Applications by role</h3></div>
            <div style="padding:20px 24px" id="roleBreakdown"></div>
          </div>
        </div>

        <!-- DONATIONS TAB -->
        <div id="tab-donations" class="tab-panel">
          <div class="summary-cards">
            <div class="summary-card">
              <div class="stat-icon orange"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
              <div class="stat-body"><div class="stat-label">Total raised</div><div class="stat-value" id="don-total">R0</div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon green"><svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
              <div class="stat-body"><div class="stat-label">This month</div><div class="stat-value" id="don-month">R0</div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon blue"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
              <div class="stat-body"><div class="stat-label">Total donors</div><div class="stat-value" id="don-count">0</div></div>
            </div>
            <div class="summary-card">
              <div class="stat-icon teal"><svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></div>
              <div class="stat-body"><div class="stat-label">Avg donation</div><div class="stat-value" id="don-avg">R0</div></div>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header">
              <h3>Donation records</h3>
              <div class="filter-bar">
                <select class="fselect" id="don-filter">
                  <option value="all">All types</option>
                  <option value="One-time">One-time</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr><th>Donor</th><th>Email</th><th>Amount</th><th>Type</th><th>Date</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody id="donTableBody"></tbody>
              </table>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header"><h3>Amount breakdown</h3></div>
            <div style="padding:20px 24px" id="donBreakdown"></div>
          </div>
        </div>

      </div><!-- /admin-content -->
    </div><!-- /admin-main -->
  </div>
</div>

<script type="module" src="assets/js/admin-portal.js"></script>
</body>
</html>