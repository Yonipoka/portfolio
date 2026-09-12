import { SITE, PAGE_MAP, type Lang } from '../i18n'

const BASE = import.meta.env.BASE_URL // '/portfolio/'

/** Builds an in-site href that respects the GitHub Pages sub-path. */
export function u(path: string): string {
  return BASE + path.replace(/^\//, '')
}

/** Absolute URL, used for canonical tags and structured data. */
export function abs(path: string): string {
  return SITE.origin + u(path)
}

export function pagePath(page: keyof typeof PAGE_MAP, lang: Lang): string {
  return u(PAGE_MAP[page][lang])
}
