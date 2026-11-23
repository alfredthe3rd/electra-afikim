// One-off (client round 23.11.2026, designer's files): content fixes that live
// in the CMS, not the code.
//   1  — slide 1 logo: "פשוט להגיע" instead of "מניעים אותך קדימה"
//   3/4/6/7 — the logos on the rail / import / college slides were rotated;
//        each slide gets the logo that matches its text
//   4  — college slide: the designer's college video instead of the bus fleet
//   5  — service-center slide: the designer's video, focused on the top so the
//        sign isn't cropped off
//   8  — partners: add עיריית יבנה
//   16 / 18 — new banner images for the Motors and college pages
//
// Usage: FILES_DIR=<staged folder> [DRY=1] npx payload run scripts/apply-designer-fixes-2311.ts
// DRY=1 prints what would change and writes nothing. Safe to re-run: each step
// checks whether it was already applied.
import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const DRY = process.env.DRY === '1'
const dir = process.env.FILES_DIR
if (!dir) throw new Error('FILES_DIR is not set')

const payload = await getPayload({ config })

type MediaDoc = { alt?: string | null; filename?: string | null; id: number }
const idOf = (m: unknown) => (typeof m === 'object' && m ? (m as MediaDoc).id : (m as number))
const nameOf = (m: unknown) => (typeof m === 'object' && m ? (m as MediaDoc).filename : String(m))

const upload = async (file: string, alt: string): Promise<number> => {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: alt } },
    limit: 1,
  })
  if (existing.docs[0]) {
    console.log(`  media exists: ${alt} → #${existing.docs[0].id}`)
    return existing.docs[0].id
  }
  if (DRY) {
    console.log(`  [dry] would upload ${file} as "${alt}"`)
    return -1
  }
  const media = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(dir, file) })
  console.log(`  uploaded ${file} → #${media.id} ${media.filename} ${media.width ?? ''}x${media.height ?? ''}`)
  return media.id
}

// ---- Homepage slides + partners
const home = await payload.findGlobal({ slug: 'home', depth: 1 })
const slides = home.divisions.slides
console.log('Slides before:')
slides.forEach((s, i) => console.log(`  ${i + 1}. ${nameOf(s.logo)} | ${s.text.slice(0, 40)}`))

const find = (needle: string) => {
  const i = slides.findIndex((s) => s.text.includes(needle))
  if (i < 0) throw new Error(`no slide with "${needle}"`)
  return i
}
const iTransit = find('תחבורה ציבורית')
const iRail = find('רכבת קלה')
const iImport = find('ייבוא')
const iCollege = find('הכשרת')
const iService = find('מערכי תחזוקה')

const media = await payload.find({ collection: 'media', limit: 500, depth: 0 })
console.log('Logo candidates:')
for (const m of media.docs.filter((d) => slides.some((s) => idOf(s.logo) === d.id))) {
  console.log(`  #${m.id} ${m.filename} (${m.alt})`)
}

const taglineLogo = await upload('afikim-logo-tagline.png', 'אלקטרה אפיקים - פשוט להגיע')
const collegeVideo = await upload('college-home.mp4', 'סרטון המכללה - דף הבית')
const serviceVideo = await upload('service-center.mp4', 'סרטון מרכז השירות - דף הבית')
const yavne = await upload('yavne.png', 'עיריית יבנה')
const motorsBanner = await upload('motors-banner.jpeg', 'אלקטרה מוטורס - באנר')
const collegeBanner = await upload('college-banner.jpeg', 'המכללה למקצועות התחבורה - באנר')

// Rotation as seen on the live site: the rail text carries the Motors logo,
// the import text the college logo, the college text the Nofit logo.
const motorsLogo = idOf(slides[iRail].logo)
const collegeLogo = idOf(slides[iImport].logo)
const nofitLogo = idOf(slides[iCollege].logo)
type Change = { logo?: number; video?: number; videoFocus?: 'bottom' | 'center' | 'top' }
const plan = new Map<number, Change>([
  [iTransit, { logo: taglineLogo }],
  [iRail, { logo: nofitLogo }],
  [iImport, { logo: motorsLogo }],
  [iCollege, { logo: collegeLogo, video: collegeVideo }],
  [iService, { video: serviceVideo, videoFocus: 'top' }],
])
// Already applied? (the college slide then holds the college video)
const applied = idOf(slides[iCollege].video) === collegeVideo
const nextSlides = slides.map((s, i) => {
  const change = applied ? undefined : plan.get(i)
  return {
    defaultVideo: s.defaultVideo,
    id: s.id,
    logo: change?.logo ?? idOf(s.logo),
    text: s.text,
    video: change?.video ?? (s.video ? idOf(s.video) : null),
    videoFocus: change?.videoFocus ?? s.videoFocus ?? 'center',
  }
})
console.log(applied ? 'Slides already fixed.' : 'Slides after:')
if (!applied) {
  nextSlides.forEach((s, i) => {
    const name = media.docs.find((m) => m.id === s.logo)?.filename ?? `#${s.logo}`
    console.log(`  ${i + 1}. ${name} | ${s.text.slice(0, 40)}${plan.get(i)?.video ? ` | + video #${plan.get(i)?.video}` : ''}${plan.get(i)?.videoFocus ? ` focus ${plan.get(i)?.videoFocus}` : ''}`)
  })
}

const logos = home.partners.logos ?? []
const hasYavne = logos.some((l) => idOf(l.logo) === yavne)
console.log(hasYavne ? 'Yavne already in partners.' : `Partners: ${logos.length} → ${logos.length + 1} (Yavne last)`)

if (!DRY && (!applied || !hasYavne)) {
  await payload.updateGlobal({
    slug: 'home',
    data: {
      divisions: { ...home.divisions, slides: nextSlides },
      partners: {
        ...home.partners,
        logos: [
          ...logos.map((l) => ({ id: l.id, logo: idOf(l.logo) })),
          ...(hasYavne ? [] : [{ logo: yavne }]),
        ],
      },
    },
    depth: 0,
  })
  console.log('Home updated.')
}

// ---- Division banners
for (const [slug, banner] of [
  ['אלקטרה-מוטורוס-יבוא-ושיווק', motorsBanner],
  ['הכשרה-המכללה-למקצועות-התחבורה', collegeBanner],
] as const) {
  const { docs } = await payload.find({ collection: 'divisions', where: { slug: { equals: slug } }, depth: 1 })
  const d = docs[0]
  if (!d) throw new Error(`division not found: ${slug}`)
  const current = idOf(d.bannerImage)
  console.log(`${d.title}: banner ${nameOf(d.bannerImage)} → ${current === banner ? '(already)' : `#${banner}`}`)
  if (!DRY && current !== banner) {
    await payload.update({ collection: 'divisions', id: d.id, data: { bannerImage: banner } })
  }
}

process.exit(0)
