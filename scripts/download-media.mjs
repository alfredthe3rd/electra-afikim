// Copies every upload from a running copy of the site into a local folder,
// keeping the exact filenames stored in the database. Used once, to move the
// media from Vercel Blob onto the server.
//
//   node scripts/download-media.mjs https://hebrew-cms.vercel.app ./media
//
// Needs no credentials: the media collection is publicly readable.
// Files that already exist with the right size are skipped, so it is safe to
// run again.

import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const [source, outDir = './media'] = process.argv.slice(2)
if (!source) {
  console.error('Usage: node scripts/download-media.mjs <site-url> [out-dir]')
  process.exit(1)
}
const base = source.replace(/\/+$/, '')

await mkdir(outDir, { recursive: true })

let page = 1
let ok = 0
let skipped = 0
const failed = []

while (true) {
  const res = await fetch(`${base}/api/media?limit=100&depth=0&page=${page}`)
  if (!res.ok) throw new Error(`Listing media failed: HTTP ${res.status}`)
  const { docs, hasNextPage, totalDocs } = await res.json()
  if (page === 1) console.log(`${totalDocs} media records`)

  for (const doc of docs) {
    const target = path.join(outDir, doc.filename)
    const existing = await stat(target).catch(() => null)
    if (existing && doc.filesize && existing.size === doc.filesize) {
      skipped++
      continue
    }
    const fileRes = await fetch(`${base}/api/media/file/${encodeURIComponent(doc.filename)}`)
    if (!fileRes.ok) {
      failed.push(`${doc.filename} (HTTP ${fileRes.status})`)
      continue
    }
    const buf = Buffer.from(await fileRes.arrayBuffer())
    await writeFile(target, buf)
    if (doc.filesize && buf.length !== doc.filesize) {
      console.warn(`  size differs from DB: ${doc.filename} (${buf.length} vs ${doc.filesize})`)
    }
    console.log(`  ✓ ${doc.filename}`)
    ok++
  }

  if (!hasNextPage) break
  page++
}

console.log(`\nDownloaded ${ok}, already present ${skipped}, failed ${failed.length}`)
if (failed.length) {
  console.log(failed.map((f) => `  ✗ ${f}`).join('\n'))
  process.exit(1)
}
