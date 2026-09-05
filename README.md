# Aplikasi To-Do List

## Deskripsi
Aplikasi to-do list sederhana berbasis web yang dibangun menggunakan HTML, CSS, dan JavaScript murni (client-side). Aplikasi ini memungkinkan pengguna untuk mencatat, menandai, mengedit, dan menghapus tugas harian. Data tugas disimpan secara lokal menggunakan localStorage sehingga tidak hilang saat halaman di-refresh.

## Fitur
- Tambah tugas baru
- Tandai tugas sebagai selesai/belum selesai
- Edit judul tugas
- Hapus tugas
- Penyimpanan data otomatis (localStorage), data tetap ada meski browser ditutup
- Kolom catatan tambahan
- Tampilan hari dan tanggal otomatis mengikuti waktu sistem

## Teknologi yang Digunakan
- HTML5
- CSS3 (custom styling + Bootstrap 5 untuk sebagian komponen)
- JavaScript (Vanilla JS, ES6)
- localStorage sebagai media penyimpanan data
- Git & GitHub untuk version control

## Struktur Folder
todolist-app/
-  index.html → halaman utama aplikasi
- style.css → styling tampilan
- script.js → logika aplikasi (struktur data, fungsi, event handler)
- README.md → dokumentasi proyek


## Struktur Data
Data tugas disimpan dalam bentuk array of objects, dengan struktur sebagai berikut:
```javascript
let tasks = [
  { id: 1, title: "Belajar HTML/CSS", status: "belum" },
  { id: 2, title: "Kerjakan tugas UX", status: "selesai" },
];
```

## Cara Menjalankan
1. Clone atau download repository ini
2. Buka folder proyek di VS Code
3. Jalankan `index.html` menggunakan ekstensi Live Server, atau buka langsung file `index.html` di browser
4. Aplikasi siap digunakan

## Cara Penggunaan
1. Ketik tugas baru pada kolom input, lalu tekan **Enter** untuk menambahkan
2. Klik checkbox untuk menandai tugas selesai/belum selesai
3. Klik tombol **Edit** untuk mengubah judul tugas, tekan **Enter** untuk menyimpan atau **Esc** untuk membatalkan
4. Klik tombol **Hapus** untuk menghapus tugas
5. Tulis catatan tambahan pada kolom "Catatan" di bagian bawah

## Pengujian
Aplikasi telah diuji untuk skenario berikut:
- Validasi input kosong (tugas tidak ditambahkan jika input kosong)
- Penambahan, pengubahan status, pengeditan, dan penghapusan tugas
- Persistensi data setelah refresh halaman (localStorage)
- Debugging menggunakan Browser Developer Tools (Console & Elements)

## Kontributor
- [Mohammad Taufik Hidayatuloh](https://github.com/mohTaufik3)

