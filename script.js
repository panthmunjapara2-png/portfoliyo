/* ============================================================
   Panth Munjapara Portfolio — Dynamic Rendering Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- State ---- */
  let contentData = null;
  let allCards = [];
  let visibleCount = 12;
  const LOAD_STEP = 12;
  let activeFilter = 'all';
  let lightboxItems = [];
  let lightboxIndex = 0;

  /* ---- DOM refs ---- */
  const portfolioGrid = document.getElementById('portfolioGrid');
  const gridSkeleton = document.getElementById('gridSkeleton');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const loadMoreCount = document.getElementById('loadMoreCount');
  const videoGrid = document.getElementById('videoGrid');
  const videoSkeleton = document.getElementById('videoSkeleton');
  const featuredGrid = document.getElementById('featuredGrid');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const beforeAfterRange = document.getElementById('beforeAfterRange');
  const afterImage = document.getElementById('afterImage');
  const heroPanel = document.querySelector('.hero-panel');
  const beforeImageTag = document.getElementById('beforeImageTag');
  const afterImageTag = document.getElementById('afterImageTag');
  const pairCounter = document.getElementById('pairCounter');
  const prevPair = document.getElementById('prevPair');
  const nextPair = document.getElementById('nextPair');

  /* Lightbox refs */
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDetail = document.getElementById('lightboxDetail');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  /* ============================================================
     1. FETCH & RENDER CONTENT
     ============================================================ */
  fetch('content.json')
    .then(res => res.json())
    .then(data => {
      contentData = data;
      buildAllCards(data.portfolio);
      renderPortfolioGrid();
      renderFeaturedGrid(data.videos.youtube);
      renderVideoGrid(data.videos);
      initComparisonSlider(data.comparisonPairs);
      if (gridSkeleton) gridSkeleton.remove();
      if (videoSkeleton) videoSkeleton.remove();
    })
    .catch(err => {
      console.error('Failed to load content.json:', err);
      if (gridSkeleton) gridSkeleton.innerHTML = '<p style="color:#f87171;text-align:center;grid-column:1/-1;">Failed to load portfolio data.</p>';
    });

  /* ============================================================
     2. BUILD CARD DATA
     ============================================================ */
  function buildAllCards(portfolio) {
    allCards = [];
    for (const [category, items] of Object.entries(portfolio)) {
      items.forEach(item => {
        allCards.push({ ...item, category });
      });
    }
  }

  /* ============================================================
     3. PORTFOLIO GRID RENDERING
     ============================================================ */
  function renderPortfolioGrid() {
    const filtered = activeFilter === 'all'
      ? allCards
      : allCards.filter(c => c.category === activeFilter);

    /* Clear existing cards (keep skeleton if present) */
    Array.from(portfolioGrid.querySelectorAll('.project-card')).forEach(el => el.remove());

    const toShow = filtered.slice(0, visibleCount);
    const fragment = document.createDocumentFragment();

    toShow.forEach((item, idx) => {
      const card = createProjectCard(item, idx);
      fragment.appendChild(card);
    });

    portfolioGrid.appendChild(fragment);

    /* Load more button */
    if (filtered.length > visibleCount) {
      loadMoreWrap.style.display = 'flex';
      loadMoreCount.textContent = `Showing ${toShow.length} of ${filtered.length}`;
    } else {
      loadMoreWrap.style.display = 'none';
    }

    /* Update lightbox items list */
    lightboxItems = toShow;

    /* Observe for fade-in */
    observeCards();
  }

  function createProjectCard(item, index) {
    const article = document.createElement('article');
    article.className = 'project-card card-hidden';
    article.dataset.category = item.category;
    article.dataset.index = index;

    const categoryLabels = {
      environment: 'Environment Art',
      game: 'Game Asset',
      concept: 'Concept Art',
      personal: 'Personal Project'
    };

    article.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%23161622%22 width=%22400%22 height=%22300%22/><text x=%2250%25%22 y=%2250%25%22 fill=%22%23555%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Inter%22 font-size=%2216%22>Image not found</text></svg>'">
      <div class="project-overlay">
        <p>${categoryLabels[item.category] || item.category}</p>
        <h3>${item.title}</h3>
      </div>
    `;

    article.addEventListener('click', () => {
      openLightbox(index);
    });

    return article;
  }

  /* ============================================================
     4. FILTER BUTTONS
     ============================================================ */
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeFilter = button.dataset.filter;
      visibleCount = LOAD_STEP;
      renderPortfolioGrid();
    });
  });

  /* ============================================================
     5. LOAD MORE
     ============================================================ */
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += LOAD_STEP;
      renderPortfolioGrid();
      /* Smooth scroll to new cards */
      const cards = portfolioGrid.querySelectorAll('.project-card');
      if (cards.length > visibleCount - LOAD_STEP) {
        cards[visibleCount - LOAD_STEP].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ============================================================
     6. INTERSECTION OBSERVER — FADE IN
     ============================================================ */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function observeCards() {
    portfolioGrid.querySelectorAll('.project-card.card-hidden').forEach(card => {
      fadeObserver.observe(card);
    });
  }

  /* ============================================================
     7. FEATURED GRID (YouTube)
     ============================================================ */
  function renderFeaturedGrid(youtubeVideos) {
    if (!featuredGrid || !youtubeVideos) return;
    const fragment = document.createDocumentFragment();

    youtubeVideos.forEach(vid => {
      const article = document.createElement('article');
      article.className = 'featured-card glass-card';
      article.innerHTML = `
        <div class="featured-thumb" style="padding:0; min-height:280px; position:relative; overflow:hidden;">
          <iframe src="https://www.youtube.com/embed/${vid.videoId}" title="${vid.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:0; border-radius:24px;"></iframe>
        </div>
        <div class="featured-copy">
          <p class="eyebrow">Video Case Study</p>
          <h3>${vid.title}</h3>
          <p>${vid.description}</p>
          <ul>
            <li>Format: YouTube video</li>
            <li>Topic: Cinematic environment workflow</li>
            <li><a href="https://www.youtube.com/watch?v=${vid.videoId}" target="_blank" rel="noopener">Open on YouTube</a></li>
          </ul>
        </div>
      `;
      fragment.appendChild(article);
    });

    featuredGrid.appendChild(fragment);
  }

  /* ============================================================
     8. VIDEO GRID (Google Drive + YouTube)
     ============================================================ */
  function renderVideoGrid(videos) {
    if (!videoGrid) return;
    const fragment = document.createDocumentFragment();

    /* Google Drive videos */
    if (videos.local) {
      videos.local.forEach(vid => {
        if (!vid.driveId) return; /* Skip videos without Drive IDs */
        const card = document.createElement('div');
        card.className = 'video-card glass-card';
        card.innerHTML = `
          <div class="video-meta">
            <p class="eyebrow">Reel Preview</p>
            <h3>${vid.title}</h3>
            <p>${vid.description}</p>
          </div>
          <div class="video-embed-wrap">
            <iframe src="https://drive.google.com/file/d/${vid.driveId}/preview" allow="autoplay" allowfullscreen loading="lazy"></iframe>
          </div>
        `;

        fragment.appendChild(card);
      });
    }

    videoGrid.appendChild(fragment);
  }

  /* ============================================================
     9. LIGHTBOX
     ============================================================ */
  function openLightbox(index) {
    if (!lightboxOverlay || !lightboxItems.length) return;
    lightboxIndex = index;
    updateLightboxContent();
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = lightboxItems[lightboxIndex];
    if (!item) return;
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDetail.textContent = `${item.detail} — ${item.description}`;
  }

  function lightboxPrevFn() {
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightboxContent();
  }

  function lightboxNextFn() {
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', lightboxPrevFn);
  if (lightboxNext) lightboxNext.addEventListener('click', lightboxNextFn);
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }

  /* Keyboard navigation */
  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrevFn();
    if (e.key === 'ArrowRight') lightboxNextFn();
  });

  /* ============================================================
     10. BEFORE / AFTER COMPARISON SLIDER
     ============================================================ */
  let comparisonPairs = [];
  let activePairIndex = 0;

  function initComparisonSlider(pairs) {
    if (!pairs || !pairs.length) return;
    comparisonPairs = pairs;
    activePairIndex = 0;
    updatePairDisplay();
  }

  function updatePairDisplay() {
    if (!comparisonPairs.length) return;
    const pair = comparisonPairs[activePairIndex];
    if (beforeImageTag) beforeImageTag.src = pair.before;
    if (afterImageTag) afterImageTag.src = pair.after;
    if (pairCounter) pairCounter.textContent = `${activePairIndex + 1} / ${comparisonPairs.length}`;
  }

  if (prevPair) {
    prevPair.addEventListener('click', () => {
      activePairIndex = (activePairIndex - 1 + comparisonPairs.length) % comparisonPairs.length;
      updatePairDisplay();
    });
  }

  if (nextPair) {
    nextPair.addEventListener('click', () => {
      activePairIndex = (activePairIndex + 1) % comparisonPairs.length;
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

  /* ============================================================
     11. HERO PANEL PARALLAX
     ============================================================ */
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

  /* ============================================================
     12. SMOOTH SCROLL NAVIGATION
     ============================================================ */
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

/* ============================================================
   PARTICLE EFFECT (unchanged)
   ============================================================ */
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
