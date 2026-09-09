import { MapPinIcon } from "lucide-react"

import { Globe } from "@/components/ui/globe"

export default function LocationGlobe() {
  return (
    <div className="relative flex h-full min-h-[250px] w-full flex-col overflow-hidden rounded-3xl p-4">
      <div className="relative z-10 flex items-center gap-2">
        <MapPinIcon className="size-8" />
        <h2 className="text-sm font-bold">Nanjing, China</h2>
      </div>

      {/* 用相对定位覆盖 Globe 默认的 absolute，让地球在卡片剩余空间中居中。 */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <Globe className="relative inset-auto mx-auto aspect-square w-[92%] max-w-[320px]" />
      </div>
    </div>
  )
}
