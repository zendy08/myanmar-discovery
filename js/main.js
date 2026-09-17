(() => {
  const progress = document.getElementById("progress");
  const header = document.getElementById("header");
  const hero = document.querySelector(".hero");
  const heroImg = document.querySelector(".hero-media img");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const eras = [...document.querySelectorAll(".era")];
  const plateImgs = [...document.querySelectorAll("#historyPlate [data-era]")];
  const plateLabel = document.getElementById("plateLabel");
  const plateYears = document.getElementById("plateYears");

  const eraMeta = [
    { label: "Plate · Bagan kingdom", years: "849–1287" },
    { label: "Plate · Royal capitals", years: "14th–19th c." },
    { label: "Plate · Rangoon / Yangon", years: "1885–1948" },
    { label: "Plate · Independence", years: "1948–" }
  ];

  const places = {
    bagan: {
      plate: "Plate 01 · Dry zone",
      title: "Bagan",
      where: "21°10′N · 94°52′E · Mandalay Region",
      body: "A twenty-six-square-mile plain of brick stupas, raised when this bend of the river was a capital. Go at first light, before the heat, and the mist still holds the shapes. An e-bike is enough. The temples are the point; the balloons, if they fly, are only weather.",
      meta: [
        ["Stay with", "Dawn and dusk. Midday is a white glare."],
        ["Move by", "Electric bike, on sandy tracks between fields."]
      ]
    },
    inle: {
      plate: "Plate 02 · Shan plateau",
      title: "Inle Lake",
      where: "20°33′N · 96°55′E · 900m",
      body: "A shallow highland lake where the Intha farm tomatoes on floating mats of weed and row with one leg. Villages sit on stilts. Lotus silk is still spun here. Hire a longboat for a day, and do not rush the market circuit — the lake is the culture, not a backdrop.",
      meta: [
        ["Stay with", "A night or two on the water, not a day-trip only."],
        ["Look for", "Lotus weave, boat workshops, the five-day market."]
      ]
    },
    yangon: {
      plate: "Plate 03 · The old capital",
      title: "Yangon",
      where: "Shwedagon Pagoda · Dagon Township",
      body: "The commercial heart, even after the capital moved inland. Downtown is teak, plaster, and street tea. Above it, Shwedagon — a hill of gold leaf, lamps, and barefoot circuits at dusk. The pagoda is not an attraction you tick. It is where the city goes when the heat drops.",
      meta: [
        ["Go at", "Late afternoon, into blue hour."],
        ["Also", "Circular train, tea shops, the old secretariat façades."]
      ]
    },
    mandalay: {
      plate: "Plate 04 · Last royal seat",
      title: "Mandalay",
      where: "21°58′N · 96°05′E",
      body: "King Mindon’s city, from 1857. The palace compound is a reconstruction; the craft is not — gold-leaf beating, marble carving, silk. At Amarapura, U Bein Bridge crosses Taungthaman Lake on two centuries of teak. Sunset there is famous because it is, in fact, that quiet.",
      meta: [
        ["See", "U Bein at dusk · Mahagandhayon in the morning."],
        ["Bring home", "Gold leaf, if you buy it from the beaters."]
      ]
    },
    hpaan: {
      plate: "Plate 05 · Kayin State",
      title: "Hpa-An",
      where: "Limestone country · Thanlwin River",
      body: "Karst towers out of paddy and river haze. Caves hold reclining Buddhas and, some of them, a little daylight at the far end. Kyauk Kalat pagoda sits on a rock like a thought that would not leave. Sleep in town; take a boat or a motorbike into the fields.",
      meta: [
        ["Pace", "Slow. This is not a checklist landscape."],
        ["Pair with", "Mawlamyine, downriver, if you have days."]
      ]
    },
    kyaiktiyo: {
      plate: "Plate 06 · Mon State",
      title: "Kyaiktiyo",
      where: "The Golden Rock · 1,100m",
      body: "A granite boulder, gilded, perched on a cliff as if it had paused mid-fall. Pilgrims walk or take the truck road up, then wait for the rock to catch the last light. It is a working shrine. Dress as you would for any pagoda, and leave the boulder more room than a photograph seems to need.",
      meta: [
        ["Go", "On a weekday, if you can."],
        ["Know", "The overnight truck is part of the pilgrimage."]
      ]
    }
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopNav = window.matchMedia("(min-width: 980px)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  let lockCount = 0;
  let lockY = 0;

  function setBodyLock(on) {
    if (on) {
      if (lockCount === 0) {
        lockY = window.scrollY;
        document.body.classList.add("is-locked");
        document.body.style.top = `-${lockY}px`;
      }
      lockCount += 1;
      return;
    }
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.classList.remove("is-locked");
      document.body.style.top = "";
      window.scrollTo(0, lockY);
    }
  }

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.width = `${t * 100}%`;

    if (hero && header && lockCount === 0) {
      header.classList.toggle("is-solid", window.scrollY > 40);
    }

    if (!reduceMotion && heroImg && finePointer.matches && hero) {
      const y = Math.min(window.scrollY, hero.offsetHeight);
      heroImg.style.transform = `scale(1.04) translateY(${y * 0.12}px)`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    const isOpen = mobileNav.classList.contains("is-open");
    if (open === isOpen) return;
    menuToggle.classList.toggle("is-open", open);
    mobileNav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.setAttribute("aria-hidden", String(!open));
    setBodyLock(open);
  }

  mobileNav.setAttribute("aria-hidden", "true");

  menuToggle.addEventListener("click", () => {
    setMenu(!mobileNav.classList.contains("is-open"));
  });

  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  function setEra(index) {
    eras.forEach((btn, i) => btn.classList.toggle("is-active", i === index));
    plateImgs.forEach((n) => n.classList.toggle("is-on", Number(n.dataset.era) === index));
    const next = eraMeta[index];
    if (next) {
      plateLabel.textContent = next.label;
      plateYears.textContent = next.years;
    }
  }

  eras.forEach((btn) => {
    btn.addEventListener("click", () => setEra(Number(btn.dataset.era)));
  });

  if ("IntersectionObserver" in window) {
    const eraIo = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setEra(Number(vis.target.dataset.era));
      },
      { threshold: 0.55, rootMargin: "-20% 0px -20% 0px" }
    );
    eras.forEach((el) => eraIo.observe(el));
  }

  document.querySelectorAll(".check-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".check-btn").forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        document.getElementById(other.getAttribute("aria-controls")).classList.remove("is-open");
      });
      if (!open) {
        btn.setAttribute("aria-expanded", "true");
        document.getElementById(btn.getAttribute("aria-controls")).classList.add("is-open");
      }
    });
  });

  const drawer = document.getElementById("drawer");
  const veil = document.getElementById("drawerVeil");
  const title = document.getElementById("drawerTitle");
  const where = document.getElementById("drawerWhere");
  const body = document.getElementById("drawerBody");
  const metaEl = document.getElementById("drawerMeta");
  const plate = document.getElementById("drawerPlate");
  let lastFocus = null;

  function openDrawer(key) {
    const data = places[key];
    if (!data) return;
    lastFocus = document.activeElement;
    plate.textContent = data.plate;
    title.textContent = data.title;
    where.textContent = data.where;
    body.textContent = data.body;
    metaEl.innerHTML = data.meta
      .map(([k, v]) => `<div><strong>${k}</strong><span>${v}</span></div>`)
      .join("");
    drawer.hidden = false;
    veil.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      veil.classList.add("is-on");
    });
    setBodyLock(true);
    document.getElementById("drawerClose").focus();
  }

  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.classList.remove("is-open");
    veil.classList.remove("is-on");
    setBodyLock(false);
    window.setTimeout(() => {
      drawer.hidden = true;
      veil.hidden = true;
    }, 400);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll("[data-place]").forEach((btn) => {
    btn.addEventListener("click", () => openDrawer(btn.dataset.place));
  });

  document.getElementById("drawerClose").addEventListener("click", closeDrawer);
  veil.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      setMenu(false);
    }
  });

  function onViewportChange() {
    if (desktopNav.matches) {
      setMenu(false);
    }
    onScroll();
  }

  if (desktopNav.addEventListener) {
    desktopNav.addEventListener("change", onViewportChange);
  } else if (desktopNav.addListener) {
    desktopNav.addListener(onViewportChange);
  }

  window.addEventListener("resize", onViewportChange, { passive: true });
  window.addEventListener("orientationchange", () => {
    window.setTimeout(onViewportChange, 120);
  });

  const sections = ["glance", "history", "places", "culture", "notes"].map((id) =>
    document.getElementById(id)
  );
  const navLinks = [...document.querySelectorAll(".nav-desktop a")];

  if ("IntersectionObserver" in window) {
    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
    );
    sections.forEach((s) => s && navIo.observe(s));
  }
})();
