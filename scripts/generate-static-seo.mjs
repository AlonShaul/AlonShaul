// scripts/generate-static-seo.mjs
//
// רץ אוטומטית אחרי react-scripts build (postbuild ב-package.json).
// לכל אחד מ-12 הנתיבים התקניים (4 עמודים × 3 שפות) יוצר עותק עצמאי של
// build/index.html עם <head> נכון לעמוד/לשפה הזו: title, description,
// html lang/dir, canonical, hreflang (he/en/ru/x-default), ו-Open Graph/Twitter.
//
// SAFEGUARD 1 (תבנית בלתי-משתנה): התבנית המקורית (build/index.html, כפי
// שנוצרה על ידי react-scripts) נקראת *פעם אחת בלבד*, לפני כתיבת כל קובץ,
// ונשמרת ב-const אחד (`template`). כל אחד מ-12 הנתיבים נבנה תמיד מתוך אותו
// `template` המקורי - אף פעם לא מתוך html שנכתב/נוצר עבור נתיב אחר (כולל
// עברית+בית, שדורסת בפועל את build/index.html בסוף - אבל זו רק כתיבה
// לדיסק; הערך של `template` בזיכרון לא נגזר ממנה, ולא משתנה לאורך הריצה).
//
// SAFEGUARD 2 (ולידציה לכל נתיב בנפרד): אחרי שכל 12 הקבצים נכתבו, כל אחד
// מהם *נקרא מחדש מהדיסק* ונבדק בנפרד מול הערכים הצפויים המדויקים שלו.
// כשל בכל בדיקה מדפיס את הנתיב ואת הבדיקה שנכשלה, ומסיים עם exit code
// שונה מ-0 - כך ש-npm run build (וה-deploy בנטליפיי) נכשלים בבטחה.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resources } from '../src/i18nResources.js';
import { LANGUAGES, X_DEFAULT_LANGUAGE, localizePath, getDirection } from '../src/languageRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(PROJECT_ROOT, 'build');
const INDEX_PATH = path.join(BUILD_DIR, 'index.html');
const SITE_URL = 'https://alon-shaul-dev.com';

// מיפוי קוד שפה -> og:locale (לא תרגום UI - פורמט טכני קבוע לפי תקן Open Graph)
const OG_LOCALE = { he: 'he_IL', en: 'en_US', ru: 'ru_RU' };

// ארבעת העמודים התקינים; path הוא הנתיב ללא קידומת שפה, כפי ש-Seo.js כבר משתמש בו.
const PAGES = [
  { page: 'home', path: '/' },
  { page: 'profile', path: '/profile' },
  { page: 'projects', path: '/projects' },
  { page: 'contact', path: '/contact' }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// שואב את ערכי ה-title/description המתורגמים הקיימים - מאותו מקור אמת יחיד
// (i18nResources.js) שגם i18n.js וגם Seo.js כבר צורכים.
function getSeoText(language, page) {
  const translation = resources[language]?.translation;
  const title = translation?.[`seo_${page}_title`];
  const description = translation?.[`seo_${page}_description`];
  if (!title || !description) {
    throw new Error(`Missing seo_${page}_title/description for language "${language}"`);
  }
  return { title, description };
}

// בונה HTML עבור נתיב בודד - אך ורק מתוך `template` שהתקבל כפרמטר (תמיד
// התבנית המקורית הבלתי-משתנה), לעולם לא מתוך html שכבר נוצר לנתיב אחר.
function buildHtmlForRoute(template, route) {
  const { language, path: pagePath, page, outputHref } = route;
  const dir = getDirection(language);
  const { title, description } = getSeoText(language, page);
  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description);
  const canonicalUrl = `${SITE_URL}${outputHref}`;

  let html = template;

  // <html lang="he"> -> <html lang="{language}" dir="{dir}">
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${language}" dir="${dir}">`);

  // <title data-seo-default>...</title> -> <title>{title}</title> (ללא הסימון הזמני)
  html = html.replace(/<title data-seo-default>[^<]*<\/title>/, `<title>${escapedTitle}</title>`);

  // <meta data-seo-default name="description" content="...">
  html = html.replace(
    /<meta data-seo-default name="description" content="[^"]*"\/>/,
    `<meta name="description" content="${escapedDescription}"/>`
  );

  // Open Graph / Twitter - מעדכנים את ה-content של התגיות הקיימות, לא מוסיפים
  // תגיות חדשות (כדי לא ליצור כפילות מול התגיות הסטטיות הקיימות ב-index.html).
  html = html.replace(/<meta property="og:locale" content="[^"]*"\/>/, `<meta property="og:locale" content="${OG_LOCALE[language]}"/>`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${canonicalUrl}"/>`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${escapedTitle}"/>`);
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\/>/,
    `<meta property="og:description" content="${escapedDescription}"/>`
  );
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\/>/, `<meta name="twitter:title" content="${escapedTitle}"/>`);
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\/>/,
    `<meta name="twitter:description" content="${escapedDescription}"/>`
  );

  // canonical + hreflang (he/en/ru/x-default) - לא קיימים בתבנית הסטטית בכלל,
  // מוזרקים כעת לפני </head>.
  const hreflangLinks = LANGUAGES.map((altLanguage) => {
    const href = `${SITE_URL}${localizePath(pagePath, altLanguage)}`;
    return `<link rel="alternate" hreflang="${altLanguage}" href="${href}"/>`;
  }).join('');
  const xDefaultHref = `${SITE_URL}${localizePath(pagePath, X_DEFAULT_LANGUAGE)}`;
  const linkTags =
    `<link rel="canonical" href="${canonicalUrl}"/>` +
    hreflangLinks +
    `<link rel="alternate" hreflang="x-default" href="${xDefaultHref}"/>`;

  html = html.replace('</head>', `${linkTags}</head>`);

  return html;
}

function outputPathFor(outputHref) {
  if (outputHref === '/') return INDEX_PATH;
  return path.join(BUILD_DIR, outputHref.replace(/^\//, ''), 'index.html');
}

function buildRouteList() {
  const routes = [];
  for (const language of LANGUAGES) {
    for (const { page, path: pagePath } of PAGES) {
      const outputHref = localizePath(pagePath, language);
      routes.push({ language, page, path: pagePath, outputHref });
    }
  }
  return routes;
}

async function validateRoutes(generated) {
  const failures = [];

  if (generated.length !== 12) {
    failures.push({ route: '(all)', reason: `expected 12 generated routes, got ${generated.length}` });
  }

  for (const route of generated) {
    const routeLabel = `${route.language}:${route.page} (${route.outputHref})`;
    let html;
    try {
      html = await fs.readFile(route.outPath, 'utf8');
    } catch {
      failures.push({ route: routeLabel, reason: `output file missing: ${route.outPath}` });
      continue;
    }

    const dir = getDirection(route.language);
    const { title, description } = getSeoText(route.language, route.page);
    const escapedTitle = escapeHtml(title);
    const escapedDescription = escapeHtml(description);
    const canonicalUrl = `${SITE_URL}${route.outputHref}`;

    const check = (label, condition) => {
      if (!condition) failures.push({ route: routeLabel, reason: label });
    };

    check('<html lang>/<html dir> match the expected language/direction', html.includes(`<html lang="${route.language}" dir="${dir}">`));

    const titleMatches = html.match(/<title>([^<]*)<\/title>/g) || [];
    check('exactly one non-empty <title>', titleMatches.length === 1 && titleMatches[0] !== '<title></title>');
    check('title content matches the expected translated value', html.includes(`<title>${escapedTitle}</title>`));

    check('meta description matches the expected translated value', html.includes(`name="description" content="${escapedDescription}"`));

    const canonicalMatches = html.match(/<link rel="canonical" href="[^"]*"\/>/g) || [];
    check('exactly one canonical link', canonicalMatches.length === 1);
    check('canonical href matches this exact route', html.includes(`<link rel="canonical" href="${canonicalUrl}"/>`));

    const ogLocaleMatches = html.match(/<meta property="og:locale" content="[^"]*"\/>/g) || [];
    check('exactly one og:locale meta tag', ogLocaleMatches.length === 1);
    check(
      `og:locale matches the expected value for "${route.language}" (${OG_LOCALE[route.language]})`,
      html.includes(`property="og:locale" content="${OG_LOCALE[route.language]}"`)
    );

    check('og:url matches this exact route', html.includes(`property="og:url" content="${canonicalUrl}"`));
    check('og:title matches the expected translated value', html.includes(`property="og:title" content="${escapedTitle}"`));
    check('og:description matches the expected translated value', html.includes(`property="og:description" content="${escapedDescription}"`));
    check('twitter:title matches the expected translated value', html.includes(`name="twitter:title" content="${escapedTitle}"`));
    check(
      'twitter:description matches the expected translated value',
      html.includes(`name="twitter:description" content="${escapedDescription}"`)
    );

    const hreflangMatches = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)];
    check('exactly 4 hreflang links (he, en, ru, x-default)', hreflangMatches.length === 4);
    const hreflangMap = Object.fromEntries(hreflangMatches.map((m) => [m[1], m[2]]));
    for (const altLanguage of LANGUAGES) {
      const expectedHref = `${SITE_URL}${localizePath(route.path, altLanguage)}`;
      check(`hreflang="${altLanguage}" points to the correct language equivalent`, hreflangMap[altLanguage] === expectedHref);
    }
    const expectedXDefault = `${SITE_URL}${localizePath(route.path, X_DEFAULT_LANGUAGE)}`;
    check('hreflang="x-default" points to the English equivalent', hreflangMap['x-default'] === expectedXDefault);

    check('no leftover data-seo-default marker', !html.includes('data-seo-default'));
  }

  return failures;
}

async function main() {
  // קריאה *אחת בלבד* של התבנית המקורית, לפני שנכתב קובץ כלשהו. מכיוון ש-
  // JavaScript strings הם immutable ו-`template` מוצהר כ-const, אין שום דרך
  // שהוא ישתנה בהמשך הריצה - כל 12 הנתיבים בהכרח נבנים מאותו מקור בדיוק.
  const template = await fs.readFile(INDEX_PATH, 'utf8');
  const routes = buildRouteList();

  const generated = [];
  for (const route of routes) {
    const html = buildHtmlForRoute(template, route);
    const outPath = outputPathFor(route.outputHref);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf8');
    generated.push({ ...route, outPath });
  }

  console.log(`[generate-static-seo] Generated ${generated.length} route(s).`);

  const failures = await validateRoutes(generated);
  if (failures.length > 0) {
    console.error(`[generate-static-seo] VALIDATION FAILED for ${failures.length} check(s):`);
    for (const failure of failures) {
      console.error(`  - ${failure.route}: ${failure.reason}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`[generate-static-seo] All ${generated.length} routes validated successfully.`);
}

main().catch((error) => {
  console.error('[generate-static-seo] Unexpected error:', error);
  process.exitCode = 1;
});
