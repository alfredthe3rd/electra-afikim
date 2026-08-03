/**
 * migrate-divisions-order.mjs — add the `_order` column that `orderable: true`
 * needs on the divisions collection, in both databases.
 *
 * Payload injects `_order` as an indexed text field holding a fractional
 * index, so a drag rewrites one row instead of renumbering the table. New
 * documents get a key from a beforeChange hook, but rows that already exist
 * would stay NULL and sort unpredictably — so this backfills them.
 *
 * Seeded in the order the lobby shows today (title, Hebrew alphabetical) so
 * deploying this changes nothing on screen; the order only moves once someone
 * drags a row in the admin.
 *
 * Doing it explicitly rather than letting the adapter push: push is off in
 * production, and this is the same Neon database the live site reads.
 *
 * Usage: node scripts/migrate-divisions-order.mjs [--commit]
 */
import dotenv from 'dotenv'
import pg from 'pg'

import { generateNKeysBetween } from '../node_modules/payload/dist/config/orderable/fractional-indexing.js'

dotenv.config({ path: '.env.local' })
const NEON_URL = process.env.DATABASE_URL
dotenv.config({ path: '.env', override: true })
const LOCAL_URL = process.env.DATABASE_URL

const COMMIT = process.argv.includes('--commit')

async function migrate(label, connectionString) {
  const pool = new pg.Pool({ connectionString })
  const client = await pool.connect()
  try {
    const { rows: existing } = await client.query(
      `select column_name from information_schema.columns
       where table_name = 'divisions' and column_name = '_order'`,
    )
    const { rows: divisions } = await client.query(
      `select id, title, "_order" is not null as has_order
       from divisions order by title asc`.replace(
        '"_order" is not null as has_order',
        existing.length ? '"_order" is not null as has_order' : 'false as has_order',
      ),
    )

    console.log(`\n[${label}] column exists: ${existing.length > 0}, divisions: ${divisions.length}`)
    const keys = generateNKeysBetween(null, null, divisions.length)
    divisions.forEach((d, i) => console.log(`   ${keys[i]}  ${d.title}`))

    if (!COMMIT) return

    await client.query('BEGIN')
    if (!existing.length) {
      await client.query('alter table divisions add column "_order" varchar')
      await client.query('create index if not exists divisions__order_idx on divisions ("_order")')
      console.log(`   [${label}] added column + index`)
    }
    let n = 0
    for (let i = 0; i < divisions.length; i++) {
      const r = await client.query(
        'update divisions set "_order" = $1 where id = $2 and "_order" is null',
        [keys[i], divisions[i].id],
      )
      n += r.rowCount
    }
    await client.query('COMMIT')
    console.log(`   [${label}] backfilled ${n} row(s)`)
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {})
    throw e
  } finally {
    client.release()
    await pool.end()
  }
}

if (NEON_URL === LOCAL_URL) {
  console.error('Local and Neon URLs resolved the same — aborting.')
  process.exit(1)
}

await migrate('local', LOCAL_URL)
await migrate('neon', NEON_URL)
console.log(COMMIT ? '\nDone.' : '\nDry run. Re-run with --commit to apply.')
