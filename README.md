# TannnSpoof

PWA + Node backend + Roblox Studio companion untuk workflow animation ID.

## Yang benar-benar didukung
- Preview animated thumbnail untuk animation ID yang sudah tersedia.
- Upload `.rbxm` / `.rbxmx` lewat Roblox Open Cloud Assets API menggunakan API key `asset:write`.
- Copy kode Roblox Studio untuk ID.
- Plugin Studio untuk preview langsung pada R15 rig.

## Jalankan lokal
```bash
npm install
npm start
```
Buka `http://localhost:3000`.

## Security
Jangan hard-code API key. Untuk production, simpan `ROBLOX_API_KEY` sebagai secret environment variable di server. Jika menerima key dari browser seperti demo ini, gunakan HTTPS dan jangan log header tersebut.

## Catatan Roblox
Upload tetap tunduk pada ownership, permissions, moderation, dan batas API Roblox. TannnSpoof tidak memalsukan/spoof asset ID.
