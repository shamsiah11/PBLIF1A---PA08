const KAT=["Rapat","Seminar","Sosial","Pelatihan","Lomba"];
const STS=["Direncanakan","Berlangsung","Selesai","Batal"];
let ROLE="admin";                       // peran yang sedang login: "admin" atau "user"
const isAdmin=()=>ROLE==="admin";
const HALAMAN_USER=["dashboard","kegiatan"];   // halaman yang boleh dibuka user biasa
const MENU=[["dashboard","Dashboard"],["kegiatan","Kegiatan"],["anggota","Anggota"],["peserta","Peserta"],["laporan","Laporan"]];
const SEED=[
{id:1,nama:"Rapat Anggota",kategori:"Rapat",tanggal:"2026-10-12",lokasi:"Auditorium",status:"Selesai",pic:"Abas",peserta:30,deskripsi:"Evaluasi program kerja semester ini."},
{id:2,nama:"Seminar IT",kategori:"Seminar",tanggal:"2026-10-20",lokasi:"Technopreneur",status:"Selesai",pic:"Bibu",peserta:40,deskripsi:"Seminar tren teknologi untuk mahasiswa."},
{id:3,nama:"Rapat Himpunan",kategori:"Rapat",tanggal:"2026-10-28",lokasi:"Depan Technopreneur",status:"Direncanakan",pic:"Abas",peserta:12,deskripsi:""},
{id:4,nama:"Bakti Sosial",kategori:"Sosial",tanggal:"2026-11-01",lokasi:"Desa",status:"Direncanakan",pic:"Cici",peserta:6,deskripsi:"Kegiatan bakti sosial bersama warga."},
{id:5,nama:"Pelatihan",kategori:"Pelatihan",tanggal:"2026-11-02",lokasi:"Auditorium",status:"Direncanakan",pic:"Bibu",peserta:0,deskripsi:"Pelatihan kepemimpinan pengurus baru."}];
let data=load(),view="dashboard",editId=null,page=1,F={kategori:"",status:"",bulan:"",pic:""},Q="";
function load(){try{const s=localStorage.getItem("agenda_kegiatan");if(s)return JSON.parse(s)}catch(e){}return SEED.map(x=>({...x}))}
function save(){try{localStorage.setItem("agenda_kegiatan",JSON.stringify(data))}catch(e){}}
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const tgl=d=>{const[y,m,dd]=d.split("-");return`${dd}/${m}/${y}`};
const today=()=>new Date().toISOString().slice(0,10);
function toast(t){const e=$("#toast");e.textContent=t;e.className="s";setTimeout(()=>e.className="",2200)}
function go(v,id=null){if(!isAdmin()&&!HALAMAN_USER.includes(v))v="dashboard";view=v;editId=id;page=1;pAdd=false;aEdit=null;render()}

function render(){
  $("#nav").innerHTML=MENU.filter(m=>isAdmin()||HALAMAN_USER.includes(m[0])).map(([k,l])=>`<button class="${(view===k||(view==="form"&&k==="kegiatan"))?"on":""}" onclick="go('${k}')">${l}</button>`).join("");
  ({dashboard,kegiatan,form,anggota,peserta,laporan}[view]||kosong)();
}
function dashboard(){
  const t=today(),bln=t.slice(0,7);
  const upc=data.filter(x=>x.tanggal>=t&&x.status!=="Batal").sort((a,b)=>a.tanggal.localeCompare(b.tanggal)).slice(0,5);
  $("#main").innerHTML=`<h2>Dashboard</h2>
  <div class="stats">
   <div class="card stat"><span>Jumlah kegiatan bulan ini</span><b>${data.filter(x=>x.tanggal.startsWith(bln)).length}</b></div>
   <div class="card stat"><span>Peserta terdaftar</span><b>${data.reduce((a,x)=>a+pc(x),0)}</b></div>
   <div class="card stat"><span>Kegiatan selesai</span><b>${data.filter(x=>x.status==="Selesai").length}</b></div></div>
  <div class="card"><div class="row"><h3>Agenda terdekat</h3><button class="b" onclick="go('kegiatan')">Lihat semua</button></div>
  <div class="tw">${upc.length?`<table><tr><th>Tanggal</th><th>Kegiatan</th><th>Lokasi</th></tr>${upc.map(x=>`<tr><td>${tgl(x.tanggal)}</td><td>${esc(x.nama)}</td><td>${esc(x.lokasi)}</td></tr>`).join("")}</table>`:`<div class="empty">Belum ada agenda mendatang. Tambahkan kegiatan baru di menu Kegiatan.</div>`}</div></div>`;
}
function filtered(){
  const q=Q.toLowerCase();
  return data.filter(x=>(!F.kategori||x.kategori===F.kategori)&&(!F.status||x.status===F.status)&&(!F.bulan||x.tanggal.startsWith(F.bulan))&&(!F.pic||x.pic===F.pic)&&(!q||(x.nama+x.lokasi+x.pic+x.kategori).toLowerCase().includes(q))).sort((a,b)=>a.tanggal.localeCompare(b.tanggal));
}
function opts(a,v,ph){return(ph?`<option value="">${ph}</option>`:"")+a.map(o=>`<option ${o===v?"selected":""}>${esc(o)}</option>`).join("")}
function kegiatan(){
  const L=filtered(),per=5,pages=Math.max(1,Math.ceil(L.length/per));page=Math.min(page,pages);
  const rows=L.slice((page-1)*per,page*per),pics=[...new Set(data.map(x=>x.pic))];
  $("#main").innerHTML=`<div class="row"><h2 style="margin:0">Data Kegiatan</h2>${isAdmin()?`<button class="b p" onclick="go('form')">Tambah kegiatan</button>`:""}</div>
  <div class="filters" style="margin-bottom:12px">
   <select aria-label="Kategori" onchange="F.kategori=this.value;page=1;kegiatan()">${opts(KAT,F.kategori,"Kategori")}</select>
   <select aria-label="Status" onchange="F.status=this.value;page=1;kegiatan()">${opts(STS,F.status,"Status")}</select>
   <input type="month" aria-label="Bulan" value="${F.bulan}" onchange="F.bulan=this.value;page=1;kegiatan()">
   <select aria-label="PIC" onchange="F.pic=this.value;page=1;kegiatan()">${opts(pics,F.pic,"PIC")}</select></div>
  <div class="card tw" style="padding:0">${rows.length?`<table><tr><th>Nama kegiatan</th><th>Kategori</th><th>Tanggal</th><th>Lokasi</th><th>PIC</th><th>Status</th>${isAdmin()?"<th>Aksi</th>":""}</tr>
  ${rows.map(x=>`<tr><td>${esc(x.nama)}</td><td>${esc(x.kategori)}</td><td>${tgl(x.tanggal)}</td><td>${esc(x.lokasi)}</td><td>${esc(x.pic)}</td><td><span class="tag ${x.status}">${x.status}</span></td>
  ${isAdmin()?`<td><button class="lk" onclick="go('form',${x.id})">Edit</button> | <button class="lk d" onclick="hapus(${x.id})">Hapus</button></td>`:""}</tr>`).join("")}</table>`:`<div class="empty">Tidak ada kegiatan yang cocok. Ubah filter untuk melihat kegiatan lain.</div>`}</div>
  <div class="pg"><button class="b" ${page<2?"disabled":""} onclick="page--;kegiatan()">&lt;</button>
  ${Array.from({length:pages},(_,i)=>`<button class="b ${i+1===page?"on":""}" onclick="page=${i+1};kegiatan()">${i+1}</button>`).join("")}
  <button class="b" ${page>=pages?"disabled":""} onclick="page++;kegiatan()">&gt;</button></div>`;
}
function form(){
  const x=data.find(d=>d.id===editId)||{nama:"",kategori:"Rapat",tanggal:today(),lokasi:"",status:"Direncanakan",pic:"",peserta:0,deskripsi:""};
  $("#main").innerHTML=`<h2>${editId?"Edit":"Tambah"} kegiatan</h2>
  <div class="card"><div class="grid" id="f">
   <div><label for="nama">Nama kegiatan</label><input id="nama" value="${esc(x.nama)}"></div>
   <div><label for="kategori">Kategori</label><select id="kategori">${opts(KAT,x.kategori)}</select></div>
   <div><label for="tanggal">Tanggal</label><input id="tanggal" type="date" value="${x.tanggal}"></div>
   <div><label for="lokasi">Lokasi</label><input id="lokasi" value="${esc(x.lokasi)}"></div>
   <div><label for="status">Status</label><select id="status">${opts(STS,x.status)}</select></div>
   <div><label for="pic">PIC</label><input id="pic" value="${esc(x.pic)}"></div>
   <div><label for="peserta">Jumlah peserta</label><input id="peserta" type="number" min="0" value="${x.peserta}"></div>
   <div class="full"><label for="deskripsi">Deskripsi</label><textarea id="deskripsi" rows="5">${esc(x.deskripsi)}</textarea></div></div>
   <div id="err" class="mu" style="color:var(--er);margin-top:10px"></div>
   <div class="act"><button class="b" onclick="go('kegiatan')">Batal</button><button class="b p" onclick="simpan()">Simpan</button></div></div>`;
}
function simpan(){
  const v=k=>$("#"+k).value.trim();
  const o={nama:v("nama"),kategori:v("kategori"),tanggal:v("tanggal"),lokasi:v("lokasi"),status:v("status"),pic:v("pic"),peserta:+v("peserta")||0,deskripsi:v("deskripsi")};
  if(!o.nama||!o.tanggal||!o.lokasi||!o.pic){$("#err").textContent="Isi nama kegiatan, tanggal, lokasi, dan PIC sebelum menyimpan.";return}
  if(editId){Object.assign(data.find(d=>d.id===editId),o)}else{data.push({id:Date.now(),...o})}
  save();toast(editId?"Kegiatan diperbarui":"Kegiatan ditambahkan");go("kegiatan");
}
function hapus(id){
  const x=data.find(d=>d.id===id);
  if(confirm(`Hapus kegiatan “${x.nama}”?`)){data=data.filter(d=>d.id!==id);delete hadir[id];saveH();save();toast("Kegiatan dihapus");kegiatan()}
}
function kosong(){
  const m=MENU.find(m=>m[0]===view)[1];
  $("#main").innerHTML=`<h2>${m}</h2><div class="card empty">Halaman ${m} belum tersedia. Mulai dari menu Kegiatan untuk mengelola agenda.</div>`;
}
// ===== Anggota, Peserta, Laporan =====
const JAB=["Ketua","Wakil Ketua","Sekretaris","Bendahara","Anggota"],HDR=["Hadir","Izin","Alpa"];
const SEEDA=[{id:1,nama:"Abas Pratomo",nim:"33xxxxx01",jabatan:"Ketua",hp:"08111111111"},{id:2,nama:"Budi Santoso",nim:"33xxxxx02",jabatan:"Sekretaris",hp:"08222222222"},{id:3,nama:"Cici Lestari",nim:"33xxxxx03",jabatan:"Anggota",hp:"08333333333"},{id:4,nama:"Dedi Kurnia",nim:"33xxxxx04",jabatan:"Bendahara",hp:""}];
const SEEDH={2:{1:"Hadir",2:"Izin",3:"Alpa"}};
function ld(k,s){try{const v=localStorage.getItem(k);if(v)return JSON.parse(v)}catch(e){}return JSON.parse(JSON.stringify(s))}
let AG=ld("agenda_anggota",SEEDA),hadir=ld("agenda_hadir",SEEDH),aQ="",aJ="",aEdit=null,pK=null,pAdd=false;
const saveA=()=>{try{localStorage.setItem("agenda_anggota",JSON.stringify(AG))}catch(e){}};
const saveH=()=>{try{localStorage.setItem("agenda_hadir",JSON.stringify(hadir))}catch(e){}};
function pc(x){return hadir[x.id]?Object.keys(hadir[x.id]).length:(+x.peserta||0)}

function anggota(){
  const e=AG.find(a=>a.id===aEdit)||{nama:"",nim:"",jabatan:"",hp:""};
  $("#main").innerHTML=`<h2>Anggota</h2>
  <div class="filters" style="margin-bottom:12px"><input style="flex:1;min-width:180px" aria-label="Cari anggota" placeholder="Cari nama / NIM" value="${esc(aQ)}" oninput="aQ=this.value;aList()">
   <select aria-label="Jabatan" onchange="aJ=this.value;aList()">${opts(JAB,aJ,"Semua jabatan")}</select>
   <button class="b p" onclick="aEdit=null;anggota();$('#an').focus()">Tambah anggota</button></div>
  <div class="card tw" style="padding:0" id="al"></div>
  <div class="card" style="margin-top:16px;border-style:dashed"><div class="row"><h3>${aEdit?"Edit":"Tambah"} anggota</h3></div>
   <div class="grid">
    <div><label for="an">Nama lengkap</label><input id="an" value="${esc(e.nama)}" placeholder="Nama lengkap"></div>
    <div><label for="ani">NIM</label><input id="ani" value="${esc(e.nim)}" placeholder="Contoh: 33xxxxx01"></div>
    <div><label for="ajb">Jabatan</label><select id="ajb">${opts(JAB,e.jabatan,"Pilih jabatan")}</select></div>
    <div><label for="ahp">No. HP</label><input id="ahp" value="${esc(e.hp)}" placeholder="Contoh: 08xx"></div></div>
   <div id="aerr" class="mu" style="color:var(--er);margin-top:10px"></div>
   <div class="act"><button class="b" onclick="aEdit=null;anggota()">Batal</button><button class="b p" onclick="aSave()">Simpan</button></div></div>`;
  aList();
}
function aList(){
  const q=aQ.toLowerCase(),L=AG.filter(a=>(!aJ||a.jabatan===aJ)&&(!q||(a.nama+a.nim).toLowerCase().includes(q)));
  $("#al").innerHTML=L.length?`<table><tr><th>Nama</th><th>Jabatan</th><th>No. HP</th><th>Aksi</th></tr>${L.map(a=>`<tr><td>${esc(a.nama)}<br><span class="mu">${esc(a.nim)}</span></td><td>${esc(a.jabatan)}</td><td>${esc(a.hp)||"-"}</td><td><button class="lk" onclick="aEdit=${a.id};anggota();$('#an').focus()">Edit</button> | <button class="lk d" onclick="aDel(${a.id})">Hapus</button></td></tr>`).join("")}</table>`:`<div class="empty">Anggota tidak ditemukan. Ubah pencarian atau tambahkan anggota baru.</div>`;
}
function aSave(){
  const v=k=>$("#"+k).value.trim(),o={nama:v("an"),nim:v("ani"),jabatan:v("ajb"),hp:v("ahp")};
  if(!o.nama||!o.nim||!o.jabatan){$("#aerr").textContent="Isi nama lengkap, NIM, dan jabatan sebelum menyimpan.";return}
  if(AG.some(a=>a.nim===o.nim&&a.id!==aEdit)){$("#aerr").textContent="NIM sudah terdaftar. Periksa kembali NIM yang dimasukkan.";return}
  if(aEdit)Object.assign(AG.find(a=>a.id===aEdit),o);else AG.push({id:Date.now(),...o});
  saveA();toast(aEdit?"Anggota diperbarui":"Anggota ditambahkan");aEdit=null;anggota();
}
function aDel(id){
  const a=AG.find(x=>x.id===id);
  if(confirm(`Hapus anggota “${a.nama}”?`)){AG=AG.filter(x=>x.id!==id);Object.values(hadir).forEach(o=>delete o[id]);saveA();saveH();toast("Anggota dihapus");anggota()}
}

function peserta(){
  if(!data.some(k=>k.id===pK))pK=data[0]?data[0].id:null;
  if(pK===null){$("#main").innerHTML=`<h2>Peserta</h2><div class="card empty">Belum ada kegiatan. Tambahkan kegiatan di menu Kegiatan terlebih dahulu.</div>`;return}
  const h=hadir[pK]||{},ids=AG.filter(a=>a.id in h),n=s=>ids.filter(a=>h[a.id]===s).length,belum=AG.filter(a=>!(a.id in h));
  $("#main").innerHTML=`<h2>Peserta</h2>
  <div class="row"><div style="min-width:240px;flex:1;max-width:440px"><label for="pk">Kegiatan</label><select id="pk" onchange="pK=+this.value;pAdd=false;peserta()">${data.map(k=>`<option value="${k.id}" ${k.id===pK?"selected":""}>${esc(k.nama)} - ${tgl(k.tanggal)}</option>`).join("")}</select></div>
   <button class="b p" onclick="pAdd=!pAdd;peserta()">Tambah peserta</button></div>
  ${pAdd?`<div class="card" style="margin-bottom:14px;border-style:dashed"><div class="row"><h3>Pilih anggota</h3></div>${belum.length?belum.map(a=>`<label class="chk"><input type="checkbox" class="pc" value="${a.id}"> ${esc(a.nama)} <span class="mu">${esc(a.nim)}</span></label>`).join("")+`<div class="act"><button class="b" onclick="pAdd=false;peserta()">Batal</button><button class="b p" onclick="pTambah()">Tambahkan</button></div>`:`<div class="empty">Semua anggota sudah terdaftar di kegiatan ini.</div>`}</div>`:""}
  <div class="stats">${HDR.map(s=>`<div class="card stat"><span>${s}</span><b>${n(s)}</b></div>`).join("")}</div>
  <div class="card tw" style="padding:0">${ids.length?`<table><tr><th>No</th><th>Nama</th><th>NIM</th><th>Jabatan</th><th>Kehadiran</th><th>Aksi</th></tr>${ids.map((a,i)=>`<tr><td>${i+1}</td><td>${esc(a.nama)}</td><td>${esc(a.nim)}</td><td>${esc(a.jabatan)}</td><td><select id="s${a.id}" style="width:auto" aria-label="Kehadiran ${esc(a.nama)}" onchange="hadir[pK][${a.id}]=this.value;peserta()">${opts(HDR,h[a.id])}</select></td><td><button class="lk" onclick="$('#s${a.id}').focus()">Ubah</button> | <button class="lk d" onclick="pDel(${a.id})">Hapus</button></td></tr>`).join("")}</table>`:`<div class="empty">Belum ada peserta. Klik Tambah peserta untuk memilih anggota.</div>`}</div>
  <div class="row" style="margin-top:14px"><span class="mu">Anggota yang sudah terdaftar tidak muncul lagi di daftar tambah.</span><button class="b p" onclick="saveH();toast('Kehadiran disimpan')">Simpan kehadiran</button></div>`;
}
function pTambah(){
  const c=[...document.querySelectorAll(".pc:checked")].map(x=>+x.value);
  hadir[pK]=hadir[pK]||{};c.forEach(i=>hadir[pK][i]="Hadir");saveH();pAdd=false;
  if(c.length)toast(c.length+" peserta ditambahkan");peserta();
}
function pDel(id){delete hadir[pK][id];saveH();toast("Peserta dihapus");peserta()}

function laporan(){
  const L=[...data].sort((a,b)=>a.tanggal.localeCompare(b.tanggal)),T=k=>Object.values(hadir[k]||{});
  const tot=HDR.map(s=>L.reduce((a,k)=>a+T(k.id).filter(v=>v===s).length,0));
  $("#main").innerHTML=`<div class="row"><h2 style="margin:0">Laporan</h2><button class="b" onclick="print()">Cetak</button></div>
  <div class="stats"><div class="card stat"><span>Total kegiatan</span><b>${L.length}</b></div>${HDR.map((s,i)=>`<div class="card stat"><span>Total ${s.toLowerCase()}</span><b>${tot[i]}</b></div>`).join("")}</div>
  <div class="card tw" style="padding:0"><table><tr><th>Kegiatan</th><th>Tanggal</th><th>Status</th><th>Peserta</th><th>Hadir</th><th>Izin</th><th>Alpa</th><th>Kehadiran</th></tr>${L.map(k=>{const t=T(k.id),c=s=>t.filter(v=>v===s).length;return`<tr><td>${esc(k.nama)}</td><td>${tgl(k.tanggal)}</td><td><span class="tag ${k.status}">${k.status}</span></td><td>${t.length}</td><td>${c("Hadir")}</td><td>${c("Izin")}</td><td>${c("Alpa")}</td><td>${t.length?Math.round(c("Hadir")/t.length*100)+"%":"-"}</td></tr>`}).join("")}</table></div>`;
}
$("#q").addEventListener("input",e=>{Q=e.target.value;if(view!=="kegiatan"){view="kegiatan";render()}page=1;kegiatan();});
// ===== Login (demo, hanya di sisi browser) =====
const USERS=[
  {u:"admin",p:"admin123",n:"Admin",r:"admin"},
  {u:"bem",p:"bem2026",n:"BEM",r:"admin"},
  {u:"user",p:"user123",n:"Mahasiswa",r:"user"}
];
function sesi(){try{return localStorage.getItem("agenda_sesi")||sessionStorage.getItem("agenda_sesi")}catch(e){return null}}
function masuk(a){ROLE=a.r;document.body.classList.remove("out");$("#uname").textContent=a.r==="user"?"Mahasiswa":a.n;go("dashboard")}function logout(){try{localStorage.removeItem("agenda_sesi");sessionStorage.removeItem("agenda_sesi")}catch(e){}
  ROLE="admin";document.body.classList.add("out");$("#lf").reset();$("#lerr").textContent="";$("#lu").focus()}
if($("#tp"))$("#tp").onclick=()=>{const p=$("#lp"),s=p.type==="password";p.type=s?"text":"password";$("#tp").textContent=s?"Sembunyikan":"Tampilkan"};
$("#lf").addEventListener("submit",e=>{
  e.preventDefault();
  const u=$("#lu").value.trim(),p=$("#lp").value,err=$("#lerr");
  if(!u||!p){err.textContent="Isi nama pengguna dan kata sandi.";return}
  const adm=USERS.find(x=>x.r==="admin"&&x.u===u.toLowerCase());
const a=adm||{u:u,n:u,r:"user"};
  try{(($("#lr").checked)?localStorage:sessionStorage).setItem("agenda_sesi",a.u)}catch(e){}
  masuk(a);
});
const s0=USERS.find(x=>x.u===sesi());
if(s0){masuk(s0)}else{document.body.classList.add("out");render()}
