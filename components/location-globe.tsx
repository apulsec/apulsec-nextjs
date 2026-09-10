"use client"

import { useMemo } from "react"
import { MapPinIcon } from "lucide-react"
import type { COBEOptions } from "cobe"
import { Globe } from "@/components/ui/globe"
import { useTheme } from "@/components/theme-provider"

export default function LocationGlobe() {
  const { resolvedTheme } = useTheme()
  const globeConfig = useMemo<COBEOptions>(() => {
    const isDarkMode = resolvedTheme === "dark"

    return {
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.3,
      // Cobe 的 dark 参数会翻转地图纹理像素与地球底色的明暗关系。
      dark: isDarkMode ? 1 : 0,
      diffuse: 0.4,
      mapSamples: 4000,
      mapBrightness: 2,
      mapBaseBrightness: 0,
      // 保持白色基础色，由 dark 参数控制地图像素的黑白反转。
      baseColor: [1, 1, 1],
      // 南京经纬度标记不参与翻转，始终保持蓝色。
      markerColor: [0.12, 0.48, 1],
      // 外边缘在两种主题下都使用淡蓝色。
      glowColor: [0.25, 0.42, 0.6],
      markers: [
        {
          location: [32.0615513, 118.7915619],
          size: 0.2,
        },
      ],
    }
  }, [resolvedTheme])

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-3xl p-3 xl:p-4">
      <div className="relative z-10 flex shrink-0 items-center gap-1.5 xl:gap-2">
        <MapPinIcon className="size-4 sm:size-5 xl:size-6" />
        <h2 className="text-sm font-bold xl:text-base">Nanjing, China</h2>
      </div>

      {/* 用相对定位覆盖 Globe 默认的 absolute，让地球在卡片剩余空间中居中。 */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <Globe
          className="relative inset-auto mx-auto aspect-square !h-full max-h-full !w-auto max-w-full"
          config={globeConfig}
        />
      </div>
    </div>
  )
}
