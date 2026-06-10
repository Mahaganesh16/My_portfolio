// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1900);
});

// ── PARTICLE CANVAS ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '124,92,252' : '0,212,170';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}
for (let i = 0; i < 120; i++) particles.push(new Particle());
let mouseX = W / 2, mouseY = H / 2;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  // connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,92,252,${(1 - dist / 100) * 0.12})`;
        ctx.stroke();
      }
    }
    // mouse attraction
    const dx = mouseX - particles[i].x;
    const dy = mouseY - particles[i].y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 150) {
      particles[i].vx += dx * 0.00008;
      particles[i].vy += dy * 0.00008;
    }
    particles[i].update(); particles[i].draw();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();



// ── RIPPLE ON CLICK ──
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:20px;height:20px;position:fixed;z-index:9998;margin-left:-10px;margin-top:-10px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});



// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // skill bars
      e.target.querySelectorAll('.skill-fill').forEach(b => { b.style.width = b.dataset.width + '%'; e.target.classList.add('skill-active'); });
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.skill-item').forEach(el => revealObs.observe(el));

// ── ANIMATED COUNTERS ──
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.count-num').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.decimal === '1';
        let start = 0; const dur = 1800; const startTime = performance.now();
        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / dur, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const val = start + (target - start) * ease;
          el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.about-stats').forEach(el => counterObs.observe(el));

// ── 3D TILT CARDS ──
document.querySelectorAll('.project-card,.stat-card,.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx2 = ((e.clientY - cy) / rect.height) * -12;
    const ry2 = ((e.clientX - cx) / rect.width) * 12;
    card.style.transform = `perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-6px) scale(1.02)`;
    // move glow
    const glow = card.querySelector('.card-glow');
    if (glow) { glow.style.left = (e.clientX - rect.left) + 'px'; glow.style.top = (e.clientY - rect.top) + 'px'; glow.style.opacity = '1'; }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    const glow = card.querySelector('.card-glow');
    if (glow) glow.style.opacity = '0';
  });
});

// ── TYPING EFFECT ──
const roles = ['Full-Stack Web Developer', 'PHP Backend Developer', 'Frontend Engineer', 'UI/UX Builder', 'Web Solutions Expert'];
let ri = 0, ci = 0, del = false;
const roleEl = document.getElementById('roleText');
function type() {
  const word = roles[ri];
  if (!del) {
    ci++;
    roleEl.innerHTML = word.slice(0, ci) + '<span class="cursor-blink"></span>';
    if (ci === word.length) { del = true; setTimeout(type, 2200); return; }
  } else {
    ci--;
    roleEl.innerHTML = word.slice(0, ci) + '<span class="cursor-blink"></span>';
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, del ? 45 : 85);
}
setTimeout(type, 2200);

// ── ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navAs.forEach(a => {
    const active = a.getAttribute('href') === '#' + cur;
    a.querySelector('span').style.color = active ? 'var(--text)' : '';
  });
});

// ── SKILL BARS on section enter ──
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(b => { b.style.width = b.dataset.width + '%'; });
    }
  });
}, { threshold: 0.2 });
const skillSec = document.getElementById('skills');
if (skillSec) skillObs.observe(skillSec);

// ── NAV SCROLL SHRINK ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 60) { nav.style.padding = '12px 52px'; } else { nav.style.padding = '18px 52px'; }
  nav.style.transition = 'padding 0.4s';
});

// ── MAGNETIC BUTTONS ──
document.querySelectorAll('.btn-mag').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.2}px, ${dy * 0.3}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});
