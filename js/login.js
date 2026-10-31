// login.js: akun contoh, proses masuk/keluar, dan pengecekan sesi saat halaman dibuka.
// File ini harus dimuat PALING TERAKHIR karena di bagian bawahnya aplikasi langsung dijalankan.

// ===== Login (demo, hanya di sisi browser) =====
const USERS = [
  { u: "admin", p: "admin123", n: "Admin", r: "admin" },
  { u: "bem", p: "bem2026", n: "BEM", r: "admin" },
  { u: "user", p: "user123", n: "Mahasiswa", r: "user" }
];
function sesi() { try { return localStorage.getItem("agenda_sesi") || sessionStorage.getItem("agenda_sesi") } catch (e) { return null } }
// ===== Auto Logout setelah 30 menit tidak aktif =====
const BATAS_WAKTU = 30 * 60 * 1000; // 30 menit
let timerLogout;

function mulaiTimer() {
  clearTimeout(timerLogout);

  timerLogout = setTimeout(() => {
    logout(true);
  }, BATAS_WAKTU);
}

function resetTimer() {
  if (!document.body.classList.contains("out")) {
    mulaiTimer();
  }
}

// ===== Login dan Logout =====
function masuk(a) {
  ROLE = a.r;
  document.body.classList.remove("out");

  $("#uname").textContent =
    a.r === "user" ? "Mahasiswa" : a.n;

  mulaiTimer();
  go("dashboard");
}

function logout(otomatis = false) {
  clearTimeout(timerLogout);

  try {
    localStorage.removeItem("agenda_sesi");
    sessionStorage.removeItem("agenda_sesi");
  } catch (e) {}

  ROLE = "admin";
  document.body.classList.add("out");
  $("#lf").reset();

  if (otomatis) {
    $("#lerr").textContent =
      "Sesi Anda telah berakhir karena tidak ada aktivitas selama 30 menit. Silakan login kembali.";
  } else {
    $("#lerr").textContent = "";
  }

  $("#lu").focus();
}

// Deteksi aktivitas pengguna
["mousemove", "mousedown", "keydown", "click",
 "scroll", "touchstart"].forEach(event => {
  document.addEventListener(event, resetTimer);
});
if ($("#tp")) $("#tp").onclick = () => { const p = $("#lp"), s = p.type === "password"; p.type = s ? "text" : "password"; $("#tp").textContent = s ? "Sembunyikan" : "Tampilkan" };
$("#lf").addEventListener("submit", e => {
  e.preventDefault();
  const u = $("#lu").value.trim(), p = $("#lp").value, err = $("#lerr");
  if (!u || !p) { err.textContent = "Isi nama pengguna dan kata sandi."; return }
  const adm = USERS.find(x => x.r === "admin" && x.u === u.toLowerCase());
  const a = adm || { u: u, n: u, r: "user" };
  try { (($("#lr").checked) ? localStorage : sessionStorage).setItem("agenda_sesi", a.u) } catch (e) { }
  masuk(a);
});
const s0 = USERS.find(x => x.u === sesi());
if (s0) { masuk(s0) } else { document.body.classList.add("out"); render() }
