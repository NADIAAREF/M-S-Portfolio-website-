/* =========================================================
   SCRIPT.JS — behavior for the portfolio.
   Content lives in content.js. You rarely need to edit this.
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTodo = (v) => typeof v === "string" && v.trim().startsWith("TODO");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- to-do hints on/off ---------- */
  document.body.classList.toggle("no-todo", !SHOW_TODO_HINTS);

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const saved = store.get("theme");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  $("#themeBtn").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    store.set("theme", next);
  });

  /* ---------- nav: scrolled state, progress bar, mobile menu ---------- */
  const nav = $("#nav"), bar = $("#progress"), burger = $("#burger"), links = $("#navLinks");
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 8);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* active link highlighting */
  const sections = $$("main section[id]");
  const linkFor = (id) => $(`.nav__links a[href="#${id}"]`);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$(".nav__links a").forEach((a) => a.classList.remove("active"));
      const l = linkFor(e.target.id);
      if (l) l.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- typed role line ---------- */
  const typedEl = $("#typed");
  (function typeLoop() {
    const roles = SITE.roles;
    if (!roles || !roles.length) return;
    if (reduceMotion) { typedEl.textContent = roles[0]; return; }
    let r = 0, i = 0, del = false;
    function tick() {
      const word = roles[r];
      typedEl.textContent = word.slice(0, i);
      let wait = del ? 28 : 55;
      if (!del && i === word.length) { del = true; wait = 1700; }
      else if (del && i === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      i += del ? -1 : 1;
      setTimeout(tick, wait);
    }
    tick();
  })();

  /* ---------- artifacts: render cards ---------- */
  const grid = $("#artifactGrid");

  function placeholder(a) {
    return `<div class="art__ph" aria-hidden="true"><b>${String(a.number).padStart(2, "0")}</b></div>`;
  }
  function mediaHTML(a, alt) {
    return a.img ? `<img src="${a.img}" alt="${alt}" />` : placeholder(a);
  }
  function bindFallback(box, a) {          // swap to a gradient tile if the image file is missing
    $$("img", box).forEach((img) => img.addEventListener("error", () => { img.outerHTML = placeholder(a); }, { once: true }));
  }

  ARTIFACTS.forEach((a, idx) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "art reveal";
    card.style.setProperty("--d", (idx % 3) * 0.08 + "s");
    card.dataset.id = a.id;
    card.dataset.tags = a.tags.join("|");
    card.setAttribute("aria-label", `Open details for artifact ${a.number}: ${a.title}`);
    card.innerHTML = `
      <div class="art__media">
        ${mediaHTML(a, "Screenshot of " + a.title)}
        <span class="art__num">Artifact ${String(a.number).padStart(2, "0")}</span>
      </div>
      <div class="art__body">
        <h3>${a.title}</h3>
        <p>${a.short}</p>
        <div class="art__tags">${a.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <span class="art__more">Explore project <i aria-hidden="true">&rarr;</i></span>
      </div>`;
    bindFallback(card, a);
    card.addEventListener("click", () => openModal(a.id, card));
    grid.appendChild(card);
  });

  /* filters */
  const filterBox = $("#filters");
  ARTIFACT_FILTERS.forEach((f, i) => {
    const b = document.createElement("button");
    b.className = "filter";
    b.type = "button";
    b.textContent = f;
    b.setAttribute("aria-pressed", String(i === 0));
    b.addEventListener("click", () => {
      $$(".filter", filterBox).forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      $$(".art", grid).forEach((c) => {
        const show = f === "All" || c.dataset.tags.split("|").includes(f);
        c.classList.toggle("is-hidden", !show);
      });
    });
    filterBox.appendChild(b);
  });

  /* ---------- artifacts: modal ---------- */
  const modal = $("#modal"), panel = $(".modal__panel", modal);
  let current = null, lastFocus = null;
  const visibleIds = () => $$(".art:not(.is-hidden)", grid).map((c) => c.dataset.id);

  function fact(label, value) {
    if (!value) return "";
    const todo = isTodo(value);
    if (todo && !SHOW_TODO_HINTS) return "";
    const text = todo ? "To add: " + value.replace(/^TODO:\s*/, "") : value;
    return `<div><dt>${label}</dt><dd class="${todo ? "is-todo" : ""}">${text}</dd></div>`;
  }

  function fillModal(id) {
    const a = ARTIFACTS.find((x) => x.id === id);
    if (!a) return;
    current = id;
    $("#mMedia").innerHTML = `<figure>${mediaHTML(a, "Image for " + a.title)}</figure>` +
      (a.more || []).map((m) => `<figure><img src="${m.src}" alt="${m.caption}" /><figcaption>${m.caption}</figcaption></figure>`).join("");
    bindFallback($("#mMedia"), a);
    $("#mKicker").textContent = `Artifact ${String(a.number).padStart(2, "0")}`;
    $("#mTitle").textContent = a.title;
    $("#mStatus").textContent = a.status;
    $("#mTools").innerHTML = a.tools.map((t) => `<span>${t}</span>`).join("");
    $("#mFacts").innerHTML =
      fact("Objective", a.objective) +
      fact("Modeling approach", a.approach) +
      fact("My contribution", a.contribution) +
      fact("Findings / status", a.findings) +
      fact("Reflection", a.reflection) +
      (a.disciplines && a.disciplines.length
        ? `<div><dt>Disciplines involved</dt><dd>${a.disciplines.join(" · ")}</dd></div>` : "");
    const ids = visibleIds(), i = ids.indexOf(id);
    $("#mPrev").disabled = i <= 0;
    $("#mNext").disabled = i === -1 || i >= ids.length - 1;
    panel.scrollTop = 0;
  }

  function openModal(id, trigger) {
    lastFocus = trigger || document.activeElement;
    fillModal(id);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    panel.focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(dir) {
    const ids = visibleIds(), i = ids.indexOf(current) + dir;
    if (i >= 0 && i < ids.length) fillModal(ids[i]);
  }
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  $("#mPrev").addEventListener("click", () => step(-1));
  $("#mNext").addEventListener("click", () => step(1));
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") {              // keep focus inside dialog
      const f = $$("button:not(:disabled), a[href]", modal);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- philosophy expand ---------- */
  const philBtn = $("#philBtn"), philMore = $("#philMore");
  philBtn.addEventListener("click", () => {
    const open = philMore.hidden;
    philMore.hidden = !open;
    philBtn.setAttribute("aria-expanded", String(open));
    philBtn.innerHTML = open ? 'Show less <span aria-hidden="true">&minus;</span>' : 'Read the full statement <span aria-hidden="true">+</span>';
  });

  /* ---------- contact + CV links from SITE config ---------- */
  const email = SITE.email || "";
  const emailOK = email && !isTodo(email);
  $("#emailText").textContent = emailOK ? email : "Add your email in content.js";
  $("#emailLink").href = emailOK ? "mailto:" + email : "#contact";

  const liOK = SITE.linkedin && !/TODO/.test(SITE.linkedin);
  if (liOK) $("#linkedinLink").href = SITE.linkedin; else $("#linkedinLink").hidden = true;
  if (SITE.hastiLab) $("#labLink").href = SITE.hastiLab;
  if (SITE.github) { $("#githubLink").href = SITE.github; $("#githubLink").hidden = false; }
  $("#cvDownload").href = SITE.cv; $("#cvView").href = SITE.cv;
  $("#year").textContent = new Date().getFullYear();

  const form = $("#form"), note = $("#formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("input, textarea", form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = "Please fill in every field with a valid email."; return; }
    if (!emailOK) { note.textContent = "Set your email in content.js to enable this form."; return; }
    const d = new FormData(form);
    const subject = encodeURIComponent("Portfolio message from " + d.get("name"));
    const body = encodeURIComponent(d.get("message") + "\n\n— " + d.get("name") + " (" + d.get("email") + ")");
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    note.textContent = "Opening your email app…";
    form.reset();
  });

  /* ---------- scroll reveal ---------- */
  root.classList.add("js");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el, i) => {
    if (!el.style.getPropertyValue("--d") && el.closest(".hero")) el.style.setProperty("--d", i * 0.09 + "s");
    io.observe(el);
  });

  /* ---------- count-up stats ---------- */
  const counters = $$("[data-count]");
  const co = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const end = +e.target.dataset.count;
      if (reduceMotion) { e.target.textContent = end; return; }
      const t0 = performance.now(), dur = 1100;
      (function f(t) {
        const p = Math.min((t - t0) / dur, 1);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => co.observe(c));

  /* ---------- 3D tilt on artifact cards (mouse only) ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$(".art", grid).forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transition = "transform .08s linear, box-shadow .35s, border-color .3s";
        c.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      c.addEventListener("pointerleave", () => {
        c.style.transition = "";
        c.style.transform = "";
      });
    });
  }

  /* ---------- hero: agent-based "thermal" simulation ---------- */
  (function hero() {
    const cv = $("#sim"), ctx = cv.getContext("2d");
    let W, H, dpr, agents = [], raf = null, visible = true;
    const mouse = { x: -9999, y: -9999 };
    const HEAT = [[59, 42, 143], [194, 48, 122], [255, 122, 26], [255, 210, 63]];
    const heat = (t) => {                      // t in 0..1 -> thermal colour
      const s = t * (HEAT.length - 1), i = Math.min(Math.floor(s), HEAT.length - 2), f = s - i;
      return HEAT[i].map((c, k) => Math.round(c + (HEAT[i + 1][k] - c) * f));
    };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(28, Math.min(95, Math.floor((W * H) / 15000)));
      agents = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: 1.4 + Math.random() * 2.2, t: Math.random()
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      const light = root.dataset.theme === "light";
      const LINK = 130;
      for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        // gentle mouse repulsion: agents near the cursor "heat up"
        const dx = a.x - mouse.x, dy = a.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 22000) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / 148) * 0.5;
          a.vx += (dx / d) * f; a.vy += (dy / d) * f;
          a.t = Math.min(1, a.t + 0.04);
        } else a.t = Math.max(0.05, a.t - 0.004);
        a.vx *= 0.985; a.vy *= 0.985;
        const sp = Math.hypot(a.vx, a.vy);
        if (sp < 0.12) { a.vx += (Math.random() - 0.5) * 0.06; a.vy += (Math.random() - 0.5) * 0.06; }
        a.x += a.vx; a.y += a.vy;
        if (a.x < -10) a.x = W + 10; else if (a.x > W + 10) a.x = -10;
        if (a.y < -10) a.y = H + 10; else if (a.y > H + 10) a.y = -10;

        for (let j = i + 1; j < agents.length; j++) {
          const b = agents[j], ex = a.x - b.x, ey = a.y - b.y, dd = ex * ex + ey * ey;
          if (dd < LINK * LINK) {
            const al = (1 - Math.sqrt(dd) / LINK) * (light ? 0.35 : 0.3);
            const c = heat((a.t + b.t) / 2);
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${al})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const a of agents) {
        const c = heat(a.t);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${light ? 0.85 : 0.9})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r + a.t * 1.8, 0, 6.2832); ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", () => { resize(); if (reduceMotion) frame(); });
    const heroEl = $("#home");
    heroEl.addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    heroEl.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

    if (reduceMotion) { frame(); return; }          // single still frame
    new IntersectionObserver((en) => {              // pause when scrolled away
      visible = en[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
      if (!visible) { cancelAnimationFrame(raf); raf = null; }
    }).observe(heroEl);
    raf = requestAnimationFrame(frame);
  })();
})();
