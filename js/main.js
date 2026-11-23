/* =====================================================
   XỬ LÝ CỦA TRANG – thường không cần sửa file này
   ===================================================== */
const $ = s => document.querySelector(s);
/* ngôn ngữ: lựa chọn trước đó, nếu chưa có thì theo ngôn ngữ của máy khách */
const savedLang = localStorage.getItem('nova-lang');
let lang = T[savedLang] ? savedLang : ((navigator.language||'de').toLowerCase().startsWith('de') ? 'de' : 'en');
let shown = PAGE;
const eur = n => n.toLocaleString(lang==='de'?'de-DE':'en-GB',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const star = n => '★'.repeat(n) + '☆'.repeat(5-n);
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COLORS = ['#b8893f','#a3505f','#c98b8b','#8a6d9e','#6e9a8a','#c7865a'];

const CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
const eur2 = n => n.toLocaleString(lang==='de'?'de-DE':'en-GB',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' €';
/* mô tả nhiều dòng "• A\n• B" -> "A · B" */
const descLine = d => d.split('\n').map(x=>x.replace(/^\s*•\s*/,'').trim()).filter(Boolean).join(' · ');

function renderPrices(){
  $('#chips').innerHTML = SERVICES.map((c,ci)=>`<a href="#cat-${ci}" style="--c:${c.color}">${c.cat[lang]}</a>`).join('');
  $('#cats').innerHTML = SERVICES.map((c,ci)=>`
    <div class="mcat" id="cat-${ci}" style="--c:${c.color}">
      <div class="mcat-h"><h3>${c.cat[lang]}</h3><span>${c.items.length} ${T[lang].avail}</span></div>
      ${c.items.map(s=>`
        <div class="svc-item">
          <div class="l">
            <p class="nm">${s.name[lang]}</p>
            ${s.desc?`<p class="ds">${esc(descLine(s.desc[lang]))}</p>`:''}
            <span class="du">${CLOCK}${s.min} ${T[lang].min}</span>
          </div>
          <span class="pr">${eur2(s.price)}</span>
        </div>`).join('')}
    </div>`).join('');
}
function renderHours(){
  const now=new Date(), d=now.getDay(), h=now.getHours()+now.getMinutes()/60, t=HOURS[d];
  const fmt=x=>String(Math.floor(x)).padStart(2,'0')+':'+String(Math.round((x%1)*60)).padStart(2,'0');
  const isOpen=t&&h>=t[0]&&h<t[1];
  const bd=$('#open-badge'); bd.className='badge-open '+(isOpen?'on':'off'); bd.textContent=isOpen?T[lang].open_now:T[lang].closed_now;
  $('#today-hrs').textContent=`${T[lang].today}: ${t?fmt(t[0])+' - '+fmt(t[1]):T[lang].closed}`;
  $('#hrs-list').innerHTML=[1,2,3,4,5,6,0].map(i=>`<li class="${i===d?'today':''}"><span>${T[lang].days[i]}</span><span>${HOURS[i]?fmt(HOURS[i][0])+' - '+fmt(HOURS[i][1]):T[lang].closed}</span></li>`).join('');
}
/* ngày "2026-11-20" -> "vor 3 Tagen" / "3 days ago" */
function ago(iso){
  const d = new Date(iso); if(isNaN(d)) return esc(iso);
  const days = Math.max(0, Math.round((Date.now()-d)/864e5));
  const rtf = new Intl.RelativeTimeFormat(lang==='de'?'de':'en',{numeric:'auto'});
  if(days < 30) return rtf.format(-days,'day');
  if(days < 365) return rtf.format(-Math.round(days/30),'month');
  return rtf.format(-Math.round(days/365),'year');
}
const fmtDate = iso => { const d=new Date(iso); return isNaN(d)?esc(iso):d.toLocaleDateString(lang==='de'?'de-DE':'en-GB',{day:'numeric',month:'short',year:'numeric'}); };
const STAR_ROW = n => `<span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(5-n)}</span></span>`;

function renderReviews(){
  const list = [...REVIEWS].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const n = list.length;
  if(!n){ $('#bewertungen').hidden = true; return; }
  const avg = list.reduce((a,r)=>a+r.stars,0)/n;
  $('#avg').textContent = lang==='de' ? avg.toFixed(1).replace('.',',') : avg.toFixed(1);
  $('#avg-stars').innerHTML = STAR_ROW(Math.round(avg));
  $('#count').textContent = `${T[lang].r_from} ${n} ${T[lang].reviews}`;
  $('#bars').innerHTML = [5,4,3,2,1].map(s=>{const c=list.filter(r=>r.stars===s).length;
    return `<div class="bar"><span>${s} <i>★</i></span><div><b style="width:${n?c/n*100:0}%"></b></div><em>${c}</em></div>`}).join('');
  $('#rv').innerHTML = list.slice(0,shown).map((r,i)=>`<article class="rv">
    <div class="rv-top"><span class="av" style="background:${COLORS[i%COLORS.length]}">${esc(r.name.trim()[0]||'?').toUpperCase()}</span>
      <div><div class="nm"><b>${esc(r.name)}</b>${r.source?`<span class="src">${T[lang].src_from} ${esc(r.source)}</span>`:''}${r.sample?`<span class="tag">${T[lang].sample}</span>`:''}</div>
      <div class="meta">${STAR_ROW(r.stars)}<small>· ${ago(r.date)}</small></div></div></div>
    <p class="txt">„${esc(r.text)}“</p>
    ${r.reply?`<div class="reply"><b>${T[lang].owner_reply}</b>${r.reply.date?` · <small>${fmtDate(r.reply.date)}</small>`:''}<p>${esc(r.reply.text)}</p></div>`:''}
    ${r.link?`<a class="view" href="${esc(r.link)}" target="_blank" rel="noopener">${T[lang].view_on} ${esc(r.source||'Google')} ↗</a>`:''}
  </article>`).join('');
  $('#more-btn').hidden = shown >= n;
}
$('#more-btn').onclick = () => { shown += PAGE; renderReviews(); };

function setLinks(){
  document.querySelectorAll('.js-wa').forEach(a=>a.href=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(T[lang].wa)}`);
  document.querySelectorAll('.js-fb').forEach(a=>a.href=FACEBOOK);
  /* đánh giá Google: ẩn nút nếu chưa có link */
  document.querySelectorAll('.js-review').forEach(a=>{a.href=GOOGLE_REVIEW_URL; a.hidden=!GOOGLE_REVIEW_URL;});
  document.querySelectorAll('.js-review-all').forEach(a=>{a.href=GOOGLE_REVIEWS_ALL; a.hidden=!GOOGLE_REVIEWS_ALL;});
  /* bản đồ */
  const q = encodeURIComponent(ADDRESS);
  document.querySelectorAll('.js-route').forEach(a=>a.href=`https://www.google.com/maps/dir/?api=1&destination=${q}`);
  document.querySelectorAll('.js-maps').forEach(a=>a.href=`https://www.google.com/maps/search/?api=1&query=${q}`);
  const map=$('#map'), src=`https://www.google.com/maps?q=${q}&hl=${lang}&z=16&output=embed`;
  if(map.getAttribute('src')!==src) map.src=src;
  $('#addr-text').textContent = ADDRESS;
}
function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const v=T[lang][el.dataset.i18n]; if(v) el.innerHTML=v;});
  document.querySelectorAll('.flag').forEach(b=>b.classList.toggle('on',b.dataset.lang===lang));
  renderPrices(); renderHours(); renderReviews(); setLinks();
}
const tip = document.getElementById('lang-tip');
const hideTip = () => { tip.hidden = true; localStorage.setItem('nova-tip','1'); };
document.querySelectorAll('.flag').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem('nova-lang',lang);hideTip();applyLang();});
/* bong bóng gợi ý đổi ngôn ngữ: chỉ hiện lần đầu, tự ẩn sau vài giây */
if(!savedLang && !localStorage.getItem('nova-tip')){
  setTimeout(()=>{ tip.hidden = false; }, 1000);   // hiện sau 1 giây
  setTimeout(hideTip, 4000);                        // tự ẩn sau 3 giây hiển thị
}
tip.querySelector('button').onclick = hideTip;

/* videos */
document.querySelectorAll('.vid').forEach(v=>v.addEventListener('click',()=>{
  const vid=v.querySelector('video');
  document.querySelectorAll('.vid video').forEach(o=>{if(o!==vid){o.pause();o.parentElement.classList.remove('playing')}});
  if(vid.paused){vid.play();v.classList.add('playing')}else{vid.pause();v.classList.remove('playing')}
}));

/* lightbox */
const imgs=[...document.querySelectorAll('#gal img')], lb=$('#lb'); let cur=0;
const show=i=>{cur=(i+imgs.length)%imgs.length;lb.querySelector('img').src=imgs[cur].src;lb.classList.add('on')};
imgs.forEach((im,i)=>im.parentElement.onclick=()=>show(i));
lb.querySelector('.x').onclick=()=>lb.classList.remove('on');
lb.querySelector('.pv').onclick=e=>{e.stopPropagation();show(cur-1)};
lb.querySelector('.nx').onclick=e=>{e.stopPropagation();show(cur+1)};
lb.onclick=e=>{if(e.target===lb)lb.classList.remove('on')};
document.addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
let tx=0; lb.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))});

$('#year').textContent = new Date().getFullYear();
applyLang();
