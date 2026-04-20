/* ========== NEURAL NETWORK CANVAS ========== */
(function () {
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  let nodes = [], animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 14000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        type: Math.floor(Math.random() * 3),
      });
    }
  }

  const COLORS = ['#4f8ef7', '#8b5cf6', '#00d4ff'];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 160;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.25;
          const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          grad.addColorStop(0, COLORS[nodes[i].type] + Math.round(alpha * 255).toString(16).padStart(2,'0'));
          grad.addColorStop(1, COLORS[nodes[j].type] + Math.round(alpha * 255).toString(16).padStart(2,'0'));
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      n.pulse += n.pulseSpeed;
      const glow = (Math.sin(n.pulse) + 1) / 2;
      const color = COLORS[n.type];

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6 + glow * 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;

      // glow ring
      const radialGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
      radialGrad.addColorStop(0, color + '33');
      radialGrad.addColorStop(1, color + '00');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = radialGrad;
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // mouse interaction
  let mouse = { x: -9999, y: -9999 };
  canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    nodes.forEach(n => {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        n.vx += (dx / dist) * 0.08;
        n.vy += (dy / dist) * 0.08;
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 2) { n.vx = (n.vx / speed) * 2; n.vy = (n.vy / speed) * 2; }
      }
    });
  });

  resize();
  createNodes();
  loop();

  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });
})();


/* ========== NAVBAR SCROLL ========== */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


/* ========== HAMBURGER MENU ========== */
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();


/* ========== COUNTER ANIMATION ========== */
function animateCounters(container) {
  container.querySelectorAll('[data-target]').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = +el.dataset.target;
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * ease);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  });
}


/* ========== INTERSECTION OBSERVER (reveal + counters) ========== */
(function () {
  const revealEls = document.querySelectorAll('.section-tag, .section-title, .section-sub, .service-card, .project-card, .team-card, .testimonial-card, .stat-item, .about-text, .about-visual, .contact-left, .contact-form, .hero-stats');
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  // counters
  const statSections = document.querySelectorAll('.stats-section, #hero');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateCounters(entry.target);
    });
  }, { threshold: 0.3 });
  statSections.forEach(s => counterObserver.observe(s));
})();


/* ========== ARCHITECTURE DIAGRAM ANIMATION ========== */
(function () {
  const svg = document.getElementById('archSvg');
  if (!svg) return;

  function getNodeCenters() {
    const layers = ['layerInput', 'layerH1', 'layerH2', 'layerOutput'].map(id => document.getElementById(id));
    return layers.map(layer => {
      if (!layer) return [];
      return Array.from(layer.querySelectorAll('.anode')).map(node => {
        const nr = node.getBoundingClientRect();
        const svgR = svg.getBoundingClientRect();
        return { x: nr.left + nr.width / 2 - svgR.left, y: nr.top + nr.height / 2 - svgR.top };
      });
    });
  }

  function drawConnections() {
    svg.innerHTML = '';
    const layers = getNodeCenters();
    for (let l = 0; l < layers.length - 1; l++) {
      layers[l].forEach(from => {
        layers[l + 1].forEach(to => {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
          line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
          line.setAttribute('stroke', 'rgba(79,142,247,0.15)');
          line.setAttribute('stroke-width', '1');
          svg.appendChild(line);
        });
      });
    }
  }

  function animatePropagation() {
    const allNodes = document.querySelectorAll('.anode');
    allNodes.forEach(n => n.classList.remove('lit'));

    const layers = ['layerInput', 'layerH1', 'layerH2', 'layerOutput'].map(id => document.getElementById(id));
    layers.forEach((layer, li) => {
      if (!layer) return;
      const nodes = layer.querySelectorAll('.anode');
      nodes.forEach(n => {
        setTimeout(() => {
          n.classList.add('lit');
          setTimeout(() => n.classList.remove('lit'), 600);
        }, li * 400 + Math.random() * 100);
      });
    });
  }

  const archObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(drawConnections, 100);
    }
  }, { threshold: 0.5 });

  const diagram = document.getElementById('archDiagram');
  if (diagram) {
    archObs.observe(diagram);
    diagram.addEventListener('mouseenter', animatePropagation);
    setInterval(animatePropagation, 3000);
  }

  window.addEventListener('resize', drawConnections);
})();


/* ========== PROJECT FILTERS ========== */
(function () {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();


/* ========== TESTIMONIALS SLIDER ========== */
(function () {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('tnavDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const isMobile = () => window.innerWidth <= 768;
  const visibleCount = () => isMobile() ? 1 : 2;
  let current = 0;
  const total = cards.length;

  function maxIndex() { return Math.max(0, total - visibleCount()); }

  function createDots() {
    dotsContainer.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'tnav-dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dotsContainer.querySelectorAll('.tnav-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  document.getElementById('tnavPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('tnavNext').addEventListener('click', () => goTo(current + 1));

  createDots();
  window.addEventListener('resize', () => { createDots(); goTo(current); });

  // auto-advance
  setInterval(() => goTo((current + 1) > maxIndex() ? 0 : current + 1), 5000);
})();


/* ========== CONTACT FORM ========== */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const success = document.getElementById('formSuccess');

    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    btn.disabled = true;

    // simulate API call (replace with Formspree/EmailJS endpoint)
    await new Promise(r => setTimeout(r, 1500));

    btn.style.display = 'none';
    success.style.display = 'block';
    form.reset();
  });
})();


/* ========== SMOOTH ACTIVE NAV LINKS ========== */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id ? 'var(--text)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();


/* ========== CURSOR GLOW (desktop only) ========== */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:9999;
    width:400px;height:400px;border-radius:50%;
    background:radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity 0.3s;
  `;
  document.body.appendChild(glow);

  let ax = 0, ay = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  window.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });

  function animGlow() {
    ax += (tx - ax) * 0.1;
    ay += (ty - ay) * 0.1;
    glow.style.left = ax + 'px';
    glow.style.top = ay + 'px';
    requestAnimationFrame(animGlow);
  }
  animGlow();
})();
