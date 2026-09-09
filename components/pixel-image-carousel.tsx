"use client"

import { useState } from "react"

import { PixelImage } from "@/components/ui/pixel-image"

const images = [
  { label: "PyTorch", src: "/icons/pytorch.svg" },
  { label: "MATLAB", src: "/icons/matlab.svg" },
]

export function PixelImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  const showNextImage = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % images.length)
  }

  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
      <div className="size-[min(14rem,100%)]">
        <div
          role="button"
          tabIndex={0}
          aria-label={`切换到下一张图片（当前：${activeImage.label}）`}
          className="h-full w-full cursor-pointer rounded-[2.5rem] transition-transform duration-300 ease-out hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
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

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/50 bg-background/60 px-2 py-1 backdrop-blur-sm">
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
  )
}
