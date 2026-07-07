'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref to attach to a container element and a boolean `visible`
 * that flips to `true` once the element enters the viewport.
 * Uses IntersectionObserver with a fallback for reliability.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check immediately if already in viewport
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Small delay to let CSS paint the initial hidden state first
      const timer = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px 50px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}
