// Append one logo to the homepage partners strip. Idempotent by alt.
// Usage: FILE=<path> ALT="<name>" [DRY=1] npx payload run scripts/add-partner-logo.ts
import { getPayload } from 'payload'

import config from '../src/payload.config'

const { ALT, DRY, FILE } = process.env
if (!FILE || !ALT) throw new Error('FILE and ALT are required')

const payload = await getPayload({ config })
const idOf = (m: unknown) => (typeof m === 'object' && m ? (m as { id: number }).id : (m as number))

const existing = await payload.find({ collection: 'media', where: { alt: { equals: ALT } }, limit: 1 })
let id = existing.docs[0]?.id
if (id) console.log(`media exists: #${id}`)
else if (DRY === '1') console.log(`[dry] would upload ${FILE} as "${ALT}"`)
else {
  const media = await payload.create({ collection: 'media', data: { alt: ALT }, filePath: FILE })
  id = media.id
  console.log(`uploaded → #${media.id} ${media.filename} ${media.width}x${media.height}`)
}

const home = await payload.findGlobal({ slug: 'home', depth: 0 })
const logos = home.partners.logos ?? []
if (id && logos.some((l) => idOf(l.logo) === id)) {
  console.log('already in partners')
} else {
  console.log(`partners: ${logos.length} → ${logos.length + 1}`)
  if (DRY !== '1' && id) {
    await payload.updateGlobal({
      slug: 'home',
      data: { partners: { ...home.partners, logos: [...logos.map((l) => ({ id: l.id, logo: idOf(l.logo) })), { logo: id }] } },
      depth: 0,
    })
    console.log('home updated')
  }
}
process.exit(0)
