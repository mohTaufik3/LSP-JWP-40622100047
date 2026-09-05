let tasks = [
  { id: 1, title: 'Belajar HTML/CSS', status: 'belum' },
  { id: 2, title: 'Kerjakan tugas UX', status: 'belum' },
];

// State: menyimpan id tugas yang sedang dalam mode edit. sementara belum ada yang diedit.
let editingId = null;

// Daftar nama hari dalam bahasa Inggris, index sesuai Date.getDay() (0 = Sunday).
const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// menampilkan nama hari dan tanggal hari ini secara otomatis ke elemen HTML dengan id "day" dan "date".
const showDate = () => {
  // Ambil tanggal & waktu saat ini dari sistem, now.getDay() mengembalikan angka 0-6
  const now = new Date();
  document.getElementById('day').textContent = daysName[now.getDay()];
  document.getElementById('date').textContent = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// merender ulang seluruh daftar tugas ke halaman berdasarkan isi array "tasks" dan state "editingId" saat ini.
// Fungsi ini dipanggil setiap kali ada perubahan data (tambah/edit/hapus/centang).
const showList = () => {
  const list = document.getElementById('task-list');

  // Kosongkan dulu isi list, jadi ga double waktu render ulang
  list.innerHTML = '';
  tasks.forEach((task) => {
    // Buat elemen <li> baru untuk tugas ini
    const li = document.createElement('li');

    // Cek: apakah tugas ini sedang dalam mode edit?
    if (editingId === task.id) {
      // tampilkan input teks berisi judul tugas saat ini
      li.innerHTML = `
        <input type="text" id="edit-input-${task.id}" class="edit-input"
               value="${task.title}"
               onkeydown="handleEditKey(event, ${task.id})">
      `;
    } else {
      // tampilkan checkbox, judul tugas, dan tombol aksi.
      li.innerHTML = `
        <input type="checkbox" class="planner-checkbox"
            ${task.status === 'selesai' ? 'checked' : ''}
            onchange="toggleStatus(${task.id})">
        <span class="task-title ${task.status === 'selesai' ? 'done' : ''}">
          ${task.title}
        </span>
        <div class="task-actions">
          <button onclick="editTask(${task.id})">Edit</button>
          <button onclick="deleteTask(${task.id})">Hapus</button>
        </div>
      `;
      // Notes:
      // - checked ditambahkan otomatis kalau status "selesai"
      // - class "done" menambahkan efek coret pada judul yang sudah selesai
    }

    // Masukkan <li> yang sudah dibuat ke dalam <ul>
    list.appendChild(li);
  });

  // Setelah render selesai, kalau ada tugas yang sedang diedit, otomatis fokuskan kursor ke input edit tersebut, dan taruh posisi kursor di akhir teks (bukan di awal).
  if (editingId !== null) {
    const editInput = document.getElementById(`edit-input-${editingId}`);
    if (editInput) {
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }
  }
};

// membalik status tugas antara "belum" dan "selesai" berdasarkan id tugas yang dipilih.
const toggleStatus = (id) => {
  // mencari task di tasks berdasarkan id
  const task = tasks.find((t) => t.id === id);
  // kalau status sekarang "selesai" jadi "belum", dan sebaliknya
  task.status = task.status === 'selesai' ? 'belum' : 'selesai';

  save(); // simpan perubahan ke localStorage
  showList(); // render ulang tampilan
};

// menghapus satu tugas dari array berdasarkan id.
const deleteTask = (id) => {
  // filter() -> buat array baru semua tugas KECUALI yang id-nya cocok
  tasks = tasks.filter((t) => t.id !== id);

  save();
  showList();
};

// mengaktifkan mode edit untuk tugas dengan id tertentu.
const editTask = (id) => {
  editingId = id; // tandai tugas ini sedang diedit
  showList(); // render ulang, showList() akan menampilkan mode edit untuk id ini
};

// membatalkan proses edit tanpa menyimpan perubahan, kembali ke tampilan normal.
const cancelEdit = () => {
  editingId = null; // hapus penanda mode edit
  showList(); // render ulang ke tampilan normal
};

// menyimpan hasil editan judul tugas.
const saveEdit = (id) => {
  // Ambil elemen input edit milik tugas (by id) ini
  const input = document.getElementById(`edit-input-${id}`);
  // Ambil teks yang diketik, hapus spasi kosong di awal/akhir
  const newTitle = input.value.trim();
  // kalau kosong, batalkan proses simpan
  if (newTitle === '') return;
  // Cari tugas yang mau diupdate, lalu ganti judulnya
  const task = tasks.find((t) => t.id === id);
  task.title = newTitle;

  editingId = null; // keluar dari mode edit
  save();
  showList();
};

// menangani interaksi keyboard saat mode edit aktif. Enter -> simpan perubahan, Escape -> batalkan edit.
const handleEditKey = (event, id) => {
  if (event.key === 'Enter') {
    saveEdit(id);
  } else if (event.key === 'Escape') {
    cancelEdit();
  }
};

// menyimpan data tasks dan catatan ke localStorage, supaya data tidak hilang saat halaman di-refresh atau ditutup.
const save = () => {
  // diubah dulu ke format string JSON dengan JSON.stringify()
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // Simpan juga isi kolom catatan
  localStorage.setItem('note', document.getElementById('note').value);
};

// mengambil data tersimpan dari localStorage (kalau ada) dan memuatnya kembali ke aplikasi.
const load = () => {
  // Ambil data tasks dari localStorage (berupa string JSON)
  const data = localStorage.getItem('tasks');

  // Kalau ada data tersimpan, ubah kembali dari string JSON menjadi array/objek JavaScript dengan JSON.parse()
  if (data) tasks = JSON.parse(data);

  // Ambil dan muat kembali isi catatan
  const note = localStorage.getItem('note');
  if (note) document.getElementById('note').value = note;
};

// Form tambah tugas menangani proses submit form untuk menambahkan tugas baru.
document.getElementById('add-form').addEventListener('submit', (e) => {
  // Mencegah reload halaman, karena submission ditangani manual lewat JS
  e.preventDefault();

  const input = document.getElementById('input-task');
  const title = input.value.trim();

  // jangan tambahkan tugas kalau input kosong
  if (title === '') return;

  //  Membuat id baru yang unik:
  // - ambil semua id yang ada (map), cari nilai terbesar (Math.max), tambah 1 supaya id baru selalu unik dan urut tapi kalau tasks masih kosong, langsung mulai dari id 1
  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  // Tambahkan objek tugas baru ke akhir array
  tasks.push({ id: newId, title: title, status: 'belum' });

  input.value = ''; // kosongkan kembali kolom input
  save();
  showList();
});

// Kolom catatan -> auto-save setiap kali user mengetik di kolom catatan, tanpa perlu tombol simpan terpisah.
document.getElementById('note').addEventListener('input', save);

showDate(); // Tampilkan urutan tanggal
load(); // Muat data dari localStorage
showList(); // Render tampilan berdasarkan data yang sudah dimuat
