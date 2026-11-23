// Client round 23.11 (notes 13/19): annual passengers 52 million → 54 million,
// wherever the CMS holds it (globals + divisions, incl. rich text and stats).
// Usage: [DRY=1] npx payload run scripts/passengers-54m.ts
import { getPayload } from 'payload'

import config from '../src/payload.config'

const DRY = process.env.DRY === '1'
const payload = await getPayload({ config })

const TEXT = /52(\s*מיליון|M\b)/g
const SKIP = new Set(['id', 'createdAt', 'updatedAt', 'globalType', '_status'])

// Returns the patched copy and logs each hit with its path.
const patch = (value: unknown, path: string, hits: string[]): unknown => {
  if (typeof value === 'string') {
    if (!TEXT.test(value)) return value
    TEXT.lastIndex = 0
    hits.push(`${path}: …${value.match(/.{0,30}52(\s*מיליון|M)/)?.[0]}`)
    return value.replace(TEXT, '54$1')
  }
  if (Array.isArray(value)) return value.map((v, i) => patch(v, `${path}[${i}]`, hits))
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) out[k] = patch(v, `${path}.${k}`, hits)
    // Stat items: { number: 52, suffix: 'M', overlayText: 'נוסעים' }
    const label = `${obj.overlayText ?? ''} ${obj.legendText ?? ''} ${obj.title ?? ''}`
    if (obj.number === 52 && /נוסע/.test(label)) {
      hits.push(`${path}.number: 52 (${label.trim()})`)
      out.number = 54
    }
    return out
  }
  return value
}

const changedFields = (doc: Record<string, unknown>, label: string) => {
  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(doc)) {
    if (SKIP.has(k)) continue
    const hits: string[] = []
    const next = patch(v, k, hits)
    if (hits.length) {
      hits.forEach((h) => console.log(`  ${label} ${h}`))
      data[k] = next
    }
  }
  return data
}

for (const slug of ['home', 'about', 'lobby', 'social', 'site-settings', 'contact', 'accessibility', 'privacy'] as const) {
  let doc: Record<string, unknown>
  try {
    doc = (await payload.findGlobal({ slug: slug as never, depth: 0 })) as Record<string, unknown>
  } catch {
    continue
  }
  const data = changedFields(doc, `[${slug}]`)
  if (Object.keys(data).length && !DRY) {
    await payload.updateGlobal({ slug: slug as never, data: data as never, depth: 0 })
    console.log(`  → ${slug} updated`)
  }
}

const { docs } = await payload.find({ collection: 'divisions', limit: 100, depth: 0 })
for (const d of docs) {
  const data = changedFields(d as unknown as Record<string, unknown>, `[division ${d.slug}]`)
  if (Object.keys(data).length && !DRY) {
    await payload.update({ collection: 'divisions', id: d.id, data: data as never, depth: 0 })
    console.log(`  → ${d.slug} updated`)
  }
}
console.log(DRY ? 'dry run done' : 'done')
process.exit(0)
