"use client"

import {
  IconArticle,
  IconHome,
  IconUser,
} from "@tabler/icons-react"

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

export function SiteFloatingDock() {
  return (
    <FloatingDock
      items={navigationItems}
      desktopClassName="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      mobileClassName="fixed right-6 bottom-6 z-50"
    />
  )
}
