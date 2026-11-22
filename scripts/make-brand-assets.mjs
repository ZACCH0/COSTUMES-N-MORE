// Generates the Costumes N More brand assets used by every page:
//   public/og-image.jpg        1200x630 social share card
//   public/favicon.png         48x48 browser icon
//   public/apple-touch-icon.png 180x180 home-screen icon
// Run with: node scripts/make-brand-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const R = path.resolve(import.meta.dirname, '..');
const OUT = path.join(R, 'public');
const PHOTO = path.join(R, 'public/images/portfolio/work-01.jpg');

const CREAM = '#FBF6EC';
const CORAL = '#FF7A59';
const TEAL = '#0E4A4E';
const MIST = '#D8E2DE';

// --- Social share card -------------------------------------------------------
// Text panel on the left, one real Costumes N More photo on the right.
const W = 1200;
const H = 630;
const panelW = 660;

const panel = Buffer.from(`<svg width="${panelW}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${panelW}" height="${H}" fill="${TEAL}"/>
  <rect x="${panelW - 26}" y="60" width="4" height="${H - 120}" fill="${CORAL}"/>
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="70" y="242" font-size="78" font-weight="700" fill="${CREAM}" letter-spacing="1">COSTUMES</text>
    <text x="70" y="330" font-size="78" font-weight="700" fill="${CORAL}" letter-spacing="1">N MORE</text>
    <text x="70" y="412" font-size="33" fill="${CREAM}">Every character has a story.</text>
    <text x="70" y="454" font-size="33" fill="${CREAM}">Let's bring yours to life.</text>
    <text x="70" y="540" font-size="25" fill="${MIST}">Custom fursuits  ·  Fursona  ·  Avatars</text>
  </g>
</svg>`);

const photo = await sharp(PHOTO)
  .resize(W - panelW, H, { fit: 'cover', position: 'attention' })
  .toBuffer();

await sharp({ create: { width: W, height: H, channels: 3, background: TEAL } })
  .composite([
    { input: panel, left: 0, top: 0 },
    { input: photo, left: panelW, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(OUT, 'og-image.jpg'));

// --- Paw-print icon ----------------------------------------------------------
const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="${TEAL}"/>
  <g fill="${CREAM}">
    <ellipse cx="256" cy="352" rx="96" ry="80"/>
    <ellipse cx="137" cy="228" rx="42" ry="52" transform="rotate(-22 137 228)"/>
    <ellipse cx="218" cy="178" rx="45" ry="55" transform="rotate(-8 218 178)"/>
    <ellipse cx="300" cy="178" rx="45" ry="55" transform="rotate(8 300 178)"/>
    <ellipse cx="379" cy="228" rx="42" ry="52" transform="rotate(22 379 228)"/>
  </g>
</svg>`;
const icon = Buffer.from(iconSvg);

await sharp(icon).resize(48, 48).png().toFile(path.join(OUT, 'favicon.png'));
await sharp(icon).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));

// The old FLORAL VOID logo is no longer part of this site.
const oldLogo = path.join(OUT, 'images/brand/Floral void.png');
if (fs.existsSync(oldLogo)) fs.rmSync(oldLogo);
const oldLogoDir = path.join(OUT, 'images/brand');
if (fs.existsSync(oldLogoDir) && fs.readdirSync(oldLogoDir).length === 0) fs.rmdirSync(oldLogoDir);

console.log('Wrote og-image.jpg, favicon.png and apple-touch-icon.png; removed the old FLORAL VOID logo.');
