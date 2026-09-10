"use client"

import { useEffect, useState } from "react"

import { PixelImage } from "@/components/ui/pixel-image"

const images = [
  { label: "蓝发动漫角色", src: "/images/homepage/anime-blue.png" },
  { label: "白发动漫角色", src: "/images/homepage/anime-white.png" },
  { label: "金发动漫角色", src: "/images/homepage/anime-blonde.jpg" },
]

const visualCardClass =
  "relative overflow-hidden rounded-3xl border border-border/60 bg-secondary/35 shadow-[0_18px_60px_rgb(23_77_132_/_0.08)] backdrop-blur-xl"

export function PixelImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  const showNextImage = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % images.length)
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length)
    }, 10000)

    return () => window.clearInterval(interval)
  }, [activeIndex])

  return (
    <div className="relative flex size-full min-h-0 items-center justify-center">
      <div className="group absolute inset-0 transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.02]">
        <div className={`${visualCardClass} size-full`}>
          <div className="size-full">
            <div
              role="button"
              tabIndex={0}
              aria-label={`切换到下一张图片（当前：${activeImage.label}）`}
              className="h-full w-full cursor-pointer rounded-3xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-offset-2"
              onClick={showNextImage}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  showNextImage()
                }
              }}
            >
              <PixelImage
                key={activeImage.src}
                src={activeImage.src}
                grid="8x8"
                className="!size-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center">
        <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/60 px-2 py-1">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`显示${image.label}图片`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className={`size-1.5 rounded-full transition-colors ${
                index === activeIndex
                  ? "bg-primary"
                  : "bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
