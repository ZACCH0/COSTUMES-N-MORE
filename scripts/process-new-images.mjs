// Reshape the new source screenshots into a uniform, organized portfolio set.
//
// For every image in source-images/newimages:
//   1. (special case) crop away a flat empty band detected on an edge
//   2. inset the edges slightly to remove screenshot UI (carousel arrows / dots)
//   3. center-crop ("attention" focus) to a 4:5 portrait inner area
//   4. add a uniform thin white frame (border baked into the image)
//   5. save as work-NN.jpg (all files end up exactly 1080x1350)
//
// Exact byte-level duplicates are skipped. Writes data/gallery.json entries.
//
// Usage: node scripts/process-new-images.mjs

import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC = path.join(ROOT, 'source-images', 'newimages');
const OUT = path.join(ROOT, 'public', 'images', 'portfolio');
const GALLERY_JSON = path.join(ROOT, 'data', 'gallery.json');

// Final framed image is exactly 1080x1350 (4:5) with a 16px white frame.
const BORDER = 16;
const FINAL_W = 1080;
const FINAL_H = 1350;
const INNER_W = FINAL_W - BORDER * 2; // 1048
const INNER_H = FINAL_H - BORDER * 2; // 1318

// Edge inset before cropping: removes screenshot arrows / progress dots.
const INSET = { left: 0.04, right: 0.04, top: 0.01, bottom: 0.05 };

// Meta for each source file: gallery category + alt text.
const META = {
  '121407': { category: 'partial', alt: 'Brown and cream bull fursuit partial with horned head, arm sleeves, tail and hoof paws laid out on red fabric' },
  '121442': { category: 'head', alt: 'Black and white fursuit husky head with orange inner ears, teal eyes and a tall white mane' },
  '121520': { category: 'partial', alt: 'Brown African wild dog fursuit head with spotty ears, handpaws and a spotted tail' },
  '121636': { category: 'head', alt: 'Close-up of a brown-maned cheetah fursuit head with golden eyes and a pink tongue' },
  '122034': { category: 'partial', alt: 'Brown-maned cheetah fursuit head with large black-clawed handpaws' },
  '122130': { category: 'partial', alt: 'Cheetah fursuit head with cream chest fluff and spotted brown handpaws with black claws' },
  '122240': { category: 'wip', alt: 'White foam longhorn bull fursuit head base in progress with one eye drawn, horns and ears on a bust', fit: 'contain' },
  '122559': { category: 'wip', alt: 'Front view of a white foam longhorn bull fursuit head base with outlined markings on a bust', status: 'In progress', fit: 'contain' },
  '122702': { category: 'head', alt: 'Reddish-brown stag fursuit head with black antlers and a golden yellow mane', preCrop: { right: 193 } },
  '122918': { category: 'partial', alt: 'Orange and brown fox fursuit arm sleeves, handpaws and a white-tipped tail on red fabric' },
  '122952': { category: 'partial', alt: 'Close-up of brown fox fursuit handpaws with black pads and claws next to a matching tail' },
  '123034': { category: 'head', alt: 'White and black border collie fursuit head with a bright blue mohawk in side view' },
  '123103': { category: 'head', alt: 'White and black border collie fursuit head with a bright blue mohawk and orange-lined ears' },
  '123134': { category: 'head', alt: 'Side profile of a white and black border collie fursuit head with a blue mohawk and long black hair' },
  '123234': { category: 'head', alt: 'Blue, magenta and white fursuit fox head with a mint green mohawk and purple eyes' },
  '123258': { category: 'head', alt: 'Front view of a blue and magenta fursuit fox head with a mint green mohawk and blue eyes' },
  '123352': { category: 'head', alt: 'White tiger fursuit head with black stripes, pink inner ears and a pink nose on a tan blanket' },
  '123430': { category: 'head', alt: 'Dark brown fursuit bear head with candy-corn striped horns and big amber eyes' },
  '123516': { category: 'head', alt: 'Purple dragon fursuit head with orange horns and white fangs in side view' },
  '123538': { category: 'head', alt: 'Back view of a purple dragon fursuit head showing orange spikes and long purple fur' },
  '123631': { category: 'head', alt: 'Grumpy grey bird fursuit head with green cheeks, a large orange beak and yellow eyes' },
  '123705': { category: 'partial', alt: 'Grumpy blue bird fursuit head worn with a dark hoodie by a mountain lake' },
  '123727': { category: 'head', alt: 'Close-up of a grumpy grey bird fursuit head with green cheeks and an orange beak' },
  '123757': { category: 'head', alt: 'Front view of a grumpy grey bird fursuit head with a pink tongue sticking out' },
  '123825': { category: 'head', alt: 'White and grey snow leopard fursuit head with pink starry eyes and a fluffy cream beard' },
  '123855': { category: 'head', alt: 'Side profile of a white and grey snow leopard fursuit head with rosy markings' },
  '123930': { category: 'head', alt: 'Navy and cream corgi fursuit head with blue eyes and light blue nose on a blue fur blanket' },
  '1239301': { category: 'head', alt: 'Navy and cream corgi fursuit head with blue eyes on a fluffy blue and white blanket' },
};

// Flat-band detection: measure how uniform the outer columns/rows are (low stddev)
// and cut bands wider than 8% of the dimension. Used for screenshots that kept
// an empty strip beside the photo.
async function flatBand(file) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const gray = await img.clone().greyscale().raw().toBuffer();
  const stddevOf = (values) => {
    let mean = 0;
    for (const v of values) mean += v;
    mean /= values.length;
    let varr = 0;
    for (const v of values) varr += (v - mean) ** 2;
    return Math.sqrt(varr / values.length);
  };
  const colStd = (x) => {
    const vals = new Array(height);
    for (let y = 0; y < height; y++) vals[y] = gray[y * width + x];
    return stddevOf(vals);
  };
  const rowStd = (y) => stddevOf(Array.from(gray.subarray(y * width, y * width + width)));

  const cut = { left: 0, right: 0, top: 0, bottom: 0 };
  const minBand = 0.08;
  for (let x = width - 1; x > width * (1 - minBand); x--) { if (colStd(x) < 12) cut.right++; else break; }
  for (let x = 0; x < width * minBand; x++) { if (colStd(x) < 12) cut.left++; else break; }
  for (let y = height - 1; y > height * (1 - minBand); y--) { if (rowStd(y) < 12) cut.bottom++; else break; }
  for (let y = 0; y < height * minBand; y++) { if (rowStd(y) < 12) cut.top++; else break; }
  return cut;
}

async function main() {
  const files = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.png')).sort();
  const seen = new Set();
  const entries = [];
  let n = 0;

  for (const file of files) {
    const full = path.join(SRC, file);
    const hash = createHash('sha1').update(readFileSync(full)).digest('hex');
    if (seen.has(hash)) {
      console.log(`skip duplicate: ${file}`);
      continue;
    }
    seen.add(hash);

    const numKey = (file.match(/(\d{6,7})\.png$/i) || [])[1];
    const meta = META[numKey];
    if (!meta) throw new Error(`No meta for ${file}`);

    let img = sharp(full);
    const { width, height } = await img.metadata();

    // 1) cut any flat empty band (screenshot leftovers)
    const b = await flatBand(full);
    // explicit pre-crop for files whose band is wider than the detector scans
    if (meta.preCrop) {
      if (meta.preCrop.right) b.right = Math.max(b.right, meta.preCrop.right);
      if (meta.preCrop.left) b.left = Math.max(b.left, meta.preCrop.left);
    }
    if (b.left || b.right || b.top || b.bottom) {
      console.log(`band on ${file}:`, b);
    }

    // 2) inset edges to drop screenshot UI, combined with band cut into one crop
    const bw = width - b.left - b.right;
    const bh = height - b.top - b.bottom;
    const crop = {
      left: b.left + Math.round(bw * INSET.left),
      top: b.top + Math.round(bh * INSET.top),
      width: bw - Math.round(bw * INSET.left) - Math.round(bw * INSET.right),
      height: bh - Math.round(bh * INSET.top) - Math.round(bh * INSET.bottom),
    };
    img = img.extract(crop);

    // 3) cover-crop to 4:5 inner (or matte with white for wide sources) + 4) white frame
    const out = await img
      .resize(INNER_W, INNER_H, {
        fit: meta.fit === 'contain' ? 'contain' : 'cover',
        background: '#ffffff',
        position: 'attention',
      })
      .extend({ top: BORDER, bottom: BORDER, left: BORDER, right: BORDER, background: '#ffffff' })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();

    n += 1;
    const id = `work-${String(n).padStart(2, '0')}`;
    const outPath = path.join(OUT, `${id}.jpg`);
    writeFileSync(outPath, out);

    entries.push({
      id,
      category: meta.category,
      ...(meta.status ? { status: meta.status } : {}),
      file: `/images/portfolio/${id}.jpg`,
      alt: meta.alt,
      thumbWidth: FINAL_W,
      thumbHeight: FINAL_H,
      fullWidth: FINAL_W,
      fullHeight: FINAL_H,
      hidden: false,
    });
    console.log(`${id}.jpg <- ${file} (${width}x${height})`);
  }

  writeFileSync(GALLERY_JSON, JSON.stringify(entries, null, 2) + '\n');
  console.log(`\nWrote ${entries.length} images and data/gallery.json`);
}

main();
