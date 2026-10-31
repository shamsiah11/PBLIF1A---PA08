// Laporan

function laporan() {
  const L = [...data].sort((a, b) => a.tanggal.localeCompare(b.tanggal)), T = k => Object.values(hadir[k] || {});
  const tot = HDR.map(s => L.reduce((a, k) => a + T(k.id).filter(v => v === s).length, 0));
  $("#main").innerHTML = `<div class="row">
    <h2 style="margin:0">Laporan</h2>

    <div class="export-menu">
        <button class="b p" onclick="toggleExport()">
            Export ▼
        </button>

        <div id="exportOptions" class="export-options" hidden>
            <button onclick="exportPDF()">Export PDF</button>
            <button onclick="exportExcel()">Export Excel</button>
        </div>

        <button class="b" onclick="print()">Print</button>
    </div>
</div>
  <div class="stats"><div class="card stat"><span>Total kegiatan</span><b>${L.length}</b></div>${HDR.map((s, i) => `<div class="card stat"><span>Total ${s.toLowerCase()}</span><b>${tot[i]}</b></div>`).join("")}</div>
  <div class="card tw" style="padding:0"><table><tr><th>Kegiatan</th><th>Tanggal</th><th>Status</th><th>Peserta</th><th>Hadir</th><th>Izin</th><th>Alpa</th><th>Kehadiran</th></tr>${L.map(k => { const t = T(k.id), c = s => t.filter(v => v === s).length; return `<tr><td>${esc(k.nama)}</td><td>${tgl(k.tanggal)}</td><td><span class="tag ${k.status}">${k.status}</span></td><td>${t.length}</td><td>${c("Hadir")}</td><td>${c("Izin")}</td><td>${c("Alpa")}</td><td>${t.length ? Math.round(c("Hadir") / t.length * 100) + "%" : "-"}</td></tr>` }).join("")}</table></div>`;
}

function toggleExport() {
    const menu = document.getElementById("exportOptions");
    menu.hidden = !menu.hidden;
}

// Mengambil data laporan
function dataLaporan() {
    const L = [...data].sort(
        (a, b) => a.tanggal.localeCompare(b.tanggal)
    );

    return L.map(k => {
        const t = Object.values(hadir[k.id] || {});
        const count = s => t.filter(v => v === s).length;

        return {
            Kegiatan: k.nama,
            Tanggal: tgl(k.tanggal),
            Status: k.status,
            Peserta: t.length,
            Hadir: count("Hadir"),
            Izin: count("Izin"),
            Alpa: count("Alpa"),
            Kehadiran: t.length
                ? Math.round(count("Hadir") / t.length * 100) + "%"
                : "-"
        };
    });
}

// Export Excel
function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(dataLaporan());
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Laporan");

    XLSX.writeFile(wb, "Laporan_Kegiatan.xlsx");
}

// Export PDF
function exportPDF() {
  if (!window.jspdf) {
    alert("Library PDF belum berhasil dimuat. Periksa koneksi internet.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape" });

  const laporanData = dataLaporan();

  doc.setFontSize(16);
  doc.text("Laporan Kegiatan Organisasi", 14, 20);

  doc.autoTable({
    startY: 30,
    head: [[
      "Kegiatan", "Tanggal", "Status", "Peserta",
      "Hadir", "Izin", "Alpa", "Kehadiran"
    ]],
    body: laporanData.map(x => [
      x.Kegiatan, x.Tanggal, x.Status, x.Peserta,
      x.Hadir, x.Izin, x.Alpa, x.Kehadiran
    ]),
    styles: { fontSize: 8 }
  });

  doc.save("Laporan_Kegiatan.pdf");
}