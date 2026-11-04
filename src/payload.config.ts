import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { he } from '@payloadcms/translations/languages/he'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Divisions } from './collections/Divisions'
import { About } from './globals/About'
import { Contact } from './globals/Contact'
import { Home } from './globals/Home'
import { Accessibility, Privacy } from './globals/Legal'
import { Lobby } from './globals/Lobby'
import { SiteSettings } from './globals/SiteSettings'
import { Social } from './globals/Social'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SEO_LABELS: Record<string, string> = {
  description: 'תיאור למנועי חיפוש',
  image: 'תמונה לשיתוף ברשתות',
  title: 'כותרת למנועי חיפוש',
}

// Where each global renders, for the SEO tab's Google preview.
const GLOBAL_PATHS: Record<string, string> = {
  about: '/about',
  accessibility: '/accessibility',
  contact: '/contact',
  home: '/',
  lobby: '/divisions',
  privacy: '/privacy-policy',
  'site-settings': '/',
  social: '/social-responsibility',
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Divisions],
  globals: [SiteSettings, Home, About, Lobby, Social, Contact, Accessibility, Privacy],
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: 'he',
    supportedLanguages: { he },
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Schema changes go through src/migrations in every environment, so what
    // runs locally is exactly what the server will apply on its next start.
    push: false,
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['divisions'],
      fields: ({ defaultFields }) => [
        ...defaultFields.map((field) =>
          'name' in field && SEO_LABELS[field.name]
            ? ({ ...field, label: SEO_LABELS[field.name] } as typeof field)
            : field,
        ),
        {
          name: 'noindex',
          type: 'checkbox',
          label: 'להסתיר את העמוד ממנועי חיפוש',
        },
      ],
      generateDescription: ({ doc }) => (doc as { description?: string }).description ?? '',
      generateTitle: async ({ doc, req }) => {
        const settings = await req.payload.findGlobal({ slug: 'site-settings' })
        const title = (doc as { title?: string }).title
        return title ? `${title.trim()} | ${settings.brand.siteName}` : settings.brand.siteName
      },
      generateURL: async ({ collectionSlug, doc, globalSlug, req }) => {
        const settings = await req.payload.findGlobal({ slug: 'site-settings' })
        const page =
          collectionSlug === 'divisions'
            ? `/divisions/${(doc as { slug?: string }).slug ?? ''}`
            : (GLOBAL_PATHS[globalSlug ?? ''] ?? '/')
        return `${settings.brand.siteUrl}${encodeURI(page)}`
      },
      globals: Object.keys(GLOBAL_PATHS),
      tabbedUI: true,
      uploadsCollection: 'media',
    }),
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
