import { useEffect, useRef } from 'react'
import './ShaderCanvas.css'

export default function ShaderCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let n = 0

    const isDark = () => {
      const t = document.documentElement.getAttribute('data-theme')
      if (t === 'dark') return true
      if (t === 'light') return false
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    const draw = () => {
      const r = isDark() ? 50 : 150
      const red = (x, y, n) => Math.floor(r + 64 * Math.sin(5 * Math.sin(n / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100))
      const grn = (x, y, n) => Math.floor(r + 50 * Math.sin((x * x * Math.cos(n / 4) + y * y * Math.sin(n / 3)) / 300))
      const blu = (x, y, n) => Math.floor(r + 48 * Math.cos((x * x - y * y) / 200 + n))

      for (let x = 0; x <= 30; x++) {
        for (let y = 0; y <= 30; y++) {
          ctx.fillStyle = `rgb(${red(x, y, n)}, ${grn(x, y, n)}, ${blu(x, y, n)})`
          ctx.fillRect(x, y, 10, 10)
        }
      }
      n += 0.015
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return <canvas ref={canvasRef} width="32" height="20" className="shader-canvas" />
}
