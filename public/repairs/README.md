# Repair photos — drop folder

Put the client's real before/after photos here. Exact filenames the site expects:

| # | Slot (title on site) | BEFORE file | AFTER file |
|---|---|---|---|
| 1 | Antique dining table — full refinish | `table-before.jpg` | `table-after.jpg` |
| 2 | Teak armchair — joint repair + re-polish | `chair-before.jpg` | `chair-after.jpg` |
| 3 | Wardrobe — shutter alignment + finish | `wardrobe-before.jpg` | `wardrobe-after.jpg` |
| 4 | Balcony slider — roller + seal overhaul | `door-before.jpg` | `door-after.jpg` |

Rules for a convincing slider:
- **Same angle + same framing** for before and after (stand in the same spot).
- **Same orientation** — landscape works best.
- **~1600px wide**, JPG or WebP, under ~400 KB each (use Squoosh/TinyPNG).
- Landscape phone photos are fine; the site crops them to fit.

Once the 8 files are here, wiring them in is a 4-line change in
`src/data/content.js` (set `img` + `beforeImg` to `/repairs/<name>.jpg`).
