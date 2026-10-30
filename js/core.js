// core.js: bagian inti yang dipakai semua halaman (peran, menu, fungsi bantu, pindah halaman).
// File ini harus dimuat PALING PERTAMA di index.html.

let ROLE = "admin";                       // peran yang sedang login: "admin" atau "user"
const isAdmin = () => ROLE === "admin";
const HALAMAN_USER = ["dashboard", "kegiatan"];   // halaman yang boleh dibuka user biasa
const MENU = [["dashboard", "Dashboard"], ["kegiatan", "Kegiatan"], ["anggota", "Anggota"], ["peserta", "Peserta"], ["laporan", "Laporan"]];
let view = "dashboard";                 // halaman yang sedang dibuka

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tgl = d => { const [y, m, dd] = d.split("-"); return `${dd}/${m}/${y}` };
const today = () => new Date().toISOString().slice(0, 10);
function toast(t) { const e = $("#toast"); e.textContent = t; e.className = "s"; setTimeout(() => e.className = "", 2200) }
function opts(a, v, ph) { return (ph ? `<option value="">${ph}</option>` : "") + a.map(o => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("") }
function ld(k, s) { try { const v = localStorage.getItem(k); if (v) return JSON.parse(v) } catch (e) { } return JSON.parse(JSON.stringify(s)) }

function go(v, id = null) { if (!isAdmin() && !HALAMAN_USER.includes(v)) v = "dashboard"; view = v; editId = id; page = 1; pAdd = false; aEdit = null; render() }

function render() {
  $("#nav").innerHTML = MENU.filter(m => isAdmin() || HALAMAN_USER.includes(m[0])).map(([k, l]) => `<button class="${(view === k || (view === "form" && k === "kegiatan")) ? "on" : ""}" onclick="go('${k}')">${l}</button>`).join("");
  ({ dashboard, kegiatan, form, anggota, peserta, laporan }[view] || kosong)();
}
function kosong() {
  const m = MENU.find(m => m[0] === view)[1];
  $("#main").innerHTML = `<h2>${m}</h2><div class="card empty">Halaman ${m} belum tersedia. Mulai dari menu Kegiatan untuk mengelola agenda.</div>`;
}
