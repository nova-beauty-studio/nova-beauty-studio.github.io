/* =====================================================
   HIỆU ỨNG NGÀY LỄ – tự bật theo ngày, tự tắt khi hết lễ
   -----------------------------------------------------
   - Tắt hẳn mọi hiệu ứng lễ: đổi FESTIVE_ON = false
   - Xem thử một lễ bất kỳ: thêm vào cuối link  ?fest=weihnachten
     (silvester, valentin, fasching, ostern, muttertag, halloween)
   - Sửa câu chào: phần text de / en bên dưới
   ===================================================== */
const FESTIVE_ON = true;

(function(){
  if(!FESTIVE_ON) return;

  /* ---------- ngày lễ (tính tự động theo năm) ---------- */
  const day = (y,m,d) => new Date(y, m-1, d);
  const addDays = (dt,n) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+n);
  function easter(y){ // ngày Chủ nhật Phục Sinh (thuật toán Gauss/Meeus)
    const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
      h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
      mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;
    return day(y,mo,da);
  }
  function motherDay(y){ const x=day(y,5,1); return addDays(x, ((7-x.getDay())%7) + 7); }

  /* Trang trí bắt đầu TRƯỚC ngày lễ bao nhiêu ngày (đổi số này nếu muốn) */
  const LEAD_DAYS = 30;

  /* main = ngày lễ chính · after = còn giữ trang trí thêm bao nhiêu ngày sau lễ */
  const SEASONS = {
    weihnachten:{ main:y=>day(y,12,24), after:2,
      items:['❄','❅','❆','•','•','•'], colors:['#ffffff','#dfe8f7','#c9d8f0'], fall:'snow',
      text:{de:'🎄 Frohe Weihnachten & eine schöne Adventszeit!', en:'🎄 Merry Christmas & a lovely Advent season!'},
      bar:'linear-gradient(90deg,#7a1f2b,#a12a3a,#7a1f2b)' },
    silvester:{ main:y=>day(y,12,31), after:6,
      items:['✦','✦','✧','★'], colors:['#e0a92e','#c8902a','#f2c14e','#b8862f'], fall:'glitter',
      text:{de:'🎆 Frohes neues Jahr! Wir freuen uns auf Sie.', en:'🎆 Happy New Year! We look forward to seeing you.'},
      bar:'linear-gradient(90deg,#2a1d18,#5a4321,#2a1d18)' },
    valentin:{ main:y=>day(y,2,14), after:0,
      items:['❤','❥','♥'], colors:['#e5486b','#f27a96','#c92f55','#ffb3c4'], fall:'float',
      text:{de:'❤️ Happy Valentinstag – verwöhnen Sie sich oder Ihre Liebsten!', en:'❤️ Happy Valentine’s Day – treat yourself or your loved one!'},
      bar:'linear-gradient(90deg,#b8264b,#e5486b,#b8264b)' },
    fasching:{ main:y=>addDays(easter(y),-48), after:2, // Rosenmontag → Aschermittwoch
      items:['▬','■','●','▲'], colors:['#e53935','#fdd835','#43a047','#1e88e5','#8e24aa','#fb8c00'], fall:'confetti',
      text:{de:'🎭 Helau! Fröhliche Fastnacht!', en:'🎭 Helau! Happy Carnival!'},
      bar:'linear-gradient(90deg,#8e24aa,#1e88e5,#43a047,#fdd835,#e53935)' },
    ostern:{ main:y=>easter(y), after:1, // Ostersonntag + Ostermontag
      items:['🥚','🌷','🐣','🌼'], colors:[], fall:'drift', emoji:true,
      text:{de:'🐣 Frohe Ostern!', en:'🐣 Happy Easter!'},
      bar:'linear-gradient(90deg,#8bc34a,#f8bbd0,#fff59d,#8bc34a)' },
    muttertag:{ main:y=>motherDay(y), after:0,
      items:['🌸','💐','💗','🌷'], colors:[], fall:'drift', emoji:true,
      text:{de:'💐 Alles Liebe zum Muttertag – das perfekte Geschenk: ein Beauty-Termin!', en:'💐 Happy Mother’s Day – the perfect gift: a beauty appointment!'},
      bar:'linear-gradient(90deg,#c2185b,#f06292,#c2185b)' },
    halloween:{ main:y=>day(y,10,31), after:0,
      items:['🎃','🍂','🦇','🍁'], colors:[], fall:'drift', emoji:true,
      text:{de:'🎃 Happy Halloween!', en:'🎃 Happy Halloween!'},
      bar:'linear-gradient(90deg,#3e2723,#e65100,#3e2723)' },
  };

  /* ---------- hôm nay đang trong mùa lễ nào? ----------
     Mỗi lễ: từ (ngày lễ − LEAD_DAYS) đến (ngày lễ + after).
     Hai lễ trùng nhau (vd. Noel & Silvester) → chọn lễ có ngày chính gần hôm nay nhất. */
  const DAY_MS = 864e5;
  function currentSeason(now){
    const y=now.getFullYear(), t=day(y,now.getMonth()+1,now.getDate());
    let best=null;
    for(const [key,s] of Object.entries(SEASONS)){
      for(const yy of [y-1, y]){            // y-1: lễ cuối năm trước kéo sang tháng 1
        const m=s.main(yy), a=addDays(m,-LEAD_DAYS), b=addDays(m,s.after);
        if(t<a || t>b) continue;
        const dist=Math.abs(Math.round((m-t)/DAY_MS));
        if(!best || dist<best.dist) best={key, dist, year:m.getFullYear()};
      }
    }
    return best;
  }
  const forced = new URLSearchParams(location.search).get('fest');
  const cur = SEASONS[forced] ? {key:forced, year:new Date().getFullYear()} : currentSeason(new Date());
  if(!cur) return;
  const key = cur.key;
  const S = SEASONS[key];
  const STORE = 'nova-fest-off-' + key + '-' + cur.year;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- dải chào phía trên cùng ---------- */
  const bar = document.createElement('div');
  bar.className = 'fest-bar';
  bar.style.background = S.bar;
  bar.innerHTML = '<span class="fest-txt"></span><button type="button" class="fest-x" aria-label="Schließen">×</button>';
  document.body.prepend(bar);
  const txt = bar.querySelector('.fest-txt');
  const setText = () => { txt.textContent = S.text[document.documentElement.lang==='en'?'en':'de']; };
  setText();
  new MutationObserver(setText).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  /* ---------- hạt rơi (tuyết, tim, confetti...) ---------- */
  let canvas, ctx, parts=[], raf, W, H, dpr;
  function startParticles(){
    if(reduce || localStorage.getItem(STORE)) return;
    canvas = document.createElement('canvas');
    canvas.className = 'fest-canvas'; canvas.setAttribute('aria-hidden','true');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    const resize = () => { dpr=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight; canvas.width=W*dpr; canvas.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    resize(); addEventListener('resize', resize);
    const N = innerWidth < 600 ? 22 : 42;
    const rnd = (a,b) => a + Math.random()*(b-a);
    const make = (top) => {
      const emoji = !!S.emoji;
      return {
        x:rnd(0,W), y: top ? rnd(-H,0) : rnd(0,H),
        s: S.fall==='snow' ? rnd(10,22) : S.fall==='glitter' ? rnd(9,18) : S.fall==='confetti' ? rnd(6,11) : rnd(14,24),
        vy: S.fall==='float' ? rnd(.4,1) : S.fall==='snow' ? rnd(.5,1.4) : rnd(.6,1.6),
        vx: rnd(-.3,.3), r: rnd(0,6.28), vr: rnd(-.03,.03), sw: rnd(0,6.28),
        ch: S.items[Math.floor(Math.random()*S.items.length)],
        c: S.colors[Math.floor(Math.random()*S.colors.length)] || '#fff',
        a: rnd(.55,1), tw: rnd(0,6.28), emoji
      };
    };
    parts = Array.from({length:N}, () => make(false));
    const tick = () => {
      ctx.clearRect(0,0,W,H);
      for(const p of parts){
        p.sw += .02; p.r += p.vr; p.tw += .08;
        p.y += p.vy; p.x += p.vx + Math.sin(p.sw)*.4;
        if(p.y > H+30 || p.x < -40 || p.x > W+40) Object.assign(p, make(true), {y:-30});
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(S.fall==='snow'||S.fall==='float' ? 0 : p.r);
        ctx.globalAlpha = S.fall==='glitter' ? p.a*(.5+.5*Math.sin(p.tw)) : p.a;
        if(S.fall==='confetti'){ ctx.fillStyle=p.c; ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2*(.4+.6*Math.abs(Math.sin(p.tw)))); }
        else if(S.fall==='snow' && p.ch==='•'){ ctx.fillStyle=p.c; ctx.shadowColor='rgba(70,95,140,.55)'; ctx.shadowBlur=6; ctx.beginPath(); ctx.arc(0,0,p.s/4.5,0,6.28); ctx.fill(); }
        else { ctx.font = p.s+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
               if(!p.emoji){ ctx.fillStyle=p.c; if(S.fall==='snow'){ctx.shadowColor='rgba(70,95,140,.6)'; ctx.shadowBlur=5;} if(S.fall==='glitter'){ctx.shadowColor='rgba(240,190,70,.9)'; ctx.shadowBlur=8;} }
               ctx.fillText(p.ch,0,0); }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    /* dừng khi khách chuyển tab cho đỡ tốn pin */
    document.addEventListener('visibilitychange', () => { if(document.hidden) cancelAnimationFrame(raf); else { cancelAnimationFrame(raf); tick(); } });
  }
  startParticles();

  /* bấm × : tắt dải chào + hạt rơi (nhớ trong mùa lễ này) */
  bar.querySelector('.fest-x').onclick = () => {
    bar.remove(); localStorage.setItem(STORE,'1');
    if(canvas){ cancelAnimationFrame(raf); canvas.remove(); }
  };
  if(localStorage.getItem(STORE)) bar.remove();
  document.documentElement.classList.add('fest-'+key);
})();
