import type { Social } from '@/payload-types'

type Card = NonNullable<NonNullable<Social['cards']>['items']>[number]

type LexicalNode = { children?: LexicalNode[]; text?: string; type?: string }

// The panel leaves an empty paragraph behind once text is deleted, so "has a
// value" isn't enough to show the button: look for actual text or an upload.
const hasContent = (node: LexicalNode | undefined): boolean =>
  Boolean(node) &&
  (Boolean(node?.text?.trim()) ||
    node?.type === 'upload' ||
    (node?.children ?? []).some(hasContent))

export const cardHasPage = (card: Card): boolean =>
  Boolean(card.slug) && hasContent(card.details?.root as LexicalNode | undefined)

export const findCardPage = (social: Social, slug: string): Card | undefined =>
  (social.cards?.items ?? []).find((card) => card.slug === slug && cardHasPage(card))
