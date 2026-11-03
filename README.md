# Spin board

Roda putar untuk apa-apa pilihan. Link asas sentiasa kosong. Tekan **Create share link** untuk dapat link (`?board=xxxx`); semua yang buka link tu nampak papan, tajuk, description dan spin yang sama, live.

## Struktur

```
public/index.html   UI
src/worker.js       API bilik (/api/bilik/:id) + hidang fail public
wrangler.jsonc      config Cloudflare Worker
schema.sql          jadual D1
```

## Setup D1 (sekali sahaja)

1. Cloudflare dashboard > Storage & Databases > D1 > Create, nama `spin-2-eat-db`.
2. Salin **Database ID**, tampal dalam `wrangler.jsonc` ganti `TAMPAL-DATABASE-ID-DI-SINI`.
3. Buka database > Console, tampal isi `schema.sql`, Execute.
4. Commit dan push. Workers Builds akan deploy sendiri.
