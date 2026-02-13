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

const randomPublication = document.getElementById("united-magazine");

// list of URLs to choose from
const links = [
  "https://unitedmagazine.squarespace.com/chinese2324/blog-post-title-three-jcy5c",
  "https://unitedmagazine.squarespace.com/english/sonnet-of-the-snow",
  "https://unitedmagazine.squarespace.com/chinese/s5cjljsryrhdz4e6rbedfnehy23kjz",
  "https://unitedmagazine.squarespace.com/oldenglish/tick-tock-counting-down-the-minutes",
  "https://unitedmagazine.squarespace.com/oldchinese/22p2ftcalr8rss58w33ae5xsnxrr8z"
];

randomPublication.addEventListener("click", (e) => {
  e.preventDefault(); // prevent default anchor behavior
  const randomLink = links[Math.floor(Math.random() * links.length)];
  window.open(randomLink, "_blank");
});
