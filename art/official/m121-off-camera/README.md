# M121 image and audio drop folder

All 117 webp stills are in `images/`, named by asset id, including `CG_M121_024.webp`.

Put any later file here using the asset id as the filename:

- `images/CHAR_SEB.webp`, `images/BG_C01_S01.webp`, `images/CG_M121_022.webp`, `images/STATE_M121_HEAT_SEB.webp`
- `audio/BGM_M121_C01.mp3`

The story already references these paths. A missing image shows a placeholder with the same id. After the work is published, copy `content/official/m121-off-camera/assets.json` paths into `art/official/<work_id>.json` if the client fetches the map by work id. The M121 player module also injects the map when the script is imported.
