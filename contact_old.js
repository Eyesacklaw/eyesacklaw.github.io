document.addEventListener("DOMContentLoaded", () => {
  const contacts = [
    { img: "images/misc/clothes-assets/1.png", link: "https://github.com/eyesacklaw", key: "github" },
    { img: "images/misc/clothes-assets/2.png", link: "https://linkedin.com", key: "linkedin" },
    { img: "images/misc/clothes-assets/3.png", link: "mailto:youremail@example.com", key: "email" }
  ];

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

    el.style.left = Math.random() * (window.innerWidth - 50) + "px";
    const size = 35 + Math.random() * 35;
    el.style.width = size + "px";

    const duration = 7 + Math.random() * 5;
    el.style.animationDuration = duration + "s";

    const drift = (Math.random() - 0.5) * 200;
    el.style.setProperty("--drift", drift + "px");

    el.addEventListener("click", () => {
      // Increment click count
      clickCounts[data.key]++;
      if (clickCounts[data.key] > maxClicks) clickCounts[data.key] = maxClicks;

      // Update progress bar
      const percentage = (clickCounts[data.key] / maxClicks) * 100;
      progressElements[data.key].style.width = percentage + "%";
      labelElements[data.key].textContent = `${capitalize(data.key)}: ${clickCounts[data.key]}/${maxClicks}`;

      // Fade out clicked icon
      el.classList.add("fade");
      setTimeout(() => el.remove(), 500);

      // Sparkle effect at click location
      createSparkle(event.clientX, event.clientY);

      // Auto open link if max clicks reached
      if (clickCounts[data.key] >= maxClicks) {
        window.open(data.link, "_blank");
      }
    });

    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  }

  function spawnLoop() {
    spawnContact();
    const delay = 900 + Math.random() * 700;
    setTimeout(spawnLoop, delay);
  }

  spawnLoop();

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Sparkle creation function
  function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 800);
  }
});

function updateProgress(type, value) {
  const bar = document.getElementById(`${type}-bar`);
  const fill = bar.querySelector(".progress-fill");
  const label = bar.querySelector(".progress-label");

  fill.style.width = `${(value / 3) * 100}%`; // slides smoothly
  label.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}/3`;
}