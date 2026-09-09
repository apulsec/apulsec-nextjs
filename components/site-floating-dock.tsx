"use client"

import {
  IconArticle,
  IconHome,
  IconMoon,
  IconSun,
  IconUser,
} from "@tabler/icons-react"
import { useTheme } from "@/components/theme-provider"
import { FloatingDock } from "@/components/ui/floating-dock"

const navigationItems = [
  {
    title: "Home",
    icon: <IconHome className="h-full w-full" />,
    href: "/",
  },
  {
    title: "Blog",
    icon: <IconArticle className="h-full w-full" />,
    href: "/blog",
  },
  {
    title: "About",
    icon: <IconUser className="h-full w-full" />,
    href: "/about",
  },
]

const themeInverseGlow =
  "border border-black/35 shadow-[0_0_14px_rgb(0_0_0_/_0.22)] transition-[background-color,border-color,box-shadow,transform] duration-300 dark:border-white/50 dark:shadow-[0_0_14px_rgb(255_255_255_/_0.28)]"

export function SiteFloatingDock() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <FloatingDock
      items={navigationItems}
      endAction={{
        title: isDark ? "Light model" : "Dark model",
        icon: isDark ? (
          <IconSun className="h-full w-full" />
        ) : (
          <IconMoon className="h-full w-full" />
        ),
        onClick: () => setTheme(isDark ? "light" : "dark"),
      }}
      desktopClassName={`${themeInverseGlow} fixed bottom-6 left-1/2 z-50 -translate-x-1/2`}
      mobileClassName={`${themeInverseGlow} fixed right-6 bottom-6 z-50`}
    />
  )
}
