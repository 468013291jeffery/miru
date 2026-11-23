import json,pathlib,hashlib
from PIL import Image,ImageOps,ImageDraw
ROOT=pathlib.Path(__file__).resolve().parent.parent
TASK=ROOT.parent;OUT=ROOT/'art/official/m119-breakup-v2/images';OUT.mkdir(parents=True,exist_ok=True)
rows=json.loads((TASK/'first-scenes-results.json').read_text('utf8'))
for p in sorted((TASK/'generated').glob('*.json')):rows.append(json.loads(p.read_text('utf8')))
rows={r['id']:r for r in rows};rows=[rows[k] for k in sorted(rows)]
if len(rows)!=76:raise ValueError('Expected 76 selected source images, got '+str(len(rows)))
manifest=[];sheets=TASK/'image-review';sheets.mkdir(exist_ok=True)
for r in rows:
 src=pathlib.Path(r['path']);im=Image.open(src).convert('RGB');file=OUT/(r['id']+'.webp')
 im.save(file,quality=88,method=6)
 manifest.append(dict(id=r['id'],file='art/official/m119-breakup-v2/images/'+file.name,width=im.width,height=im.height,sha256=hashlib.sha256(file.read_bytes()).hexdigest(),original_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),review='pending'))
for start in range(0,len(rows),6):
 sheet=Image.new('RGB',(1152,1420),'#191b21');draw=ImageDraw.Draw(sheet)
 for k,r in enumerate(rows[start:start+6]):
  im=Image.open(r['path']).convert('RGB');im=ImageOps.contain(im,(376,668));x=(k%3)*384;y=(k//3)*710
  sheet.paste(im,(x+(384-im.width)//2,y));draw.text((x+5,y+675),r['id'],fill='white')
 sheet.save(sheets/('sheet-'+str(start//6+1).zfill(2)+'.jpg'),quality=92)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n','utf8')
print('Exported 76 WebP images with original hashes and 13 QA sheets.')
