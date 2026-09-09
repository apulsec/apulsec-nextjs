"use client"

import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type Grid = {
  rows: number
  cols: number
}

const DEFAULT_GRIDS: Record<string, Grid> = {
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
}

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS

function getStableDelay(seed: string, index: number, maxDelay: number) {
  let hash = 2166136261
  const value = `${seed}:${index}`

  for (let characterIndex = 0; characterIndex < value.length; characterIndex++) {
    hash ^= value.charCodeAt(characterIndex)
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) / 0xffffffff) * maxDelay
}

interface PixelImageProps {
  src: string
  className?: string
  grid?: PredefinedGridKey
  customGrid?: Grid
  grayscaleAnimation?: boolean
  pixelFadeInDuration?: number // in ms
  maxAnimationDelay?: number // in ms
  colorRevealDelay?: number // in ms
}

export const PixelImage = ({
  src,
  className,
  grid = "6x4",
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid,
}: PixelImageProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showColor, setShowColor] = useState(false)

  const MIN_GRID = 1
  const MAX_GRID = 16

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (grid?: Grid) => {
      if (!grid) return false
      const { rows, cols } = grid
      return (
        Number.isInteger(rows) &&
        Number.isInteger(cols) &&
        rows >= MIN_GRID &&
        cols >= MIN_GRID &&
        rows <= MAX_GRID &&
        cols <= MAX_GRID
      )
    }

    return isValidGrid(customGrid) ? customGrid! : DEFAULT_GRIDS[grid]
  }, [customGrid, grid])

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsVisible(true)
    })
    const colorTimeout = setTimeout(() => {
      setShowColor(true)
    }, colorRevealDelay)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(colorTimeout)
    }
  }, [colorRevealDelay])

  const pieces = useMemo(() => {
    const total = rows * cols
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols

      const clipPath = `polygon(${col * (100 / cols)}% ${row * (100 / rows)}%, ${(col + 1) * (100 / cols)}% ${row * (100 / rows)}%, ${(col + 1) * (100 / cols)}% ${(row + 1) * (100 / rows)}%, ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%)`

      const delay = getStableDelay(src, index, maxAnimationDelay)
      return {
        clipPath,
        delay,
      }
    })
  }, [rows, cols, maxAnimationDelay, src])

  return (
    <div
      className={cn(
        "relative h-72 w-72 select-none md:h-96 md:w-96",
        className
      )}
    >
      {pieces.map((piece, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${piece.delay}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
          }}
        >
          <img
            src={src}
            alt={`Pixel image piece ${index + 1}`}
            className={cn(
              "z-1 rounded-[2.5rem] object-cover",
              grayscaleAnimation && (showColor ? "grayscale-0" : "grayscale")
            )}
            style={{
              transition: grayscaleAnimation
                ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}
