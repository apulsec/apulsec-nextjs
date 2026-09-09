// components/location-globe.tsx
"use client"

import createGlobe from "cobe"
import { MapPinIcon } from "lucide-react"
import { useSpring } from "@react-spring/web"
import { useEffect, useRef, useState } from "react"

export default function LocationGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerMovement = useRef(0)
  const [isDark, setIsDark] = useState(false)

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
    },
  }))

  useEffect(() => {
    const root = document.documentElement

    const syncTheme = () => {
      setIsDark(root.classList.contains("dark"))
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    let width = Math.max(parent.clientWidth, 1)

    const resizeObserver = new ResizeObserver(() => {
      width = Math.max(parent.clientWidth, 1)
    })

    resizeObserver.observe(parent)

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: width * 2,
      height: width * 2,
      phi: 2.75,
      theta: 0.3,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 2 : 3,
      mapSamples: 12_000,
      mapBrightness: isDark ? 2 : 3,
      baseColor: [0.8, 0.8, 0.8],
      markerColor: [1, 1, 1],
      glowColor: isDark ? [0.5, 0.5, 0.5] : [0.09, 0.3, 0.52],
      markers: [
        {
          location: [32.0615513, 118.7915619],
          size: 0.1,
        },
      ],
    })

    let animationFrame = 0
    const render = () => {
      globe.update({
        phi: 2.75 + r.get(),
        width: width * 2,
        height: width * 2,
      })
      animationFrame = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      globe.destroy()
    }
  }, [isDark, r])

  return (
    <div className="relative flex h-full min-h-[250px] w-full flex-col overflow-hidden rounded-3xl p-4">
      <div className="relative z-10 flex items-center gap-2">
        <MapPinIcon className="size-5" />
        <h2 className="text-sm font-light">China, Nanjing</h2>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="relative aspect-square w-[80%] max-w-[280px]">
          <div
            className="h-full w-full"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle at 50% 50%, black 60%, transparent 70%)",
              maskImage:
                "radial-gradient(circle at 50% 50%, black 60%, transparent 70%)",
            }}
          >
            <canvas
              ref={canvasRef}
              className="block h-full w-full touch-none"
              onPointerDown={(event) => {
                pointerInteracting.current =
                  event.clientX - pointerMovement.current
              }}
              onPointerMove={(event) => {
                if (pointerInteracting.current !== null) {
                  const delta = event.clientX - pointerInteracting.current

                  pointerMovement.current = delta

                  void api.start({
                    r: delta / 200,
                  })
                }
              }}
              onPointerUp={() => {
                pointerInteracting.current = null
              }}
              onPointerLeave={() => {
                pointerInteracting.current = null
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
