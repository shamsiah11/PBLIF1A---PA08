// kegiatan.js: data kegiatan, halaman Kegiatan, form Tambah/Edit, simpan, hapus, dan pencarian di header.

// Daftar kategori. Kategori baru yang ditambahkan lewat form disimpan di browser (localStorage).
let KAT = (() => { try { const v = JSON.parse(localStorage.getItem("agenda_kategori")); if (Array.isArray(v) && v.length) return v } catch (e) { } return ["Rapat", "Seminar", "Sosial", "Pelatihan", "Lomba"] })();
const saveKat = () => { try { localStorage.setItem("agenda_kategori", JSON.stringify(KAT)) } catch (e) { } };
// Gabungan kategori tersimpan + kategori yang sudah dipakai kegiatan (tanpa duplikat)
const katAll = () => [...new Set([...KAT, ...data.map(d => d.kategori).filter(Boolean)])]; const STS = ["Direncanakan", "Berlangsung", "Selesai", "Batal"];
const SEED = [
  { id: 1, nama: "Rapat Anggota", kategori: "Rapat", tanggal: "2026-10-12", lokasi: "Auditorium", status: "Selesai", pic: "Abas", peserta: 30, deskripsi: "Evaluasi program kerja semester ini." },
  { id: 2, nama: "Seminar IT", kategori: "Seminar", tanggal: "2026-10-20", lokasi: "Technopreneur", status: "Selesai", pic: "Bibu", peserta: 40, deskripsi: "Seminar tren teknologi untuk mahasiswa." },
  { id: 3, nama: "Rapat Himpunan", kategori: "Rapat", tanggal: "2026-10-28", lokasi: "Depan Technopreneur", status: "Direncanakan", pic: "Abas", peserta: 12, deskripsi: "" },
  { id: 4, nama: "Bakti Sosial", kategori: "Sosial", tanggal: "2026-11-01", lokasi: "Desa", status: "Direncanakan", pic: "Cici", peserta: 6, deskripsi: "Kegiatan bakti sosial bersama warga." },
  { id: 5, nama: "Pelatihan", kategori: "Pelatihan", tanggal: "2026-11-02", lokasi: "Auditorium", status: "Direncanakan", pic: "Bibu", peserta: 0, deskripsi: "Pelatihan kepemimpinan pengurus baru." }];
let data = load(), editId = null, page = 1, F = { kategori: "", status: "", bulan: "", pic: "" }, Q = "";
function load() { try { const s = localStorage.getItem("agenda_kegiatan"); if (s) return JSON.parse(s) } catch (e) { } return SEED.map(x => ({ ...x })) }
function save() { try { localStorage.setItem("agenda_kegiatan", JSON.stringify(data)) } catch (e) { } }
function filtered() {
  const q = Q.toLowerCase();
  return data.filter(x => (!F.kategori || x.kategori === F.kategori) && (!F.status || x.status === F.status) && (!F.bulan || x.tanggal.startsWith(F.bulan)) && (!F.pic || x.pic === F.pic) && (!q || (x.nama + x.lokasi + x.pic + x.kategori).toLowerCase().includes(q))).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}
function kegiatan() {
  const L = filtered(), per = 5, pages = Math.max(1, Math.ceil(L.length / per)); page = Math.min(page, pages);
  const rows = L.slice((page - 1) * per, page * per), pics = [...new Set(data.map(x => x.pic))];
  $("#main").innerHTML = `<div class="row"><h2 style="margin:0">Data Kegiatan</h2>${isAdmin() ? `<button class="b p" onclick="go('form')">Tambah kegiatan</button>` : ""}</div>
  <div class="filters" style="margin-bottom:12px">
   <select aria-label="Kategori" onchange="F.kategori=this.value;page=1;kegiatan()">${opts(katAll(), F.kategori, "Kategori")}</select>
   <select aria-label="Status" onchange="F.status=this.value;page=1;kegiatan()">${opts(STS, F.status, "Status")}</select>
   <input type="month" aria-label="Bulan" value="${F.bulan}" onchange="F.bulan=this.value;page=1;kegiatan()">
   <select aria-label="PIC" onchange="F.pic=this.value;page=1;kegiatan()">${opts(pics, F.pic, "PIC")}</select></div>
  <div class="card tw" style="padding:0">${rows.length ? `<table><tr><th>Nama kegiatan</th><th>Kategori</th><th>Tanggal</th><th>Lokasi</th><th>PIC</th><th>Status</th>${isAdmin() ? "<th>Aksi</th>" : ""}</tr>
${rows.map(x => `<tr>
<td>
    <button class="nama-kegiatan" onclick="detailKegiatan(${x.id})">
        ${esc(x.nama)}
    </button>
</td>
<td>${esc(x.kategori)}</td>
<td>${tgl(x.tanggal)}</td>
<td>${esc(x.lokasi)}</td>
<td>${esc(x.pic)}</td>
<td><span class="tag ${x.status}">${esc(x.status)}</span></td>
  ${isAdmin() ? `<td><button class="lk" onclick="go('form',${x.id})">Edit</button> | <button class="lk d" onclick="hapus(${x.id})">Hapus</button></td>` : ""}</tr>`).join("")}</table>` : `<div class="empty">Tidak ada kegiatan yang cocok. Ubah filter untuk melihat kegiatan lain.</div>`}</div>
  <div class="pg"><button class="b" ${page < 2 ? "disabled" : ""} onclick="page--;kegiatan()">&lt;</button>
  ${Array.from({ length: pages }, (_, i) => `<button class="b ${i + 1 === page ? "on" : ""}" onclick="page=${i + 1};kegiatan()">${i + 1}</button>`).join("")}
  <button class="b" ${page >= pages ? "disabled" : ""} onclick="page++;kegiatan()">&gt;</button></div>`;
}
function detailKegiatan(id) {
    const x = data.find(d => d.id === id);
    if (!x) return;

    document.body.insertAdjacentHTML("beforeend", `
        <div class="detail-overlay" id="detailModal"
             onclick="if(event.target === this) tutupDetail()">

            <div class="detail-box">
                <div class="detail-header">
                    <h2>Detail Kegiatan</h2>
                    <button onclick="tutupDetail()">×</button>
                </div>

                <h3>${esc(x.nama)}</h3>

                <div class="detail-status">
                    <span class="tag ${x.status}">
                        ${esc(x.status)}
                    </span>
                </div>

                <h4>Deskripsi Kegiatan</h4>
                <p>${esc(x.deskripsi || "Belum ada deskripsi kegiatan.")}</p>

                <h4>Informasi Kegiatan</h4>
                <div class="detail-info">
                    <p><b>Kategori:</b> ${esc(x.kategori)}</p>
                    <p><b>Tanggal:</b> ${tgl(x.tanggal)}</p>
                    <p><b>Lokasi:</b> ${esc(x.lokasi)}</p>
                    <p><b>PIC:</b> ${esc(x.pic)}</p>
                    <p><b>Jumlah Peserta:</b> ${x.peserta}</p>
                </div>

                <button class="b p" onclick="tutupDetail()">
                    Tutup
                </button>
            </div>
        </div>
    `);
}

function tutupDetail() {
    document.getElementById("detailModal")?.remove();
}
function form() {
  const x = data.find(d => d.id === editId) || { nama: "", kategori: "Rapat", tanggal: today(), lokasi: "", status: "Direncanakan", pic: "", peserta: 0, deskripsi: "" };
  $("#main").innerHTML = `<h2>${editId ? "Edit" : "Tambah"} kegiatan</h2>
  <div class="card"><div class="grid" id="f">
   <div><label for="nama">Nama kegiatan</label><input id="nama" value="${esc(x.nama)}"></div>
      <div><label for="kategori">Kategori</label><select id="kategori" onchange="$('#kbaru').hidden=this.value!=='__baru'">${opts(katAll(), x.kategori)}<option value="__baru">+ Tambah kategori baru…</option></select>
       <input id="kbaru" hidden placeholder="Nama kategori baru" style="margin-top:8px"></div>
   <div><label for="tanggal">Tanggal</label><input id="tanggal" type="date" value="${x.tanggal}"></div>
   <div><label for="lokasi">Lokasi</label><input id="lokasi" value="${esc(x.lokasi)}"></div>
   <div><label for="status">Status</label><select id="status">${opts(STS, x.status)}</select></div>
   <div><label for="pic">PIC</label><input id="pic" value="${esc(x.pic)}"></div>
   <div><label for="peserta">Jumlah peserta</label><input id="peserta" type="number" min="0" value="${x.peserta}"></div>
   <div class="full"><label for="deskripsi">Deskripsi</label><textarea id="deskripsi" rows="5">${esc(x.deskripsi)}</textarea></div></div>
   <div id="err" class="mu" style="color:var(--er);margin-top:10px"></div>
   <div class="act"><button class="b" onclick="go('kegiatan')">Batal</button><button class="b p" onclick="simpan()">Simpan</button></div></div>`;
}
function simpan() {
  const v = k => $("#" + k).value.trim();
  const o = { nama: v("nama"), kategori: v("kategori"), tanggal: v("tanggal"), lokasi: v("lokasi"), status: v("status"), pic: v("pic"), peserta: +v("peserta") || 0, deskripsi: v("deskripsi") };
  if (o.kategori === "__baru") {
    const nk = v("kbaru");
    if (!nk) { $("#err").textContent = "Isi nama kategori baru, atau pilih kategori yang sudah ada."; return }
    const ada = katAll().find(k => k.toLowerCase() === nk.toLowerCase());
    o.kategori = ada || nk;
    if (!ada) { KAT.push(nk); saveKat() }
  }
  if (editId) { Object.assign(data.find(d => d.id === editId), o) } else { data.push({ id: Date.now(), ...o }) }
  save(); toast(editId ? "Kegiatan diperbarui" : "Kegiatan ditambahkan"); go("kegiatan");
}
function hapus(id) {
  const x = data.find(d => d.id === id);
  if (confirm(`Hapus kegiatan “${x.nama}”?`)) { data = data.filter(d => d.id !== id); delete hadir[id]; saveH(); save(); toast("Kegiatan dihapus"); kegiatan() }
}
$("#q").addEventListener("input", e => { Q = e.target.value; if (view !== "kegiatan") { view = "kegiatan"; render() } page = 1; kegiatan(); });
