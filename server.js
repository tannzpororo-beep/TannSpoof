import express from 'express';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
app.use(express.json({limit:'1mb'}));
app.use(express.static(path.join(__dirname,'../public')));

app.get('/api/health', (_,res)=>res.json({ok:true,name:'TannnSpoof'}));
app.get('/api/preview/:id', async (req,res)=>{
  const id = String(req.params.id).replace(/\D/g,'');
  if(!id) return res.status(400).json({error:'Invalid animation ID'});
  const r = await fetch(`https://thumbnails.roblox.com/v1/asset-thumbnail-animated?assetId=${id}`);
  const data = await r.json();
  res.status(r.status).json(data);
});

app.post('/api/upload-animation', upload.single('file'), async (req,res)=>{
  try {
    const apiKey = req.headers['x-roblox-api-key'] || process.env.ROBLOX_API_KEY;
    if(!apiKey) return res.status(401).json({error:'Roblox API key belum diberikan.'});
    if(!req.file) return res.status(400).json({error:'File .rbxm/.rbxmx wajib dipilih.'});
    const ext = path.extname(req.file.originalname).toLowerCase();
    if(!['.rbxm','.rbxmx'].includes(ext)) return res.status(400).json({error:'Hanya .rbxm atau .rbxmx.'});
    const creatorId = String(req.body.creatorId||'').trim();
    const creatorType = String(req.body.creatorType||'User').trim();
    const name = String(req.body.name||'TannnSpoof Animation').slice(0,80);
    const description = String(req.body.description||'Uploaded with TannnSpoof').slice(0,1000);
    if(!/^\d+$/.test(creatorId)) return res.status(400).json({error:'Creator ID tidak valid.'});
    const boundary = '----TannnSpoof' + Math.random().toString(16).slice(2);
    const creator = creatorType === 'Group' ? {groupId: creatorId} : {userId: creatorId};
    const request = JSON.stringify({assetType:'Animation',displayName:name,description,creationContext:{creator}});
    const pre = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="request"\r\n\r\n${request}\r\n--${boundary}\r\nContent-Disposition: form-data; name="fileContent"; filename="${req.file.originalname}"\r\nContent-Type: model/x-rbxm\r\n\r\n`);
    const post = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([pre,req.file.buffer,post]);
    const r = await fetch('https://apis.roblox.com/assets/v1/assets',{method:'POST',headers:{'x-api-key':apiKey,'content-type':`multipart/form-data; boundary=${boundary}`},body});
    const data = await r.json().catch(()=>({}));
    res.status(r.status).json(data);
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.use((_,res)=>res.sendFile(path.join(__dirname,'../public/index.html')));
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`TannnSpoof running on http://localhost:${port}`));
