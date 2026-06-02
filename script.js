document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const beforeAfterRange = document.getElementById('beforeAfterRange');
  const afterImage = document.getElementById('afterImage');
  const heroPanel = document.querySelector('.hero-panel');

  function updateFilter(category) {
    projectCards.forEach((card) => {
      const matches = category === 'all' || card.dataset.category === category;
      card.style.display = matches ? 'block' : 'none';
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      updateFilter(button.dataset.filter);
    });
  });

  const beforeImageTag = document.getElementById('beforeImageTag');
  const afterImageTag = document.getElementById('afterImageTag');
  const pairCounter = document.getElementById('pairCounter');
  const prevPair = document.getElementById('prevPair');
  const nextPair = document.getElementById('nextPair');

  const comparisonImages = [
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0001.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0002.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0003.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0004.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0005.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0006.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0007.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0008.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0009.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0010.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0011.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0012.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0013.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0014.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0015.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0016.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0017.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0018.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0019.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0020.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0021.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0022.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0023.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0024.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0025.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0026.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0027.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0028.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0029.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0030.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0031.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0032.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0033.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0034.jpg',
    'file:///C:/Users/Admin/Desktop/ilovepdf_pages-to-jpg/Pre-production_WORK_page-0035.jpg'
  ];

  let activePairIndex = 0;

  function updatePairDisplay() {
    const beforeSrc = comparisonImages[activePairIndex];
    const afterSrc = comparisonImages[(activePairIndex + 1) % comparisonImages.length];
    if (beforeImageTag) beforeImageTag.src = beforeSrc;
    if (afterImageTag) afterImageTag.src = afterSrc;
    if (pairCounter) pairCounter.textContent = `${activePairIndex + 1} / ${comparisonImages.length - 1}`;
  }

  if (prevPair) {
    prevPair.addEventListener('click', () => {
      activePairIndex = (activePairIndex - 1 + comparisonImages.length - 1) % (comparisonImages.length - 1);
      updatePairDisplay();
    });
  }

  if (nextPair) {
    nextPair.addEventListener('click', () => {
      activePairIndex = (activePairIndex + 1) % (comparisonImages.length - 1);
      updatePairDisplay();
    });
  }

  if (beforeAfterRange && afterImage) {
    const updateAfterPosition = () => {
      afterImage.style.width = `${beforeAfterRange.value}%`;
    };
    beforeAfterRange.addEventListener('input', updateAfterPosition);
    updateAfterPosition();
  }

  updatePairDisplay();

  if (heroPanel) {
    window.addEventListener('mousemove', (event) => {
      const rect = heroPanel.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      heroPanel.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    heroPanel.addEventListener('mouseleave', () => {
      heroPanel.style.transform = 'none';
    });
  }

  const links = document.querySelectorAll('.main-nav a[href^="#"], .nav-links a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

(function particleEffect() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function makeParticle() {
    return {
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.45, -0.08),
      r: rand(0.6, 2.4),
      alpha: rand(0.12, 0.36),
      hue: Math.round(rand(180, 240))
    };
  }

  for (let i = 0; i < 90; i += 1) particles.push(makeParticle());

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha *= 0.9995;
      if (p.y < -20 || p.alpha < 0.02 || p.x < -40 || p.x > w + 40) {
        Object.assign(p, makeParticle(), { y: h + 20 });
      }
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
      gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.alpha})`);
      gradient.addColorStop(1, `hsla(${p.hue}, 40%, 12%, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  draw();
})();

