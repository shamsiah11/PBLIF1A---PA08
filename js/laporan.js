// laporan.js: halaman Laporan (rekap kehadiran per kegiatan dan tombol Cetak).

function laporan() {
  const L = [...data].sort((a, b) => a.tanggal.localeCompare(b.tanggal)), T = k => Object.values(hadir[k] || {});
  const tot = HDR.map(s => L.reduce((a, k) => a + T(k.id).filter(v => v === s).length, 0));
  $("#main").innerHTML = `<div class="row"><h2 style="margin:0">Laporan</h2><button class="b" onclick="print()">Cetak</button></div>
  <div class="stats"><div class="card stat"><span>Total kegiatan</span><b>${L.length}</b></div>${HDR.map((s, i) => `<div class="card stat"><span>Total ${s.toLowerCase()}</span><b>${tot[i]}</b></div>`).join("")}</div>
  <div class="card tw" style="padding:0"><table><tr><th>Kegiatan</th><th>Tanggal</th><th>Status</th><th>Peserta</th><th>Hadir</th><th>Izin</th><th>Alpa</th><th>Kehadiran</th></tr>${L.map(k => { const t = T(k.id), c = s => t.filter(v => v === s).length; return `<tr><td>${esc(k.nama)}</td><td>${tgl(k.tanggal)}</td><td><span class="tag ${k.status}">${k.status}</span></td><td>${t.length}</td><td>${c("Hadir")}</td><td>${c("Izin")}</td><td>${c("Alpa")}</td><td>${t.length ? Math.round(c("Hadir") / t.length * 100) + "%" : "-"}</td></tr>` }).join("")}</table></div>`;
}
