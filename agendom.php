<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Agendom</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap">

<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/dashboard.css">
<link rel="stylesheet" href="css/kegiatan.css">
<link rel="stylesheet" href="css/form.css">
<link rel="stylesheet" href="css/login.css">
<link rel="stylesheet" href="css/responsive.css">
</head>
<body>
<header>
  <!-- (hamburger) -->
<button class="burger" aria-label="Buka menu" aria-expanded="false"
  onclick="const o=document.body.classList.toggle('nav-open');this.setAttribute('aria-expanded',o)">
  <!-- Ikon 3 garis -->
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>
</button>
  <div class="logo"><img src="Agendom (1).png" alt="logo"></div>
  <h1>Agendom</h1>
  <input id="q" type="search" placeholder="Pencarian…" aria-label="Pencarian">
  <div id="usr"><span id="uname"></span><button class="b" onclick="logout()">Keluar</button></div>
</header>
<div class="layout">
  <!-- Menu sidebar -->
<nav id="nav" onclick="document.body.classList.remove('nav-open')"></nav>
  <main id="main"></main>
</div>
<section id="login" aria-label="Masuk">
  <div class="card">
<div class="logo"><img src="Agendom (1).png" alt="logo"></div>
    <h2>Masuk</h2>
    <div class="mu">Agendom</div>
    <form id="lf" novalidate>
      <div class="f"><label for="lu">Nama pengguna</label><input id="lu" autocomplete="username" autofocus></div>
      <div class="f"><label for="lp">Kata sandi</label><div class="pw"><input id="lp" type="password" autocomplete="current-password"><button type="button" id="tp" aria-label="Tampilkan kata sandi">Tampilkan</button></div></div>
      <label class="chk"><input id="lr" type="checkbox"> Ingat saya di perangkat ini</label>
      <div id="lerr" role="alert"></div>
      <button class="b p" type="submit" style="width:100%;margin-top:6px">Masuk</button>
    </form>
    <div class="hint">Akun contoh: <b>admin</b> / <b>user</b></div>
  </div>
</section>
<div id="toast" role="status"></div>

<!-- Library export data -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<script src="js/core.js"></script>
<script src="js/kegiatan.js"></script>
<script src="js/dashboard.js"></script>
<script src="js/anggota.js"></script>
<script src="js/peserta.js"></script>
<script src="js/laporan.js"></script>
<script src="js/login.js"></script>
</body>
</html>
