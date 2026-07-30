'use client'

import { useEffect, useLayoutEffect } from 'react'

/**
 * `useLayoutEffect` on the client, `useEffect` on the server (avoids React's
 * SSR warning). Use this — not `useEffect` — for any effect that sets up a
 * ScrollTrigger with `pin`.
 *
 * למה זה קריטי: `pin` של ScrollTrigger **עוטף את האלמנט הננעץ ב-div חדש**
 * (`.pin-spacer`) ומעביר אותו לתוכו. React לא יודע על השינוי הזה ב-DOM.
 * ניקוי של `useEffect` הוא passive effect — הוא רץ **אחרי** ש-React מסיר את
 * ה-DOM, ולכן במעבר עמוד (client-side navigation) React מנסה
 * `parent.removeChild(section)` בזמן שההורה האמיתי של הסקשן הוא כבר
 * ה-`pin-spacer` של GSAP → `NotFoundError: Failed to execute 'removeChild'` →
 * כל העץ נופל והדפדפן מציג "This page couldn't load".
 *
 * ניקוי של `useLayoutEffect` רץ סינכרונית **לפני** הסרת ה-DOM, כך ש-
 * `ctx.revert()` מפרק את ה-`pin-spacer` ומחזיר את הסקשן להורה המקורי שלו
 * בזמן — ו-`removeChild` מצליח. זו בדיוק הסיבה שה-hook הרשמי של GSAP
 * (`useGSAP`) בנוי על `useLayoutEffect`.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
