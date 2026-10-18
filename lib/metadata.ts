import type { Metadata } from "next"

export function createPageMetadata(
  pageTitle: string,
  description: string
): Metadata {
  const title = `${pageTitle} | apulsec`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "apulsec",
      type: "website",
      locale: "zh_CN",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}
