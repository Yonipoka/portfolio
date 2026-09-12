import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { CustomEase } from 'gsap/CustomEase'
import { prefersReducedMotion } from './motion'

/**
 * GSAP became free for every plugin in 2025, so the whole premium toolkit is
 * available here. Registering once, in one module, keeps plugin setup out of
 * the components and guarantees the same easing vocabulary everywhere.
 */
gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  Flip,
  Observer,
  CustomEase,
)

/** One signature ease used across the whole site, so the motion feels authored. */
CustomEase.create('swiss', '0.16, 1, 0.3, 1')
CustomEase.create('swissIn', '0.7, 0, 0.84, 0')

gsap.defaults({ ease: 'swiss', duration: 1 })

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Flip, Observer, DrawSVGPlugin }

/** True when we must not animate. Every timeline in the app checks this. */
export const noMotion = prefersReducedMotion

/**
 * Splits an element into masked lines and returns the line elements.
 * Caller is responsible for reverting the split on cleanup.
 */
export function splitLines(el: HTMLElement) {
  const split = new SplitText(el, {
    type: 'lines',
    linesClass: 'split-line',
    mask: 'lines',
  })
  return split
}
