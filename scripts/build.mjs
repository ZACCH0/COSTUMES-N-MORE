import fs from 'node:fs';import path from 'node:path';
import { renderFilters, renderTiles } from './gallery.mjs';
import { renderServiceOptions } from './contact-form.mjs';
const R=path.resolve(import.meta.dirname,'..'),D=path.join(R,'dist');
const cfg=JSON.parse(fs.readFileSync(path.join(R,'data/site.config.json'),'utf8'));
const rd=p=>fs.readFileSync(path.join(R,p),'utf8');
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
fs.rmSync(D,{recursive:true,force:true});fs.mkdirSync(path.join(D,'css'),{recursive:true});fs.mkdirSync(path.join(D,'js'),{recursive:true});
fs.writeFileSync(path.join(D,'css/site.css'),rd('src/design-system.css')+'\n'+rd('src/site.css'));
fs.cpSync(path.join(R,'src/js'),path.join(D,'js'),{recursive:true});
const galleryItems=JSON.parse(rd('data/gallery.json'));
if(fs.existsSync(path.join(R,'public')))fs.cpSync(path.join(R,'public'),D,{recursive:true});
const nav=(key,cls)=>cfg.nav.map(n=>`<a href="${n.href}"${n.key===key?' aria-current="page"':''}>${n.label}</a>`).join('');
const social=cfg.socials.map(s=>s.id==='email'?`<div class="handle"><h3>${s.label}</h3><p class="user">${esc(s.user)}</p><div class="actions"><button class="btn btn-gold btn-sm" type="button" data-email-user="${cfg.email.user}" data-email-domain="${cfg.email.domain}">${s.open}</button><span class="mail-out" role="status" aria-live="polite"></span></div><p class="toast" role="status" aria-live="polite"></p></div>`:`<div class="handle"><h3>${s.label}</h3><p class="user">${esc(s.user)}</p><div class="actions"><button class="btn btn-gold btn-sm" type="button" data-copy="${esc(s.user)}" aria-label="Copy ${s.label} username ${esc(s.user)}">Copy username</button><a class="btn btn-ghost btn-sm" href="${s.url}" target="_blank" rel="noopener noreferrer">${s.open}</a></div><p class="toast" role="status" aria-live="polite"></p></div>`).join('');
const footIcon=s=>s.id==='discord'?'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.319 13.58.099 18.058a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.009c.12.099.246.198.373.292a.077.077 0 01-.006.128 12.3 12.3 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.029 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>':s.id==='instagram'?'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>';
const footSocial=cfg.socials.filter(s=>s.id!=='tiktok'&&s.id!=='coming-soon'&&s.id!=='email').map(s=>`<li class="foot-item"><button type="button" class="foot-icon" data-foot-toggle="foot-${s.id}" aria-expanded="false" aria-controls="foot-${s.id}" aria-label="Show ${s.label} username">${footIcon(s)}</button><div class="foot-pop handle" id="foot-${s.id}" hidden><p class="foot-user">${esc(s.user)}</p><p class="foot-row"><button class="btn btn-gold btn-sm" type="button" data-copy="${esc(s.user)}" aria-label="Copy ${s.label} username ${esc(s.user)}">Copy</button><a class="btn btn-ghost btn-sm" href="${s.url}" target="_blank" rel="noopener noreferrer">Open</a></p><p class="toast" role="status" aria-live="polite"></p></div></li>`).join('');
const fill=(t,v)=>t.replace(/{{(\w+)}}/g,(_,k)=>v[k]??'');
const statusOpen=!(cfg.status&&cfg.status.commissions==='closed');
const statusLabel=esc(statusOpen?(cfg.status&&cfg.status.openLabel||'Commissions open'):(cfg.status&&cfg.status.closedLabel||'Commissions currently closed'));
const statusBanner=`<a class="status-banner ${statusOpen?'':'is-closed'}" href="/contact"><span aria-hidden="true">&#128062;</span> ${statusLabel}</a>`;
const heroBadge=statusOpen?`<p class="hero-badge" aria-label="Commissions open"><span aria-hidden="true">&#10084;</span> Commissions open</p>`:`<p class="hero-badge is-closed" aria-label="Commissions currently closed"><span aria-hidden="true">&#128062;</span> Commissions closed</p>`;
const ig=cfg.socials.find(s=>s.id==='instagram');
const contactLead=statusOpen
  ?'Tell me about the character or project you have in mind. Fursuits, fursona design, VRChat avatars, VTuber avatars and custom requests are all open.'
  :'Tell me about the character or project you have in mind. Commission slots are currently closed — follow us on Instagram and check back for the next opening.';
const formClosedNote=statusOpen
  ?''
  :`<div class="form-closed" role="status"><h2 class="h2">Commissions are currently closed</h2><p>The commission form is paused right now. Follow us on <a href="${ig?ig.url:'https://www.instagram.com/costumesandmorefursuits'}">Instagram</a> to catch the next opening, or check back soon.</p></div>`;
const formHiddenAttr=statusOpen?'':' hidden';
const urls=[];
for(const f of fs.readdirSync(path.join(R,'src/pages'))){
  const key=f.replace('.html','');let src=rd('src/pages/'+f);
  const m=src.match(/^<!--meta ([\s\S]*?) -->\r?\n/);const meta=JSON.parse(m[1]);const socialBlock=fill(rd('src/partials/social.html'),{socialItems:social});
  const body=fill(src.slice(m[0].length),{social:socialBlock,galleryFilters:renderFilters(galleryItems),galleryTiles:renderTiles(galleryItems),serviceOptions:renderServiceOptions(cfg.services),web3formsKey:esc(cfg.forms.accessKey),heroBadge,contactLead,formClosedNote,formHiddenAttr});
  const route=key==='index'?'/':'/'+key;const canonical=cfg.domain+(key==='index'?'/':route);
  const vars={title:esc(meta.title),description:esc(meta.description),canonical,ogImage:cfg.domain+'/og-image.jpg'};
  let head=fill(rd('src/partials/head.html'),vars)+(meta.noindex?'<meta name="robots" content="noindex">':'');
  for(const data of meta.jsonLd||[])head+=`<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  if(key==='index')head+=`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Organization",name:"Costumes N More",url:cfg.domain+'/',sameAs:cfg.socials.map(s=>s.url).filter(u=>/^https?:\/\//.test(u))})}</script>`;
  if(key==='index')head+=`<link rel="preload" as="image" href="/images/portfolio/work-16.jpg" imagesrcset="/images/portfolio/work-16.jpg 1080w" imagesizes="100vw" fetchpriority="high">`;
  const header=fill(rd('src/partials/header.html'),{navLinks:nav(key),navLinksMobile:nav(key),statusBanner});
  const footer=fill(rd('src/partials/footer.html'),{navLinks:nav(key),social:socialBlock,footSocial,emailUser:cfg.email.user,emailDomain:cfg.email.domain});
  const html=`<!doctype html>\n<html lang="en"><head>${head}</head><body>${header}${body}${footer}</body></html>\n`;
  fs.writeFileSync(path.join(D,f),html);
  if(!meta.noindex)urls.push(canonical);
}
fs.writeFileSync(path.join(D,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`<url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(D,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${cfg.domain}/sitemap.xml\n`);
console.log('Built',urls.length,'indexable pages + 404');
