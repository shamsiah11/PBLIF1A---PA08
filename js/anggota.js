// anggota.js: data dan halaman Anggota (daftar, cari, tambah, edit, hapus).

const JAB = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota"];
const SEEDA = [{ id: 1, nama: "Abas Pratomo", nim: "33xxxxx01", jabatan: "Ketua", hp: "08111111111" }, { id: 2, nama: "Budi Santoso", nim: "33xxxxx02", jabatan: "Sekretaris", hp: "08222222222" }, { id: 3, nama: "Cici Lestari", nim: "33xxxxx03", jabatan: "Anggota", hp: "08333333333" }, { id: 4, nama: "Dedi Kurnia", nim: "33xxxxx04", jabatan: "Bendahara", hp: "" }];
let AG = ld("agenda_anggota", SEEDA), aQ = "", aJ = "", aEdit = null;
const saveA = () => { try { localStorage.setItem("agenda_anggota", JSON.stringify(AG)) } catch (e) { } };

function anggota() {
  const e = AG.find(a => a.id === aEdit) || { nama: "", nim: "", jabatan: "", hp: "" };
  $("#main").innerHTML = `<h2>Anggota</h2>
  <div class="filters" style="margin-bottom:12px"><input style="flex:1;min-width:180px" aria-label="Cari anggota" placeholder="Cari nama / NIM" value="${esc(aQ)}" oninput="aQ=this.value;aList()">
   <select aria-label="Jabatan" onchange="aJ=this.value;aList()">${opts(JAB, aJ, "Semua jabatan")}</select>
   <button class="b p" onclick="aEdit=null;anggota();$('#an').focus()">Tambah anggota</button></div>
  <div class="card tw" style="padding:0" id="al"></div>
  <div class="card" style="margin-top:16px;border-style:dashed"><div class="row"><h3>${aEdit ? "Edit" : "Tambah"} anggota</h3></div>
   <div class="grid">
    <div><label for="an">Nama lengkap</label><input id="an" value="${esc(e.nama)}" placeholder="Nama lengkap"></div>
    <div><label for="ani">NIM</label><input id="ani" value="${esc(e.nim)}" placeholder="Contoh: 33xxxxx01"></div>
    <div><label for="ajb">Jabatan</label><select id="ajb">${opts(JAB, e.jabatan, "Pilih jabatan")}</select></div>
    <div><label for="ahp">No. HP</label><input id="ahp" value="${esc(e.hp)}" placeholder="Contoh: 08xx"></div></div>
   <div id="aerr" class="mu" style="color:var(--er);margin-top:10px"></div>
   <div class="act"><button class="b" onclick="aEdit=null;anggota()">Batal</button><button class="b p" onclick="aSave()">Simpan</button></div></div>`;
  aList();
}
function aList() {
  const q = aQ.toLowerCase(), L = AG.filter(a => (!aJ || a.jabatan === aJ) && (!q || (a.nama + a.nim).toLowerCase().includes(q)));
  $("#al").innerHTML = L.length ? `<table><tr><th>Nama</th><th>Jabatan</th><th>No. HP</th><th>Aksi</th></tr>${L.map(a => `<tr><td>${esc(a.nama)}<br><span class="mu">${esc(a.nim)}</span></td><td>${esc(a.jabatan)}</td><td>${esc(a.hp) || "-"}</td><td><button class="lk" onclick="aEdit=${a.id};anggota();$('#an').focus()">Edit</button> | <button class="lk d" onclick="aDel(${a.id})">Hapus</button></td></tr>`).join("")}</table>` : `<div class="empty">Anggota tidak ditemukan. Ubah pencarian atau tambahkan anggota baru.</div>`;
}
function aSave() {
  const v = k => $("#" + k).value.trim(), o = { nama: v("an"), nim: v("ani"), jabatan: v("ajb"), hp: v("ahp") };
  if (!o.nama || !o.nim || !o.jabatan) { $("#aerr").textContent = "Isi nama lengkap, NIM, dan jabatan sebelum menyimpan."; return }
  if (AG.some(a => a.nim === o.nim && a.id !== aEdit)) { $("#aerr").textContent = "NIM sudah terdaftar. Periksa kembali NIM yang dimasukkan."; return }
  if (aEdit) Object.assign(AG.find(a => a.id === aEdit), o); else AG.push({ id: Date.now(), ...o });
  saveA(); toast(aEdit ? "Anggota diperbarui" : "Anggota ditambahkan"); aEdit = null; anggota();
}
function aDel(id) {
  const a = AG.find(x => x.id === id);
  if (confirm(`Hapus anggota “${a.nama}”?`)) { AG = AG.filter(x => x.id !== id); Object.values(hadir).forEach(o => delete o[id]); saveA(); saveH(); toast("Anggota dihapus"); anggota() }
}
