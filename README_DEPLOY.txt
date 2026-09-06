AMALAN MUSLIM RC80.10 — COMPLETE STANDALONE PACKAGE

Perubahan utama:
- Auto Fokus highlight memakai gradasi multiwarna bergerak kiri-ke-kanan.
- PDF Teleprompter mempertahankan Auto Scroll presisi 1–60 px/s.
- PDF center-guide mempertahankan highlighter gradasi bergerak.
- Cover landscape tetap utuh dengan object-fit: contain.
- index.html menjadi entry point utama.
- Service worker RC80.10 menyimpan index.html + manifest + icons untuk core offline/PWA.
- Cache RC lama dibersihkan saat service worker baru aktif.

Isi paket:
- index.html
- manifest.webmanifest
- sw.js
- icons/icon-192.png
- icons/icon-512.png
- icons/apple-touch-icon.png

Cara pakai:
1. Ekstrak seluruh ZIP dalam satu folder.
2. Buka index.html untuk penggunaan lokal biasa.
3. Untuk instalasi PWA/service worker, jalankan dari HTTPS atau localhost dan jangan memisahkan file di dalam paket.

Catatan:
Fungsi PDF.js pada build ini tetap memakai library PDF.js 3.11.174 dari CDN saat modul PDF pertama kali dipakai. Core aplikasi dan konten utama berada di dalam paket.
