const SUPABASE_URL = 'https://vcxyznfjokmeaehumihr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHl6bmZqb2ttZWFlaHVtaWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDAyMzIsImV4cCI6MjA5MzExNjIzMn0.qTjZD-vxR9uIEQiGnBggZNjOb22PNZDasc8ixO2b9lk';

async function subscribeNewsletter() {
  const emailInput = document.getElementById('newsletter-email');
  const msg = document.getElementById('newsletter-msg');
  const btn = document.getElementById('newsletter-btn');
  const email = emailInput.value.trim();

  msg.className = 'newsletter-msg';
  msg.textContent = '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.classList.add('error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Subscribing...';

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ email }),
    });

    if (res.status === 409) {
      // Unique constraint — already subscribed
      msg.textContent = "You're already subscribed!";
      msg.classList.add('success');
    } else if (!res.ok) {
      throw new Error('Request failed');
    } else {
      msg.textContent = '✓ Subscribed! Thanks for signing up.';
      msg.classList.add('success');
      emailInput.value = '';
    }
  } catch {
    msg.textContent = 'Something went wrong. Please try again.';
    msg.classList.add('error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Subscribe';
  }
}

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