import fs from 'fs/promises'
import path from 'path'

const SITE_BASE = 'https://www.picktoss.com'
const DIST_DIR = path.resolve(process.cwd(), 'dist')
const INPUT_HTML = path.join(DIST_DIR, 'index.html')

const locales = {
  en: {
    lang: 'en',
    title: 'Picktoss: AI Quiz That Helps You Grow',
    description: 'A smart quiz that helps me grow',
    ogImage: `${SITE_BASE}/images/og-image-eng.png`,
    canonical: `${SITE_BASE}/en`,
  },
  ko: {
    lang: 'ko',
    title: '픽토스: 나를 성장시키는 AI 퀴즈',
    description: '나를 성장시키는 똑똑한 퀴즈',
    ogImage: `${SITE_BASE}/images/og-image.png`,
    canonical: `${SITE_BASE}/ko`,
  },
}

const alternateLinks = {
  en: `${SITE_BASE}/en`,
  ko: `${SITE_BASE}/ko`,
  xDefault: `${SITE_BASE}/en`,
}

const replaceOrInsert = (html, pattern, replacement) => {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement)
  }
  return html.replace('</head>', `${replacement}\n</head>`)
}

const stripExisting = (html) => {
  return html
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<link[^>]+rel=["']alternate["'][^>]*>\s*/gi, '')
}

const applyLocale = (html, localeKey) => {
  const locale = locales[localeKey]
  let localized = html

  localized = replaceOrInsert(localized, /<html[^>]*>/i, `<html lang="${locale.lang}">`)
  localized = replaceOrInsert(localized, /<title>.*?<\/title>/i, `<title>${locale.title}</title>`)
  localized = replaceOrInsert(
    localized,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${locale.description}" />`,
  )
  localized = replaceOrInsert(
    localized,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${locale.title}" />`,
  )
  localized = replaceOrInsert(
    localized,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${locale.description}" />`,
  )
  localized = replaceOrInsert(
    localized,
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${locale.ogImage}" />`,
  )
  localized = replaceOrInsert(
    localized,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${locale.canonical}" />`,
  )
  localized = replaceOrInsert(
    localized,
    /<meta\s+property=["']og:locale["'][^>]*>/i,
    `<meta property="og:locale" content="${locale.lang === 'ko' ? 'ko_KR' : 'en_US'}" />`,
  )
  localized = replaceOrInsert(
    localized,
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${locale.title}" />`,
  )
  localized = replaceOrInsert(
    localized,
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${locale.description}" />`,
  )
  localized = replaceOrInsert(
    localized,
    /<meta\s+name=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${locale.ogImage}" />`,
  )

  localized = stripExisting(localized)

  const hreflangBlock = [
    `<link rel="canonical" href="${locale.canonical}" />`,
    `<link rel="alternate" hreflang="en" href="${alternateLinks.en}" />`,
    `<link rel="alternate" hreflang="ko" href="${alternateLinks.ko}" />`,
    `<link rel="alternate" hreflang="x-default" href="${alternateLinks.xDefault}" />`,
  ].join('\n    ')

  localized = localized.replace('</head>', `${hreflangBlock}\n</head>`)

  return localized
}

const writeLocaleHtml = async (baseHtml, localeKey) => {
  const outputDir = path.join(DIST_DIR, localeKey)
  await fs.mkdir(outputDir, { recursive: true })
  const localized = applyLocale(baseHtml, localeKey)
  await fs.writeFile(path.join(outputDir, 'index.html'), localized, 'utf8')
}

const run = async () => {
  const baseHtml = await fs.readFile(INPUT_HTML, 'utf8')
  await writeLocaleHtml(baseHtml, 'en')
  await writeLocaleHtml(baseHtml, 'ko')
}

run().catch((err) => {
  console.error('[generate-lang-html] 실패:', err)
  process.exit(1)
})
