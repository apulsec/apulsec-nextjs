import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteFloatingDock } from "@/components/site-floating-dock"
import { NoiseTexture } from "@/components/ui/noise-texture"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

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
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <NoiseTexture
            aria-hidden="true"
            className="fixed inset-0 z-0 opacity-[0.5] dark:opacity-[0.5]"
            frequency={0.8}
            octaves={4}
            slope={0.3}
            noiseOpacity={1}
          />
          <div className="relative z-10 pb-0">{children}</div>
          <SiteFloatingDock />
        </ThemeProvider>
      </body>
    </html>
  )
}
