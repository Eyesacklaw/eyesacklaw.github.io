const sections = document.querySelectorAll("section[class*='section-bg-']");

const bgMap = {
  "section-bg-0": "var(--bg-0)",
  "section-bg-1": "var(--bg-1)",
  "section-bg-2": "var(--bg-2)",
  "section-bg-3": "var(--bg-3)",
  "section-bg-4": "var(--bg-4)",
};

document.body.style.backgroundColor = "#FFEE8C";

const nameVersions = {
  'zh-TW': '羅瑋樂',
  'zh-CN': '罗玮乐',
  'en':    'Law Wai Lok',
};

const blogNameVersions = {
  'zh-TW': '《上市》',
  'zh-CN': '《上市》',
  'en':    'Observations',
};

// Track the current language so the MutationObserver can always re-enforce it
let currentLang = 'en';

function setName(lang) {
  const name = nameVersions[lang] || 'Law Wai Lok';
  document.querySelectorAll('.my-name').forEach(el => el.textContent = name);

  const blogName = blogNameVersions[lang] || 'Observations';
  document.querySelectorAll('.blog-name').forEach(el => el.textContent = blogName);
  document.querySelectorAll('.blog-name-back').forEach(el => {
    el.textContent = lang === 'en' ? 'Back to Observations...' : '返回' + blogName + '...';
  });
}

function doTranslate(lang) {
  currentLang = lang;

  if (lang === 'en') {
    // Clear the googtrans cookie so GT stops translating
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'googtrans=; path=/; domain=' + location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    // Reload so the page comes back in plain English
    location.reload();
    return;
  }

  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
  setName(lang);
}

// Read the active language from the googtrans cookie on load
// (so after a reload we know which language to re-enforce)
function getLangFromCookie() {
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return match ? match[1] : 'en';
}

// Re-enforce custom text whenever Google Translate mutates the DOM
// This is the key fix for the reload bug: GT finishes *after* our script runs,
// so we watch for changes and immediately restore our strings.
function watchAndEnforce() {
  const targets = [
    ...document.querySelectorAll('.my-name'),
    ...document.querySelectorAll('.blog-name'),
    ...document.querySelectorAll('.blog-name-back'),
  ];

  if (targets.length === 0) return;

  const observer = new MutationObserver(() => {
    // Temporarily disconnect to avoid triggering ourselves
    observer.disconnect();
    setName(currentLang);
    // Re-observe after a tick
    setTimeout(() => targets.forEach(el => observer.observe(el, { childList: true, characterData: true, subtree: true })), 50);
  });

  targets.forEach(el => observer.observe(el, { childList: true, characterData: true, subtree: true }));
}

// On load: detect cookie language, set names, then start watching
document.addEventListener('DOMContentLoaded', () => {
  currentLang = getLangFromCookie();
  setName(currentLang);
  watchAndEnforce();

  // Also poll for a short window after load — GT's cookie-based
  // re-translation can fire asynchronously well after DOMContentLoaded
  let polls = 0;
  const poller = setInterval(() => {
    setName(currentLang);
    if (++polls >= 10) clearInterval(poller); // stop after ~2.5s
  }, 250);
});