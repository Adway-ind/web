import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const ringX = useRef(0)
  const ringY = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current

    const onMouseMove = (e) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
    }

    const animate = () => {
      ringX.current += (mouseX.current - ringX.current) * 0.12
      ringY.current += (mouseY.current - ringY.current) * 0.12
      ring.style.left = ringX.current + 'px'
      ring.style.top = ringY.current + 'px'
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    const onEnter = () => {
      ring.classList.add('cursor-hover')
      dot.classList.add('cursor-hover-dot')
    }
    const onLeave = () => {
      ring.classList.remove('cursor-hover')
      dot.classList.remove('cursor-hover-dot')
    }

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    addHoverListeners()

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[29999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 hidden md:flex"
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed w-9 h-9 border border-white rounded-full pointer-events-none z-[29998] -translate-x-1/2 -translate-y-1/2 opacity-70 transition-[width,height,opacity] duration-300 hidden md:flex"
      />
    </>
  )
}