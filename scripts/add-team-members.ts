// One-off (client request, Ayelet Shenhar 3.8 + 2.11.2026): add Yoav Swisa and
// Omer Zohar to the management team and rebalance the two rows to 5 + 8.
// Usage: PHOTOS_DIR=<folder with yoav-swisa.jpg, omer-zohar.jpg> npx payload run scripts/add-team-members.ts
// Safe to re-run: skips anyone already on the page.
import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const NEW = [
  { file: 'yoav-swisa.jpg', name: 'יואב סויסה', role: 'מנכ"ל אלקטרה היסעים' },
  { file: 'omer-zohar.jpg', name: 'עומר זוהר', role: 'מנכ"ל אלקטרה מוטורס' },
]

const payload = await getPayload({ config })
const about = await payload.findGlobal({ slug: 'about', depth: 0 })
const strip = (rows: typeof about.team.topRow) =>
  (rows ?? []).map(({ name, photo, role }) => ({ name, photo, role }))
const all = [...strip(about.team.topRow), ...strip(about.team.bottomRow)]

const dir = process.env.PHOTOS_DIR
if (!dir) throw new Error('PHOTOS_DIR is not set')

const added = []
for (const person of NEW) {
  if (all.some((m) => m.name === person.name)) {
    console.log('already there:', person.name)
    continue
  }
  const media = await payload.create({
    collection: 'media',
    data: { alt: person.name },
    filePath: path.join(dir, person.file),
  })
  console.log('media', media.id, media.filename, `${media.width}x${media.height}`)
  added.push({ name: person.name, photo: media.id, role: person.role })
}

// Subsidiary CEOs sit right after the group CEO and the public-transport CEO.
const afterYehuda = all.findIndex((m) => m.name.includes('יהודה')) + 1
const ordered = [...all.slice(0, afterYehuda), ...added, ...all.slice(afterYehuda)]

await payload.updateGlobal({
  slug: 'about',
  data: { team: { ...about.team, bottomRow: ordered.slice(5), topRow: ordered.slice(0, 5) } },
})
console.log('top:', ordered.slice(0, 5).map((m) => m.name).join(' | '))
console.log('bottom:', ordered.slice(5).map((m) => m.name).join(' | '))
process.exit(0)
