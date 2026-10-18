import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteFloatingDock } from "@/components/site-floating-dock"
import { cn } from "@/lib/utils"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata(
  "个人网站",
  "apulsec 的个人网站，记录学习、实践与想法，探索信号处理和前端开发。"
)

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <div className="pb-0">{children}</div>
          <div lang="en">
            <SiteFloatingDock />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
