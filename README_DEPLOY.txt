AMALAN MUSLIM RC80.10 — OFFLINE BASELINE

PAKET PWA / HOME SCREEN
========================
1. Upload SEMUA isi folder ini ke satu folder pada hosting HTTPS.
2. Buka alamat index.html dari Safari pada iPhone/iPad.
3. Tunggu halaman selesai terbuka saat perangkat masih ONLINE.
4. Tekan Share → Add to Home Screen / Tambahkan ke Layar Utama.
5. Buka aplikasi dari icon Home Screen sekali lagi saat masih online.
6. Setelah itu aplikasi dapat diuji dengan Airplane Mode.

OFFLINE PDF READER
==================
RC80.10 Offline Baseline menyimpan PDF.js 3.11.174 dan PDF Worker ke Cache Storage
pada instalasi/aktivasi service worker pertama. Setelah cache tersebut terbentuk, PDF Reader
dan Teleprompter tetap dapat memuat modul PDF.js tanpa koneksi internet.

PENTING
=======
- Instalasi awal tetap membutuhkan internet dan HTTPS karena iOS/PWA Service Worker memerlukannya.
- Jangan hanya membuka index.html melalui aplikasi Files (file://), karena Service Worker tidak aktif.
- Setelah update versi aplikasi, buka sekali secara online agar cache versi baru terpasang.
- File PDF milik pengguna tetap diimpor/dibaca dari perangkat; file PDF tidak otomatis dimasukkan ke ZIP ini.

BASELINE
========
Basis fungsi: RC80.10 PDF Low-Speed + Cover Fix.
Tambahan versi ini hanya memperkuat dukungan PWA/offline PDF.js dan tidak dimaksudkan
untuk mengubah fungsi Smart Counter, Auto Fokus, editor, navigasi, atau layout bacaan.
