import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata(
  "博客",
  "apulsec 的博客正在建设中，这里计划展示文章和学习记录。"
)

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">博客</h1>
      <p className="mt-4 text-muted-foreground">
        这里将展示我的文章和学习记录。
      </p>
    </main>
  )
}
