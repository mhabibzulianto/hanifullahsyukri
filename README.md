# Hanifullah Syukri

Situs dan ruang editorial berbasis Next.js, React, Tailwind CSS 4, dan Supabase.

## Menjalankan lokal

```sh
npm install
npm run dev -- --port 3002
```

Buka `http://localhost:3002/admin`, lalu login menggunakan akun Supabase proyek ini. Kredensial berada di `.env.local`; gunakan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Konfigurasi lama dengan awalan `VITE_` masih didukung oleh `next.config.mjs`.

## Dashboard

- `src/AdminDashboard.jsx`: shell, navigasi, ringkasan artikel, daftar/filter/pagination, dan preview.
- `src/components/dashboard/dashboard.css`: gaya dashboard yang diadaptasi dari Editorial Rabbani, dibatasi dengan awalan `hs-` agar tidak memengaruhi situs publik atau editor.
- `src/components/TiptapEditor.jsx`: editor Tiptap 3 dari inti Editorial Rabbani, dengan pemulihan draft HTML lama, backup di `sessionStorage`, serta simpan draft/publikasi ke `posts`.
- `src/lib/use-supabase-session.js`: autentikasi dan pemeriksaan sesi yang sudah ada.
- `supabase/posts_schema.sql`: skema tabel artikel dan kebijakan akses.

Dashboard membaca `posts` milik akun yang login. Statistik berasal dari data tersebut. Klik judul artikel untuk preview; pada mobile preview memenuhi lebar layar, sedangkan tabel dapat digulir di dalam panelnya.

Draft editor dicadangkan di sesi browser dan dapat dilanjutkan dari dashboard. Tombol Simpan draft dan Terbitkan menyimpan JSON Tiptap ke kolom `posts.content` yang bertipe JSONB; skema dan kebijakan akses pada `supabase/posts_schema.sql` harus tersedia. Preview dashboard mendukung format lama serta dokumen Tiptap.

Ekstensi pada `src/lib/editor/` diadaptasi dari proyek lokal Editorial Rabbani Institute, snapshot Git `9665ee45fbda39bf7ca4d418ff0c1ab3a2d15696` (termasuk perubahan lokal pada saat integrasi), dengan Tiptap `3.31.4`. Fitur inti mencakup heading, marks, daftar, alignment, tautan, blok Arab, honorifik, footnote, pull quote, marginalia, media melalui URL HTTPS, dan YouTube. Panel media Supabase, pemilih ayat, slash-menu, serta workflow persetujuan redaksi Rabbani belum diintegrasikan. Ini salinan source lokal; sinkronisasi versi dan notifikasi pembaruan belum otomatis.

## Verifikasi

```sh
npm run build
npm run verify:dashboard
node --env-file=.env.local scripts/verify-editor.mjs
```

Jalankan dev server pada port 3002 sebelum verifikasi browser. Tes memakai akun dan respons Supabase tiruan di browser terisolasi, tanpa mengubah database. Secara default tes memakai Microsoft Edge terpasang; atur `PLAYWRIGHT_CHANNEL` untuk browser lain dan `DASHBOARD_TEST_URL` jika alamat lokal berbeda. Screenshot hasil pemeriksaan berada di `.next/`.
