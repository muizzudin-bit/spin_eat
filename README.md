# Spin Board

Roda putar untuk apa-apa pilihan. Link asas sentiasa kosong. Tekan **Create share link** untuk buka bilik dengan link sendiri (`?board=xxxx`); semua yang buka link tu nampak papan dan spin yang sama.

## Struktur

```
index.html                      UI
functions/api/bilik/[id].js     API simpan/baca bilik (Cloudflare Pages Functions)
schema.sql                      jadual D1
```

## Setup Cloudflare (sekali sahaja)

1. Push folder ni ke GitHub.
2. Cloudflare dashboard > **Workers & Pages** > Create > Pages > Connect to Git, pilih repo. Build command kosongkan, output directory `/`.
3. **Storage & Databases > D1** > Create database, nama `roda-makan`.
4. Buka database tu > **Console**, tampal isi `schema.sql`, Execute.
5. Projek Pages > **Settings > Bindings** > Add > D1 database. Variable name: `DB`, pilih `roda-makan`.
6. **Deployments** > Retry deployment (supaya binding aktif).

Siap. Buka link projek, tambah kedai, tekan Create share link, salin link.
