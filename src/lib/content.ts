import { getPayload } from 'payload'
import type { GlobalSlug } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import type { Config } from '@/payload-types'

export const getCms = cache(async () => getPayload({ config: await config }))

// Deduplicated per request: the layout, the metadata and the page all read the
// site settings while rendering one page.
export const getGlobal = cache(
  async <T extends GlobalSlug>(slug: T): Promise<Config['globals'][T]> => {
    const payload = await getCms()
    return (await payload.findGlobal({ depth: 1, slug })) as Config['globals'][T]
  },
)
