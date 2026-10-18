"use client"

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { Pause, Play } from "lucide-react"
import { renderToString } from "react-dom/server"

import { Button } from "@/components/ui/button"

interface Icon {
  x: number
  y: number
  z: number
  scale: number
  opacity: number
  id: number
}

interface IconCloudProps {
  icons?: React.ReactNode[]
  images?: string[]
  items?: Array<React.ReactElement | string>
  showControl?: boolean
}

const EMPTY_ITEMS: React.ReactNode[] = []
const ICON_CANVAS_SIZE = 48
const CLOUD_RADIUS = 125
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener("change", onChange)
  return () => mediaQuery.removeEventListener("change", onChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getServerReducedMotionSnapshot() {
  // Keep SSR and hydration consistent; do not animate before reading the preference.
  return true
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function IconCloud({
  icons,
  images,
  items,
  showControl = true,
}: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isManuallyPaused, setIsManuallyPaused] = useState(false)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  )
  const isPaused = prefersReducedMotion || isManuallyPaused
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [targetRotation, setTargetRotation] = useState<{
    x: number
    y: number
    startX: number
    startY: number
    distance: number
    startTime: number
    duration: number
  } | null>(null)
  const animationFrameRef = useRef<number>(0)
  const rotationRef = useRef({ x: 0, y: 0 })
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([])
  const imagesLoadedRef = useRef<boolean[]>([])

  // Create icon canvases once when icons/images change
  useEffect(() => {
    if (!icons && !images && !items) return

    const itemList = items ?? icons ?? images ?? EMPTY_ITEMS
    const loaded = new Array<boolean>(itemList.length).fill(false)
    imagesLoadedRef.current = loaded
    let disposed = false

    const newIconCanvases = itemList.map((item, index) => {
      const offscreen = document.createElement("canvas")
      offscreen.width = ICON_CANVAS_SIZE
      offscreen.height = ICON_CANVAS_SIZE
      const offCtx = offscreen.getContext("2d")

      if (offCtx) {
        if (typeof item === "string") {
          // 处理 public 目录中的 SVG 或其他图片资源。
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            if (disposed) return
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
            offCtx.drawImage(img, 0, 0, ICON_CANVAS_SIZE, ICON_CANVAS_SIZE)

            loaded[index] = true
          }
          img.onerror = () => {
            if (!disposed) loaded[index] = true
          }
          img.src = item
        } else {
          // 将 React SVG 图标转成图片，统一交给 Canvas 绘制。
          const svgString = renderToString(item)
          const img = new Image()
          img.onload = () => {
            if (disposed) return
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
            offCtx.drawImage(img, 0, 0, ICON_CANVAS_SIZE, ICON_CANVAS_SIZE)
            loaded[index] = true
          }
          img.onerror = () => {
            if (!disposed) loaded[index] = true
          }
          img.src = "data:image/svg+xml;base64," + btoa(svgString)
        }
      }
      return offscreen
    })

    iconCanvasesRef.current = newIconCanvases
    return () => {
      disposed = true
    }
  }, [icons, images, items])

  // Positions depend only on item count, not on loaded assets or animation state.
  const numIcons = (items ?? icons ?? images ?? EMPTY_ITEMS).length || 20
  const iconPositions = useMemo(() => {
    const newIcons: Icon[] = []

    // Fibonacci sphere parameters
    const offset = 2 / numIcons
    const increment = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2
      const r = Math.sqrt(1 - y * y)
      const phi = i * increment

      const x = Math.cos(phi) * r
      const z = Math.sin(phi) * r

      newIcons.push({
        x: x * CLOUD_RADIUS,
        y: y * CLOUD_RADIUS,
        z: z * CLOUD_RADIUS,
        scale: 1,
        opacity: 1,
        id: i,
      })
    }
    return newIcons
  }, [numIcons])

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !canvasRef.current) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    iconPositions.forEach((icon) => {
      const cosX = Math.cos(rotationRef.current.x)
      const sinX = Math.sin(rotationRef.current.x)
      const cosY = Math.cos(rotationRef.current.y)
      const sinY = Math.sin(rotationRef.current.y)

      const rotatedX = icon.x * cosY - icon.z * sinY
      const rotatedZ = icon.x * sinY + icon.z * cosY
      const rotatedY = icon.y * cosX + rotatedZ * sinX

      const screenX = canvasRef.current!.width / 2 + rotatedX
      const screenY = canvasRef.current!.height / 2 + rotatedY

      const scale = (rotatedZ + 200) / 300
      const radius = (ICON_CANVAS_SIZE / 2) * scale
      const dx = x - screenX
      const dy = y - screenY

      if (dx * dx + dy * dy < radius * radius) {
        const targetX = -Math.atan2(
          icon.y,
          Math.sqrt(icon.x * icon.x + icon.z * icon.z)
        )
        const targetY = Math.atan2(icon.x, icon.z)

        const currentX = rotationRef.current.x
        const currentY = rotationRef.current.y
        const distance = Math.sqrt(
          Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
        )

        const duration = Math.min(2000, Math.max(800, distance * 1000))

        if (prefersReducedMotion) {
          // Explicit selection is immediate rather than an animated transition.
          rotationRef.current = { x: targetX, y: targetY }
          setTargetRotation(null)
          return
        }

        setTargetRotation({
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          distance,
          startTime: performance.now(),
          duration,
        })
        return
      }
    })

    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePos({ x, y })
    }

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y

      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      }

      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
        const dx = mousePos.x - centerX
        const dy = mousePos.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const speed = 0.003 + (distance / maxDistance) * 0.01

        if (targetRotation && !isPaused) {
          const elapsed = performance.now() - targetRotation.startTime
          const progress = Math.min(1, elapsed / targetRotation.duration)
          const easedProgress = easeOutCubic(progress)

          rotationRef.current = {
            x:
              targetRotation.startX +
              (targetRotation.x - targetRotation.startX) * easedProgress,
            y:
              targetRotation.startY +
              (targetRotation.y - targetRotation.startY) * easedProgress,
          }

          if (progress >= 1) {
            setTargetRotation(null)
          }
        } else if (!isDragging && !isPaused) {
          rotationRef.current = {
            x: rotationRef.current.x + (dy / canvas.height) * speed,
            y: rotationRef.current.y + (dx / canvas.width) * speed,
          }
        }

        iconPositions.forEach((icon, index) => {
          const cosX = Math.cos(rotationRef.current.x)
          const sinX = Math.sin(rotationRef.current.x)
          const cosY = Math.cos(rotationRef.current.y)
          const sinY = Math.sin(rotationRef.current.y)

          const rotatedX = icon.x * cosY - icon.z * sinY
          const rotatedZ = icon.x * sinY + icon.z * cosY
          const rotatedY = icon.y * cosX + rotatedZ * sinX

          const scale = (rotatedZ + 200) / 300
          const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200))

          ctx.save()
          ctx.translate(
            canvas.width / 2 + rotatedX,
            canvas.height / 2 + rotatedY
          )
          ctx.scale(scale, scale)
          ctx.globalAlpha = opacity

          if (icons || images || items) {
            // Only try to render icons/images if they exist
            if (
              iconCanvasesRef.current[index] &&
              imagesLoadedRef.current[index]
            ) {
              ctx.drawImage(
                iconCanvasesRef.current[index],
                -ICON_CANVAS_SIZE / 2,
                -ICON_CANVAS_SIZE / 2,
                ICON_CANVAS_SIZE,
                ICON_CANVAS_SIZE
              )
            }
          } else {
            // Show numbered circles if no icons/images are provided
            ctx.beginPath()
            ctx.arc(0, 0, 20, 0, Math.PI * 2)
            ctx.fillStyle = "#4444ff"
            ctx.fill()
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.font = "16px Arial"
            ctx.fillText(`${icon.id + 1}`, 0, 0)
          }

          ctx.restore()
        })

        const hasPendingAssets =
          Boolean(icons || images || items) &&
          !imagesLoadedRef.current.every((loaded) => loaded)
        const shouldContinue = !isPaused || isDragging || hasPendingAssets

        if (shouldContinue) {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }

      animate()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    icons,
    images,
    items,
    iconPositions,
    isDragging,
    isPaused,
    mousePos,
    targetRotation,
  ])

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="rounded-lg"
        aria-label="Interactive 3D Icon Cloud"
        role="img"
      />
      {showControl && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsManuallyPaused((paused) => !paused)}
          disabled={prefersReducedMotion}
          aria-label={
            prefersReducedMotion
              ? "Animation paused: reduced motion enabled"
              : isPaused
                ? "Play Animation"
                : "Pause Animation"
          }
          title={
            prefersReducedMotion
              ? "Animation paused: reduced motion enabled"
              : undefined
          }
          className="absolute top-2 right-2"
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </Button>
      )}
    </div>
  )
}
