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
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
    setName(lang);
}