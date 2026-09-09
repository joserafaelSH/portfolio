import { useEffect, useState } from 'react'

/** Matches Tailwind's `md` breakpoint — below it, the terminal is replaced by the plain mobile views. */
const DESKTOP_QUERY = '(min-width: 768px)'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => !window.matchMedia(DESKTOP_QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(!e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
