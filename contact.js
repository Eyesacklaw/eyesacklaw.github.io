document.addEventListener("DOMContentLoaded", () => {
  const contacts = [
    { img: "images/misc/clothes-assets/5.png", link: "https://github.com/eyesacklaw", key: "github" },
    { img: "images/misc/clothes-assets/4.png", link: "https://linkedin.com", key: "linkedin" },
    { img: "images/misc/clothes-assets/1.png", link: "mailto:wailoklawhk@gmail.com", key: "email" }
  ];

  const displayNames = {
    github: "Github",
    linkedin: "LinkedIn",
    email: "Email"
  };

  const clickCounts = { github: 0, linkedin: 0, email: 0 };
  const maxClicks = 3;

  const progressElements = {
    github: document.querySelector("#github-bar .progress-fill"),
    linkedin: document.querySelector("#linkedin-bar .progress-fill"),
    email: document.querySelector("#email-bar .progress-fill")
  };

  const labelElements = {
    github: document.querySelector("#github-bar .progress-label"),
    linkedin: document.querySelector("#linkedin-bar .progress-label"),
    email: document.querySelector("#email-bar .progress-label")
  };

  function spawnContact() {
    const el = document.createElement("img");
    const data = contacts[Math.floor(Math.random() * contacts.length)];

    el.src = data.img;
    el.className = "falling-contact";

    el.style.left = Math.abs(Math.random() * (window.innerWidth - 50) - 200) + "px";
    const size = 50 + Math.random() * 80;
    el.style.width = size + "px";

    const duration = 7 + Math.random() * 5;
    el.style.animationDuration = duration + "s";

    const drift = (Math.random() - 0.5) * 200;
    el.style.setProperty("--drift", drift + "px");

    el.addEventListener("click", (event) => {
      const key = data.key;

      // Increment click count
      clickCounts[key]++;
      if (clickCounts[key] > maxClicks) clickCounts[key] = maxClicks;

      // Update progress bar
      const percentage = (clickCounts[key] / maxClicks) * 100;
      progressElements[key].style.width = percentage + "%";

      // Update label
      if (clickCounts[key] >= maxClicks) {
        labelElements[key].textContent = `${displayNames[key]} Unlocked!`;
      } else {
        labelElements[key].textContent = `${displayNames[key]}: ${clickCounts[key]}/${maxClicks}`;
      }

      // Fade out clicked icon
      el.classList.add("fade");
      setTimeout(() => el.remove(), 500);

      // Sparkle effect at click location
      createSparkle(event.clientX, event.clientY);

      // Open link if max clicks reached
      if (clickCounts[key] === maxClicks) {
        window.open(data.link, "_blank");
      }
    });

    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  }

  function spawnLoop() {
    spawnContact();
    const delay = 699 + Math.random() * 700;
    setTimeout(spawnLoop, delay);
  }

  spawnLoop();

  // Sparkle function
  function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
});

const sections = document.querySelectorAll("section[class*='section-bg-']");

const bgMap = {
  "section-bg-0": "var(--bg-0)",
  "section-bg-1": "var(--bg-1)",
  "section-bg-2": "var(--bg-2)",
  "section-bg-3": "var(--bg-3)",
  "section-bg-4": "var(--bg-4)",
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      Object.keys(bgMap).forEach((cls) => {
        if (entry.target.classList.contains(cls)) {
          document.body.style.backgroundColor = bgMap[cls];
        }
      });
    });
  },
  {
    threshold: 0.4, // section is "active" when ~40% visible
  }
);

sections.forEach((section) => observer.observe(section));
document.getElementById("year").textContent = new Date().getFullYear();
