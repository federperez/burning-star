(() => {
  const layer = document.querySelector(".particle-layer");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const signalWindow = document.querySelector(".system-window");
  const frequency = document.querySelector(".frequency");
  const signalStatus = document.querySelector(".system-status-copy");
  const form = document.querySelector(".signal-form");
  const emailInput = document.querySelector("#signal-email");
  const toast = document.querySelector(".toast");
  const toastCopy = document.querySelector(".toast-copy");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lastTrail = 0;
  let toastTimer;

  const notify = (message) => {
    toastCopy.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  };

  const createParticle = (x, y, burst, index = 0) => {
    const particle = document.createElement("img");
    particle.src = "./assets/burning-star-emblem.svg";
    particle.alt = "";
    particle.className = `brand-particle ${
      burst ? "particle-burst" : "particle-trail"
    } ${index % 3 === 0 ? "particle-red" : ""}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty(
      "--dx",
      `${(Math.random() - 0.5) * (burst ? 190 : 32)}px`
    );
    particle.style.setProperty(
      "--dy",
      `${(Math.random() - 0.65) * (burst ? 170 : 38)}px`
    );
    particle.style.setProperty("--spin", `${Math.random() * 260 - 130}deg`);
    particle.style.setProperty(
      "--size",
      `${burst ? 12 + Math.random() * 24 : 7 + Math.random() * 10}px`
    );
    layer.appendChild(particle);
    window.setTimeout(() => particle.remove(), burst ? 920 : 560);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);

      if (reduced || event.pointerType === "touch") return;
      const now = performance.now();
      if (now - lastTrail < 55) return;
      lastTrail = now;
      createParticle(event.clientX, event.clientY, false, Math.floor(now / 60));
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) return;
      const total = reduced ? 3 : 11;
      for (let index = 0; index < total; index += 1) {
        createParticle(event.clientX, event.clientY, true, index);
      }
    },
    { passive: true }
  );

  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "CLOSE [×]" : "MENU [=]";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "MENU [=]";
    });
  });

  signalWindow.addEventListener("click", () => {
    const active = signalWindow.classList.toggle("is-active");
    signalWindow.setAttribute(
      "aria-label",
      active ? "Pausar señal Burning Star" : "Activar señal Burning Star"
    );
    signalStatus.textContent = active ? "TRANSMITTING" : "SIGNAL READY";
    frequency.textContent = active ? "91.1 FM" : "CLICK TO DEFY";
  });

  document.querySelectorAll("[data-file]").forEach((button) => {
    button.addEventListener("click", () => {
      notify(`${button.dataset.file} / FILE OPEN`);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = emailInput.value.trim();
    if (!value || !value.includes("@")) {
      notify("INGRESÁ UNA FRECUENCIA VÁLIDA");
      return;
    }
    emailInput.value = "";
    notify("SEÑAL RECIBIDA / WELCOME TO THE BURN");
  });
})();
