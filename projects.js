document.addEventListener("DOMContentLoaded", () => {

  // OPEN WINDOWS
  document.querySelectorAll(".desktop-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const id = icon.dataset.project;
      document.getElementById(id).style.display = "flex";
    });
  });

  // DRAG WINDOWS
  document.querySelectorAll(".project-window").forEach(win => {
    const header = win.querySelector(".window-header");

    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;

    header.addEventListener("mousedown", (e) => {
      dragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      header.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      win.style.left = e.clientX - offsetX + "px";
      win.style.top = e.clientY - offsetY + "px";
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
      header.style.cursor = "grab";
    });
  });

  // CLOSE BUTTON FUNCTIONALITY
  document.querySelectorAll(".window-close").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const win = e.target.closest(".project-window");
      win.style.display = "none";
    });
  });

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