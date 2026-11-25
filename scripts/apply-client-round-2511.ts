// One-off (client round 25.11.2026): the content half of the round. Code
// changes (header size, wheel sync, team spacing, icon cell, line height,
// /press page) ship with the build; this writes the CMS side.
//   4      — homepage slide 1: the designer's re-made walking video
//   5      — about icons: "הסעות פרטיות" → "פלטפורמה דיגיטלית להזמנת נסיעות",
//            "יבוא אוטובוסים וטכנולוגיות" → "יבוא אוטובוסים"
//   7      — header nav: "מהתקשורת" → /press (coming-soon page), before "צרו קשר"
//   9      — team: שי יצחקוב moves next to טל כהן; new title
//   10     — team: tighter crops of יהודה הכהן / שי מלכה / יניב שונים so their
//            heads match the rest
//   11     — "Yutong" / "יוטונג" → "YUTONG" everywhere in the content
//   12     — timeline 2026: "כניסת קרן תש"י כשותף"
//   14     — Motors slide gets the Yutong video (was on the Nofit slide);
//            Nofit slide gets the designer's light-rail video
//
// Usage: FILES_DIR=<staged folder> [DRY=1] npx payload run scripts/apply-client-round-2511.ts
// DRY=1 prints what would change and writes nothing. Safe to re-run.
import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const DRY = process.env.DRY === '1'
const dir = process.env.FILES_DIR
if (!dir) throw new Error('FILES_DIR is not set')

const payload = await getPayload({ config })

type MediaDoc = { alt?: string | null; filename?: string | null; id: number }
const idOf = (m: unknown) => (typeof m === 'object' && m ? (m as MediaDoc).id : (m as number))

const upload = async (file: string, alt: string): Promise<number> => {
  const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  if (existing.docs[0]) {
    console.log(`  media exists: ${alt} → #${existing.docs[0].id}`)
    return existing.docs[0].id
  }
  if (DRY) {
    console.log(`  [dry] would upload ${file} as "${alt}"`)
    return -1
  }
  const media = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(dir, file) })
  console.log(`  uploaded ${file} → #${media.id} ${media.filename}`)
  return media.id
}

// ---- 11: YUTONG, as a deep string replace over a document
const YUTONG = /Yutong|יוטונג/g
const deepReplace = (value: unknown): unknown => {
  if (typeof value === 'string') return value.replace(YUTONG, 'YUTONG')
  if (Array.isArray(value)) return value.map(deepReplace)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepReplace(v)]))
  }
  return value
}
/** Top-level fields of `next` (after YUTONG) that differ from `original`. */
const yutongPatch = (originalDoc: object, nextDoc: object = originalDoc) => {
  const original = originalDoc as Record<string, unknown>
  const patch: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(nextDoc)) {
    if (['id', 'createdAt', 'updatedAt', 'globalType'].includes(key)) continue
    const replaced = deepReplace(value)
    if (JSON.stringify(replaced) !== JSON.stringify(original[key])) patch[key] = replaced
  }
  return patch
}

// ---- Media
console.log('Media:')
const walkVideo = await upload('main-walk-2511.mp4', 'סרטון ראשי - אנשים הולכים (25.11)')
const railVideo = await upload('nofit-rail-2511.mp4', 'סרטון נופית - רכבת קלה')
const yehudaPhoto = await upload('yehuda-hacohen-2511.jpg', 'יהודה הכהן (25.11)')
const shaiMalkaPhoto = await upload('shai-malka-2511.jpg', 'שי מלכה (25.11)')
const yanivPhoto = await upload('yaniv-shonim-2511.jpg', 'יניב שונים (25.11)')

const yutongMedia = await payload.find({
  collection: 'media',
  where: { or: [{ alt: { like: 'יוטונג' } }, { alt: { like: 'Yutong' } }] },
  limit: 20,
})
for (const m of yutongMedia.docs) {
  const alt = (m.alt ?? '').replace(YUTONG, 'YUTONG')
  console.log(`  media #${m.id} alt "${m.alt}" → "${alt}"`)
  if (!DRY) await payload.update({ collection: 'media', id: m.id, data: { alt } })
}

// ---- Home: slides (4, 14) + YUTONG
const home = await payload.findGlobal({ slug: 'home', depth: 0 })
const slides = home.divisions.slides
const find = (needle: string) => {
  const i = slides.findIndex((s) => s.text.includes(needle))
  if (i < 0) throw new Error(`no slide with "${needle}"`)
  return i
}
const iTransit = find('תחבורה ציבורית')
const iRail = find('רכבת קלה')
const iImport = find('ייבוא')
// The Yutong video currently sits on the rail slide (as its built-in default).
const yutongDefault = slides[iRail].defaultVideo
console.log(`Slides: transit #${iTransit + 1}, rail #${iRail + 1} (default ${yutongDefault}), import #${iImport + 1} (default ${slides[iImport].defaultVideo})`)
const nextSlides = slides.map((s, i) => {
  const base = {
    defaultVideo: s.defaultVideo,
    id: s.id,
    logo: idOf(s.logo),
    text: s.text,
    video: s.video ? idOf(s.video) : null,
    videoFocus: s.videoFocus ?? 'center',
  }
  if (i === iTransit) return { ...base, video: walkVideo }
  if (i === iRail) return { ...base, video: railVideo }
  // Only take the rail slide's default if it is still the Yutong clip (re-run safe)
  if (i === iImport && yutongDefault === '/movie-3.mp4') return { ...base, defaultVideo: '/movie-3.mp4', video: null }
  return base
})
nextSlides.forEach((s, i) => console.log(`  ${i + 1}. video ${s.video ?? s.defaultVideo} | ${s.text.slice(0, 40)}`))
const homePatch = yutongPatch(home, { ...home, divisions: { ...home.divisions, slides: nextSlides } })
console.log(`Home fields to write: ${Object.keys(homePatch).join(', ') || '(none)'}`)
if (!DRY && Object.keys(homePatch).length) {
  await payload.updateGlobal({ slug: 'home', data: homePatch, depth: 0 })
}

// ---- About: icons (5), team (9, 10), timeline (12) + YUTONG
const about = await payload.findGlobal({ slug: 'about', depth: 0 })

const ICON_LABELS: Record<string, string> = {
  'הסעות פרטיות': 'פלטפורמה דיגיטלית להזמנת נסיעות',
  'יבוא אוטובוסים וטכנולוגיות': 'יבוא אוטובוסים',
}
const icons = (about.icons.items ?? []).map((item) => ({
  ...item,
  icon: idOf(item.icon),
  label: ICON_LABELS[item.label] ?? item.label,
}))
console.log('Icons:', icons.map((i) => i.label).join(' | '))

const PHOTOS: Record<string, number> = {
  'יהודה הכהן': yehudaPhoto,
  'יניב שונים': yanivPhoto,
  'שי מלכה': shaiMalkaPhoto,
}
const SHAI_Y_ROLE = 'סמנכ"ל בכיר, כספים ופיתוח עסקי'
type Member = NonNullable<typeof about.team.topRow>[number]
const fixMember = (m: Member) => ({
  ...m,
  photo: PHOTOS[m.name] ?? idOf(m.photo),
  role: m.name === 'שי יצחקוב' ? SHAI_Y_ROLE : m.role,
})
let topRow = (about.team.topRow ?? []).map(fixMember)
const bottomRow = (about.team.bottomRow ?? []).map(fixMember)
// שי יצחקוב right after טל כהן
const iShai = topRow.findIndex((m) => m.name === 'שי יצחקוב')
const iTal = topRow.findIndex((m) => m.name === 'טל כהן')
if (iShai < 0 || iTal < 0) throw new Error('team: טל כהן / שי יצחקוב not in the top row')
if (iShai !== iTal + 1) {
  const shai = topRow[iShai]
  topRow = topRow.filter((_, i) => i !== iShai)
  topRow.splice(topRow.findIndex((m) => m.name === 'טל כהן') + 1, 0, shai)
}
console.log('Team top:', topRow.map((m) => `${m.name} (${m.role})`).join(' | '))
console.log('Team bottom:', bottomRow.map((m) => m.name).join(' | '))

const milestones = (about.story.milestones ?? []).map((m) =>
  m.year === '2026' && m.lines.includes('150 אוטובוסים') ? { ...m, lines: 'כניסת קרן תש"י כשותף' } : m,
)
console.log('2026:', milestones.find((m) => m.year === '2026')?.lines)

const aboutPatch = yutongPatch(about, {
  ...about,
  icons: { ...about.icons, items: icons },
  story: { ...about.story, milestones },
  team: { ...about.team, bottomRow, topRow },
})
console.log(`About fields to write: ${Object.keys(aboutPatch).join(', ') || '(none)'}`)
if (!DRY && Object.keys(aboutPatch).length) {
  await payload.updateGlobal({ slug: 'about', data: aboutPatch, depth: 0 })
}

// ---- Header nav (7)
const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
const nav = settings.header.nav ?? []
if (nav.some((n) => n.href === '/press')) {
  console.log('Nav: /press already there.')
} else {
  const iContact = nav.findIndex((n) => n.href === '/contact')
  const nextNav = [...nav]
  nextNav.splice(iContact < 0 ? nav.length : iContact, 0, { href: '/press', label: 'מהתקשורת' } as (typeof nav)[number])
  console.log('Nav:', nextNav.map((n) => n.label).join(' | '))
  if (!DRY) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { header: { ...settings.header, nav: nextNav } },
      depth: 0,
    })
  }
}

// ---- YUTONG in the other globals + divisions
for (const slug of ['lobby', 'social'] as const) {
  const doc = await payload.findGlobal({ slug, depth: 0 })
  const patch = yutongPatch(doc)
  if (Object.keys(patch).length) {
    console.log(`${slug}: YUTONG in ${Object.keys(patch).join(', ')}`)
    if (!DRY) await payload.updateGlobal({ slug, data: patch, depth: 0 })
  }
}
const divisions = await payload.find({ collection: 'divisions', depth: 0, limit: 50 })
for (const d of divisions.docs) {
  const patch = yutongPatch(d)
  if (Object.keys(patch).length) {
    console.log(`division ${d.title}: YUTONG in ${Object.keys(patch).join(', ')}`)
    if (!DRY) await payload.update({ collection: 'divisions', id: d.id, data: patch, depth: 0 })
  }
}

console.log(DRY ? 'Dry run — nothing written.' : 'Done.')
process.exit(0)
