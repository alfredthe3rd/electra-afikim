import localFont from 'next/font/local'

export const almoniNeue = localFont({
  src: [
    { path: './almoni-neue-light-aaa.woff2', weight: '300', style: 'normal' },
    { path: './almoni-neue-regular-aaa.woff2', weight: '400', style: 'normal' },
    { path: './almoni-neue-bold-aaa.woff2', weight: '700', style: 'normal' },
    { path: './almoni-neue-black-aaa.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-almoni-neue',
})
