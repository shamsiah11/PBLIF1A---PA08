// login.js: akun contoh, proses masuk/keluar, dan pengecekan sesi saat halaman dibuka.
// File ini harus dimuat PALING TERAKHIR karena di bagian bawahnya aplikasi langsung dijalankan.

// ===== Login (demo, hanya di sisi browser) =====
const USERS = [
  { u: "admin", p: "admin123", n: "Admin", r: "admin" },
  { u: "bem", p: "bem2026", n: "BEM", r: "admin" },
  { u: "user", p: "user123", n: "Mahasiswa", r: "user" }
];
function sesi() { try { return localStorage.getItem("agenda_sesi") || sessionStorage.getItem("agenda_sesi") } catch (e) { return null } }
function masuk(a) { ROLE = a.r; document.body.classList.remove("out"); $("#uname").textContent = a.r === "user" ? "Mahasiswa" : a.n; go("dashboard") } function logout() {
  try { localStorage.removeItem("agenda_sesi"); sessionStorage.removeItem("agenda_sesi") } catch (e) { }
  ROLE = "admin"; document.body.classList.add("out"); $("#lf").reset(); $("#lerr").textContent = ""; $("#lu").focus()
}
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
