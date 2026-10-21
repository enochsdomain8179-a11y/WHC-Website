// Watkins Home Companion — small progressive enhancements. The site works without JavaScript.
(function () {
  document.documentElement.classList.add('js');

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // Features filter
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var buttons = filterBar.querySelectorAll('button');
    var cards = document.querySelectorAll('[data-status]');
    var live = document.getElementById('filter-status');
    filterBar.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button) return;
      var filter = button.getAttribute('data-filter');
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
      var shown = 0;
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-status') === filter;
        card.hidden = !match;
        if (match) shown++;
      });
      if (live) live.textContent = 'Showing ' + shown + ' feature' + (shown === 1 ? '' : 's') + '.';
    });
  }

  // Companion orb: a canvas port of the app's CompanionOrb (idle state) - pearl glass sphere,
  // glowing arched eyes, layered light rings and orbiting details. The CSS orb remains as the no-JS fallback.
  var orbs = document.querySelectorAll('.orb');
  var canPaint = orbs.length && !!document.createElement('canvas').getContext('2d').createConicGradient;
  if (canPaint) {
    var PERIOD = 7600;
    var TAU = Math.PI * 2;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var hex = function (h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; };
    var mix = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
    var rgba = function (c, a) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + Math.max(0, Math.min(1, a)) + ')'; };
    var WHITE = [255, 255, 255];
    var color = hex('#2b90ff'); // idle pulse color, also the sphere's rim light
    var paleColor = mix(color, WHITE, 0.88);
    var hotCyan = mix(mix(color, hex('#9ff4ff'), 0.7), WHITE, 0.55);
    var shade = hex('#44618a');

    var radial = function (ctx, x, y, radius, stops) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
      return g;
    };
    var blurred = function (ctx, sigma, draw) { ctx.filter = 'blur(' + sigma + 'px)'; draw(); ctx.filter = 'none'; };
    var strokeArc = function (ctx, x, y, radius, start, sweep, width, style) {
      ctx.beginPath(); ctx.arc(x, y, radius, start, start + sweep);
      ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = style; ctx.stroke();
    };
    var ellipse = function (ctx, x, y, w, h, style) {
      ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, 0, 0, TAU); ctx.fillStyle = style; ctx.fill();
    };

    var paintSphere = function (ctx, cx, cy, r) {
      // 1. Body: cool gray-navy core brightening to a pearl rim.
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
      ctx.fillStyle = radial(ctx, cx - 0.12 * r, cy - 0.18 * r, 2.04 * r,
        [[0, '#9db0c9'], [0.32, '#c6d6e8'], [0.68, '#f5faff'], [1, '#ffffff']]);
      ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
      // 2. Directional light from above.
      var top = ctx.createLinearGradient(0, cy - r, 0, cy + r);
      top.addColorStop(0, 'rgba(255,255,255,0.72)'); top.addColorStop(0.4, 'rgba(255,255,255,0.16)'); top.addColorStop(0.66, 'rgba(255,255,255,0)');
      ctx.fillStyle = top; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      // 3. Cool shadow rising from the lower left.
      var sx = cx - 0.42 * r, sy = cy + 0.66 * r;
      ctx.beginPath(); ctx.arc(sx, sy, 1.2 * r, 0, TAU);
      ctx.fillStyle = radial(ctx, sx, sy, 1.2 * r, [[0, rgba(shade, 0.24)], [0.55, rgba(shade, 0.06)], [1, rgba(shade, 0)]]);
      ctx.fill();
      // 4. Soft window reflection, upper left.
      blurred(ctx, 0.06 * r, function () {
        ctx.save(); ctx.translate(cx - 0.46 * r, cy - 0.3 * r); ctx.rotate(0.2);
        ctx.beginPath(); ctx.roundRect(-0.17 * r, -0.3 * r, 0.34 * r, 0.6 * r, 0.07 * r);
        ctx.fillStyle = 'rgba(255,240,216,0.32)'; ctx.fill(); ctx.restore();
      });
      // 5. Secondary reflection, low and wide.
      ellipse(ctx, cx + 0.3 * r, cy + 0.46 * r, 0.9 * r, 0.38 * r,
        radial(ctx, cx + 0.3 * r, cy + 0.46 * r, 0.19 * r, [[0, 'rgba(255,255,255,0.34)'], [1, 'rgba(255,255,255,0)']]));
      // 6. Pedestal light refracting up through the lower interior.
      blurred(ctx, 0.18 * r, function () { strokeArc(ctx, cx, cy, 0.88 * r, Math.PI * 0.12, Math.PI * 0.76, 0.26 * r, rgba(color, 0.5)); });
      blurred(ctx, 0.07 * r, function () { strokeArc(ctx, cx, cy, 0.93 * r, Math.PI * 0.18, Math.PI * 0.64, 0.1 * r, rgba(mix(color, WHITE, 0.55), 0.8)); });
      // 7. Inner shadow seating the edge, then a soft internal glow.
      blurred(ctx, 0.1 * r, function () { strokeArc(ctx, cx, cy, 0.94 * r, 0, TAU, 0.13 * r, rgba(shade, 0.15)); });
      ellipse(ctx, cx, cy + 0.12 * r, 1.25 * r, 1.05 * r,
        radial(ctx, cx, cy + 0.12 * r, 0.525 * r, [[0, rgba(color, 0.26)], [0.55, rgba(color, 0.07)], [1, rgba(color, 0)]]));
      // 8. Specular catchlight, upper right, with a small satellite.
      ctx.save(); ctx.translate(cx + 0.36 * r, cy - 0.4 * r); ctx.rotate(-0.45);
      ellipse(ctx, 0, 0, 0.44 * r, 0.33 * r, radial(ctx, 0, 0, 0.165 * r,
        [[0, '#ffffff'], [0.45, 'rgba(255,255,255,0.4)'], [1, 'rgba(255,255,255,0)']]));
      ctx.restore();
      ellipse(ctx, cx + 0.54 * r, cy - 0.18 * r, 0.15 * r, 0.11 * r,
        radial(ctx, cx + 0.54 * r, cy - 0.18 * r, 0.055 * r, [[0, 'rgba(255,255,255,0.9)'], [1, 'rgba(255,255,255,0)']]));
      ctx.restore();
      // 9. Bright illuminated rim on the silhouette.
      blurred(ctx, 0.06 * r, function () { strokeArc(ctx, cx, cy, 0.975 * r, Math.PI * 1.04, Math.PI * 0.8, 0.09 * r, 'rgba(255,255,255,0.5)'); });
      strokeArc(ctx, cx, cy, 0.988 * r, Math.PI * 1.08, Math.PI * 0.72, 0.032 * r, '#ffffff');
    };

    // Brightness varies around each ring: hottest along the lower arc.
    var sweep = function (ctx, cx, cy, c, a) {
      var g = ctx.createConicGradient(Math.PI * 0.76, cx, cy);
      [[0, 0.4], [0.22, 1], [0.5, 0.88], [0.8, 0.3], [1, 0.4]].forEach(function (s) { g.addColorStop(s[0], rgba(c, a * s[1])); });
      return g;
    };
    var ring = function (ctx, cx, cy, radius, width, alpha, hotCore, dominant) {
      blurred(ctx, width * (dominant ? 3 : 2.2), function () {
        strokeArc(ctx, cx, cy, radius, 0, TAU, width * (dominant ? 4.4 : 3.2), sweep(ctx, cx, cy, color, alpha * 0.8));
      });
      strokeArc(ctx, cx, cy, radius, 0, TAU, width * 1.4, sweep(ctx, cx, cy, color, alpha));
      if (!hotCore) return;
      strokeArc(ctx, cx, cy, radius, 0, TAU, width * (dominant ? 0.95 : 0.6), sweep(ctx, cx, cy, dominant ? hotCyan : paleColor, alpha));
      if (dominant) strokeArc(ctx, cx, cy, radius, 0, TAU, width * 0.4, sweep(ctx, cx, cy, WHITE, alpha));
    };
    var ORBITS = [[-0.42, 0.34, 1.02, 0, 1], [0.5, 0.28, 0.96, 0.45, -1]];

    var paintStaticAura = function (ctx, cx, cy, outer) {
      ctx.beginPath(); ctx.arc(cx, cy, outer, 0, TAU);
      ctx.fillStyle = radial(ctx, cx, cy, outer, [[0.36, rgba(color, 0.001)], [0.7, rgba(color, 0.42)], [1, rgba(color, 0)]]);
      ctx.fill();
      var unit = outer * 0.02;
      ring(ctx, cx, cy, outer * 0.99, unit * 0.65, 0.34, false, false);
      ring(ctx, cx, cy, outer * 0.93, unit * 1.35, 0.78, true, false);
      ring(ctx, cx, cy, outer * 0.845, unit * 2.9, 1, true, true);
      ORBITS.forEach(function (o) {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(o[0]); ctx.scale(1, o[1]);
        strokeArc(ctx, 0, 0, outer * o[2], 0, TAU, unit * 0.28, rgba(paleColor, 0.3));
        ctx.restore();
      });
    };

    var paintMotion = function (ctx, cx, cy, outer, phase) {
      var unit = outer * 0.02;
      // Inner ring carries the breathing pulse.
      var p = (Math.sin(phase * TAU) + 1) / 2;
      var eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      ring(ctx, cx, cy, outer * 0.755, unit * 1.05, Math.max(0.18, Math.min(1, 0.45 + eased * 0.55)), true, false);
      // A point of light travelling each orbit, with a short comet trail.
      ORBITS.forEach(function (o) {
        var dir = o[4], angle = (phase * dir + o[3]) * TAU, radius = outer * o[2];
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(o[0]); ctx.scale(1, o[1]);
        strokeArc(ctx, 0, 0, radius, Math.min(angle, angle - 0.45 * dir), 0.45, unit * 0.5, rgba(paleColor, 0.35));
        var dx = Math.cos(angle) * radius, dy = Math.sin(angle) * radius;
        blurred(ctx, unit * 0.8, function () { ctx.beginPath(); ctx.arc(dx, dy, unit * 0.95, 0, TAU); ctx.fillStyle = rgba(paleColor, 1); ctx.fill(); });
        ctx.beginPath(); ctx.arc(dx, dy, unit * 0.42, 0, TAU); ctx.fillStyle = '#ffffff'; ctx.fill();
        ctx.restore();
      });
      // Small particles drifting around the outer rings.
      for (var i = 0; i < 6; i++) {
        var seed = i * 0.61803398875;
        var a = (phase * (i % 2 === 0 ? 0.35 : -0.28) + seed) * TAU;
        var rad = outer * (0.88 + ((i * 0.19) % 0.18));
        var twinkle = (Math.sin((phase * 3 + seed) * TAU) + 1) / 2;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, unit * (0.34 + twinkle * 0.4), 0, TAU);
        ctx.fillStyle = rgba(paleColor, 0.3 + twinkle * 0.6); ctx.fill();
      }
      // Faint light streaks skimming the main band.
      blurred(ctx, unit * 1.2, function () {
        for (var j = 0; j < 2; j++) strokeArc(ctx, cx, cy, outer * 0.845, (phase * 0.5 + j * 0.5) * TAU, 0.34, unit * 1.5, 'rgba(255,255,255,0.26)');
      });
    };

    var paintFace = function (ctx, left, topY, w, openness) {
      [0.325, 0.675].forEach(function (fx) {
        var x = left + w * fx, y = topY + w * 0.515, half = w * 0.105;
        var curve = w * (0.012 + 0.105 * openness);
        var eye = function (width, style) {
          ctx.beginPath(); ctx.moveTo(x - half, y); ctx.quadraticCurveTo(x, y - curve, x + half, y);
          ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = style; ctx.stroke();
        };
        blurred(ctx, w * 0.055, function () { eye(w * 0.115, 'rgba(15,123,255,0.34)'); });
        blurred(ctx, w * 0.025, function () { eye(w * 0.07, 'rgba(15,123,255,0.7)'); });
        eye(w * 0.042, '#33b4ff');
        eye(w * 0.019, '#c9f4ff');
      });
    };

    var painters = [];
    orbs.forEach(function (orb) {
      var canvas = document.createElement('canvas');
      canvas.className = 'orb-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      orb.appendChild(canvas);
      orb.classList.add('is-painted');
      var ctx = canvas.getContext('2d');
      var layers = { aura: document.createElement('canvas'), sphere: document.createElement('canvas') };
      var state = { visible: true, size: 0 };

      var build = function () {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var size = Math.round(canvas.clientWidth * dpr);
        if (!size || size === state.size) return;
        state.size = size;
        [canvas, layers.aura, layers.sphere].forEach(function (c) { c.width = c.height = size; });
        state.d = size / 2.2; // canvas is 220% of the sphere so the rings' blurred bloom isn't cut off
        state.c = size / 2;
        paintStaticAura(layers.aura.getContext('2d'), state.c, state.c, state.d * 0.71);
        paintSphere(layers.sphere.getContext('2d'), state.c, state.c, state.d / 2);
      };

      var draw = function (phase) {
        if (!state.size) return;
        var c = state.c, d = state.d;
        var breath = Math.sin(phase * TAU);
        var blink = phase >= 0.84 && phase <= 0.905 ? Math.sin(((phase - 0.84) / 0.065) * Math.PI) : 0;
        ctx.clearRect(0, 0, state.size, state.size);
        ctx.save();
        ctx.translate(0, breath * d * (5 / 300));
        ctx.drawImage(layers.aura, 0, 0);
        paintMotion(ctx, c, c, d * 0.71, phase);
        ctx.drawImage(layers.sphere, 0, 0);
        paintFace(ctx, c - d / 2, c - d / 2, d, 1 - blink);
        ctx.restore();
      };

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) { state.visible = entries[0].isIntersecting; }).observe(orb);
      }
      if ('ResizeObserver' in window) {
        new ResizeObserver(function () { build(); draw(reduceMotion.matches ? 0 : (performance.now() % PERIOD) / PERIOD); }).observe(canvas);
      }
      build();
      painters.push({ draw: draw, state: state });
    });

    var tick = function (now) {
      painters.forEach(function (p) { if (p.state.visible && !document.hidden) p.draw((now % PERIOD) / PERIOD); });
      if (!reduceMotion.matches) requestAnimationFrame(tick);
    };
    var start = function () {
      if (reduceMotion.matches) painters.forEach(function (p) { p.draw(0); });
      else requestAnimationFrame(tick);
    };
    reduceMotion.addEventListener('change', start);
    start();
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
