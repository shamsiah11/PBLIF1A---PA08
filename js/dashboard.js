// dashboard.js: halaman Dashboard (kartu statistik dan agenda terdekat).

function dashboard() {
  const t = today(), bln = t.slice(0, 7);
  const upc = data.filter(x => x.tanggal >= t && x.status !== "Batal").sort((a, b) => a.tanggal.localeCompare(b.tanggal)).slice(0, 5);
  $("#main").innerHTML = `<h2>Dashboard</h2>
  <div class="stats">
   <div class="card stat"><span>Jumlah kegiatan bulan ini</span><b>${data.filter(x => x.tanggal.startsWith(bln)).length}</b></div>
   <div class="card stat"><span>Peserta terdaftar</span><b>${data.reduce((a, x) => a + pc(x), 0)}</b></div>
   <div class="card stat"><span>Kegiatan selesai</span><b>${data.filter(x => x.status === "Selesai").length}</b></div></div>
  <div class="card"><div class="row"><h3>Agenda terdekat</h3><button class="b" onclick="go('kegiatan')">Lihat semua</button></div>
  <div class="tw">${upc.length ? `<table><tr><th>Tanggal</th><th>Kegiatan</th><th>Lokasi</th></tr>${upc.map(x => `<tr><td>${tgl(x.tanggal)}</td><td>${esc(x.nama)}</td><td>${esc(x.lokasi)}</td></tr>`).join("")}</table>` : `<div class="empty">Belum ada agenda mendatang. Tambahkan kegiatan baru di menu Kegiatan.</div>`}</div></div>`;
}
