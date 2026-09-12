import { useRef, type ReactNode } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { noMotion } from '../lib/gsap'

/**
 * React Spring's job on this site: pointer-driven magnetism on the main calls to
 * action. Spring physics suits an interruptible, continuously-retargeted motion
 * far better than GSAP tweens would, the element chases the cursor and settles
 * naturally when it leaves.
 */
export function MagneticLink({
  href,
  children,
  external = false,
  className = '',
  ariaLabel,
  strength = 0.35,
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
  ariaLabel?: string
  strength?: number
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { tension: 260, friction: 22, mass: 0.7 },
  }))

  function onMove(e: React.MouseEvent) {
    if (noMotion() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    api.start({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    })
  }

  return (
    <animated.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      data-cursor
      style={style}
      onMouseMove={onMove}
      onMouseLeave={() => api.start({ x: 0, y: 0 })}
      onBlur={() => api.start({ x: 0, y: 0 })}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-block py-1.5 ${className}`}
    >
      {children}
    </animated.a>
  )
}
