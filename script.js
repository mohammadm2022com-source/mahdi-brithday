const paragraphs = [
  'سلام مهدی عزیز...',
  'امیدوارم این روز برات پر از شادی و خوشی باشه.',
  'از تمام زحماتت و همراهیت ممنونم.',
  'آرزو می‌کنم همیشه موفق و سالم باشی.',
  'تولدت مبارک 🌹🎂'
];

const envelope = document.getElementById('envelope');
const letterWrap = document.getElementById('letter-wrap');
const typedText = document.getElementById('typed-text');
const music = document.getElementById('bg-music');
const openSfx = document.getElementById('open-sfx');
const musicBtn = document.getElementById('music-btn');
let petalTimer, musicOn = false;

// ===== آسمان شب + ستاره =====
(function initStars() {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    stars = Array.from({length: 160}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + .3,
      a: Math.random(),
      speed: Math.random() * .008 + .003
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // گرادیان آسمان شب
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#060d1a');
    grad.addColorStop(1, '#0d1f3c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ستاره‌ها
    stars.forEach(s => {
      s.a += s.speed;
      const alpha = .4 + .6 * Math.abs(Math.sin(s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,220,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();

// ===== ذرات نور =====
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let pts = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }

  function spawnParticle() {
    pts.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - .5) * .6,
      vy: -(Math.random() * .8 + .3),
      life: 1,
      r: Math.random() * 2 + 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < .15) spawnParticle();
    pts = pts.filter(p => p.life > 0);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life -= .004;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,100,${p.life * .7})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();

// ===== باز کردن نامه =====
function openLetter() {
  openSfx.play().catch(() => {});
  envelope.classList.add('open');

  setTimeout(() => {
    envelope.parentElement.style.display = 'none';
    letterWrap.classList.add('show');
    typedText.innerHTML = '';
    let i = 0;
    function addParagraph() {
      if (i >= paragraphs.length) return;
      const p = document.createElement('p');
      p.textContent = paragraphs[i++];
      typedText.appendChild(p);
      setTimeout(addParagraph, 1400);
    }
    addParagraph();
    startPetals();
    if (!musicOn) { music.play().then(() => { musicOn = true; musicBtn.textContent = '🔊'; }).catch(() => {}); }
  }, 750);
}

// ===== بستن نامه =====
function closeLetter() {
  letterWrap.classList.remove('show');
  stopPetals();
  const wrap = document.getElementById('envelope-wrap');
  wrap.style.display = '';
  envelope.classList.remove('open');
}

// ===== گلبرگ‌ها =====
function startPetals() {
  petalTimer = setInterval(() => {
    const d = document.createElement('div');
    d.className = 'petal';
    d.textContent = ['🌹','🌸','🌺'][Math.floor(Math.random() * 3)];
    d.style.left = Math.random() * 100 + 'vw';
    d.style.animationDuration = (6 + Math.random() * 5) + 's';
    d.style.fontSize = (16 + Math.random() * 14) + 'px';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 11000);
  }, 400);
}

function stopPetals() {
  clearInterval(petalTimer);
  document.querySelectorAll('.petal').forEach(e => e.remove());
}

// ===== موسیقی =====
function toggleMusic() {
  if (musicOn) { music.pause(); musicOn = false; musicBtn.textContent = '🔇'; }
  else { music.play().catch(() => {}); musicOn = true; musicBtn.textContent = '🔊'; }
}
