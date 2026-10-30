// peserta.js: data kehadiran dan halaman Peserta (tambah peserta, ubah status kehadiran).

const HDR = ["Hadir", "Izin", "Alpa"];
const SEEDH = { 2: { 1: "Hadir", 2: "Izin", 3: "Alpa" } };
let hadir = ld("agenda_hadir", SEEDH), pK = null, pAdd = false;
const saveH = () => { try { localStorage.setItem("agenda_hadir", JSON.stringify(hadir)) } catch (e) { } };
function pc(x) { return hadir[x.id] ? Object.keys(hadir[x.id]).length : (+x.peserta || 0) }

function peserta() {
  if (!data.some(k => k.id === pK)) pK = data[0] ? data[0].id : null;
  if (pK === null) { $("#main").innerHTML = `<h2>Peserta</h2><div class="card empty">Belum ada kegiatan. Tambahkan kegiatan di menu Kegiatan terlebih dahulu.</div>`; return }
  const h = hadir[pK] || {}, ids = AG.filter(a => a.id in h), n = s => ids.filter(a => h[a.id] === s).length, belum = AG.filter(a => !(a.id in h));
  $("#main").innerHTML = `<h2>Peserta</h2>
  <div class="row"><div style="min-width:240px;flex:1;max-width:440px"><label for="pk">Kegiatan</label><select id="pk" onchange="pK=+this.value;pAdd=false;peserta()">${data.map(k => `<option value="${k.id}" ${k.id === pK ? "selected" : ""}>${esc(k.nama)} - ${tgl(k.tanggal)}</option>`).join("")}</select></div>
   <button class="b p" onclick="pAdd=!pAdd;peserta()">Tambah peserta</button></div>
  ${pAdd ? `<div class="card" style="margin-bottom:14px;border-style:dashed"><div class="row"><h3>Pilih anggota</h3></div>${belum.length ? belum.map(a => `<label class="chk"><input type="checkbox" class="pc" value="${a.id}"> ${esc(a.nama)} <span class="mu">${esc(a.nim)}</span></label>`).join("") + `<div class="act"><button class="b" onclick="pAdd=false;peserta()">Batal</button><button class="b p" onclick="pTambah()">Tambahkan</button></div>` : `<div class="empty">Semua anggota sudah terdaftar di kegiatan ini.</div>`}</div>` : ""}
  <div class="stats">${HDR.map(s => `<div class="card stat"><span>${s}</span><b>${n(s)}</b></div>`).join("")}</div>
  <div class="card tw" style="padding:0">${ids.length ? `<table><tr><th>No</th><th>Nama</th><th>NIM</th><th>Jabatan</th><th>Kehadiran</th><th>Aksi</th></tr>${ids.map((a, i) => `<tr><td>${i + 1}</td><td>${esc(a.nama)}</td><td>${esc(a.nim)}</td><td>${esc(a.jabatan)}</td><td><select id="s${a.id}" style="width:auto" aria-label="Kehadiran ${esc(a.nama)}" onchange="hadir[pK][${a.id}]=this.value;peserta()">${opts(HDR, h[a.id])}</select></td><td><button class="lk" onclick="$('#s${a.id}').focus()">Ubah</button> | <button class="lk d" onclick="pDel(${a.id})">Hapus</button></td></tr>`).join("")}</table>` : `<div class="empty">Belum ada peserta. Klik Tambah peserta untuk memilih anggota.</div>`}</div>
  <div class="row" style="margin-top:14px"><span class="mu">Anggota yang sudah terdaftar tidak muncul lagi di daftar tambah.</span><button class="b p" onclick="saveH();toast('Kehadiran disimpan')">Simpan kehadiran</button></div>`;
}
function pTambah() {
  const c = [...document.querySelectorAll(".pc:checked")].map(x => +x.value);
  hadir[pK] = hadir[pK] || {}; c.forEach(i => hadir[pK][i] = "Hadir"); saveH(); pAdd = false;
  if (c.length) toast(c.length + " peserta ditambahkan"); peserta();
}
function pDel(id) { delete hadir[pK][id]; saveH(); toast("Peserta dihapus"); peserta() }
