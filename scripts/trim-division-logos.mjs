/**
 * trim-division-logos.mjs — keep every division logo trimmed to its ink.
 *
 * The lobby and the division template box the logo and use `object-fit:
 * contain`, so any transparent margin baked into the PNG is dead space that
 * shrinks the mark and costs it resolution. The original six were trimmed by
 * hand; this does it for whatever is currently attached to a division, so a
 * logo freshly uploaded through the admin gets the same treatment.
 *
 * Reads each division's logo straight from Blob (the admin uploads there, and
 * those files never land in the local media/ dir), trims, re-uploads to the
 * same pathname, and syncs width/height/filesize to both databases.
 *
 * Usage: node scripts/trim-division-logos.mjs [--commit]
 */
import { mkdirSync, writeFileSync } from 'node:fs'

import { put } from '@vercel/blob'
import dotenv from 'dotenv'
import pg from 'pg'
import sharp from 'sharp'

dotenv.config({ path: '.env.local' })
const NEON_URL = process.env.DATABASE_URL
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
dotenv.config({ path: '.env', override: true })
const LOCAL_URL = process.env.DATABASE_URL

const COMMIT = process.argv.includes('--commit')
const BACKUP = 'scripts/.logo-backup'
mkdirSync(BACKUP, { recursive: true })

const neon = new pg.Pool({ connectionString: NEON_URL })
const { rows } = await neon.query(`
  select d.id as division_id, d.title, m.id as media_id, m.filename, m.url, m.width, m.height
  from divisions d join media m on m.id = d.logo_id order by d.id
`)

console.log(`${rows.length} divisions have a logo attached\n`)
const work = []

for (const r of rows) {
  const url = `https://hebrew-cms.vercel.app/api/media/file/${encodeURIComponent(r.filename)}`
  const res = await fetch(url)
  if (!res.ok) { console.log(`  ! ${r.filename}: HTTP ${res.status}`); continue }
  const buf = Buffer.from(await res.arrayBuffer())
  const img = sharp(buf)
  const { width, height } = await img.metadata()
  // trim fully-transparent margin only
  const trimmed = await sharp(buf).trim({ threshold: 0 }).toBuffer()
  const t = await sharp(trimmed).metadata()
  const wasteW = 1 - t.width / width
  const wasteH = 1 - t.height / height
  const needs = t.width !== width || t.height !== height
  console.log(
    `  ${needs ? 'TRIM' : 'ok  '} ${r.filename.padEnd(24)} ${width}x${height}` +
      (needs ? ` -> ${t.width}x${t.height}  (dead ${Math.round(wasteW * 100)}% w / ${Math.round(wasteH * 100)}% h)` : ''),
  )
  if (needs) {
    writeFileSync(`${BACKUP}/${r.filename}`, buf)
    work.push({ ...r, buf: trimmed, w: t.width, h: t.height, size: trimmed.length })
  }
}

if (!work.length) {
  console.log('\nNothing to trim.')
  await neon.end()
  process.exit(0)
}

if (!COMMIT) {
  console.log(`\nDry run — ${work.length} file(s) would be trimmed. Re-run with --commit.`)
  await neon.end()
  process.exit(0)
}

console.log('\nApplying...')
const local = new pg.Pool({ connectionString: LOCAL_URL })
for (const w of work) {
  const r = await put(w.filename, w.buf, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'image/png',
    token: BLOB_TOKEN,
  })
  for (const [label, pool] of [['neon', neon], ['local', local]]) {
    const q = await pool.query(
      'update media set width=$1, height=$2, filesize=$3 where filename=$4',
      [String(w.w), String(w.h), String(w.size), w.filename],
    )
    console.log(`  ${label}: ${w.filename} -> ${w.w}x${w.h} (rows ${q.rowCount})`)
  }
  console.log(`  blob: ${r.url}`)
}
await local.end()
await neon.end()
console.log('\nDone. Originals backed up in ' + BACKUP)
