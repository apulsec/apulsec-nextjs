import Link from "next/link"
import {
  IconBrandCpp,
  IconBrandDocker,
  IconBrandGit,
  IconBrandNextjs,
  IconBrandOpenai,
  IconBrandPython,
  IconBrandReact,
  IconBrandUbuntu,
  IconBrandVscode,
  IconFileTypeJs,
  IconFileTypeTs,
  IconMarkdown,
} from "@tabler/icons-react"
import { ArrowUpRight, BookOpenText, Layers3 } from "lucide-react"

import CalendarCard from "@/components/calendar-card"
import { GitHubHeatmap } from "@/components/github-heatmap"
import LocationGlobe from "@/components/location-globe"
import { PixelImageCarousel } from "@/components/pixel-image-carousel"
import { IconCloud } from "@/components/ui/icon-cloud"
import { TypingAnimation } from "@/components/ui/typing-animation"

const cardClass =
  "relative overflow-hidden rounded-3xl border border-border/60 bg-secondary/35 shadow-[0_18px_60px_rgb(23_77_132_/_0.08)] backdrop-blur-xl"

export default function Page() {
  return (
    <div className="relative isolate min-h-svh overflow-hidden px-5 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-secondary/60 blur-3xl" />
      </div>

      {/* 响应式 Bento 网格：通过命名区域控制每个模块的位置。 */}
      <section className="mx-auto grid max-w-[375px] grid-cols-2 gap-6 [grid-template-areas:'a_a'_'a_a'_'b_l'_'c_e'_'f_h'_'d_d'_'g_g'] sm:max-w-screen-sm sm:grid-cols-3 sm:[grid-template-areas:'a_a_b'_'a_a_l'_'c_d_d'_'e_g_g'_'f_h_h'] xl:max-w-screen-xl xl:grid-cols-4 xl:[grid-template-areas:'a_a_b_l'_'c_d_d_e'_'f_g_g_h']">
        <article
          className={`${cardClass} flex min-h-[240px] flex-col justify-between p-6 [grid-area:a] sm:min-h-[270px] xl:h-[300px] xl:min-h-0 xl:self-start`}
        >
          <div className="flex h-full min-h-0 flex-col justify-between gap-6 sm:gap-8">
            <div className="flex flex-col">
              <TypingAnimation
                as="h1"
                delay={250}
                duration={110}
                className="max-w-xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
              >
                Light years.🍭
              </TypingAnimation>
              <TypingAnimation
                as="p"
                delay={1800}
                duration={110}
                className="mt-2 max-w-xl text-xl leading-tight font-semibold tracking-tight sm:text-2xl xl:text-3xl"
              >
                A pulse corner on the internet.
              </TypingAnimation>
            </div>
            <p className="relative -top-4 max-w-xl space-y-1 text-xs leading-7 text-muted-foreground sm:text-sm">
              <span className="flex">
                <span className="w-6 shrink-0" aria-hidden="true">
                  🎓
                </span>
                <span>
                  A 2026 SEU Computer Science and Technology undergraduate,
                  currently pursuing an AI Master&apos;s degree at SEU.
                </span>
              </span>
              <span className="flex">
                <span className="w-6 shrink-0" aria-hidden="true">
                  ✨
                </span>
                <span>
                  Interested in signal processing and front-end development.
                </span>
              </span>
              <span className="flex">
                <span className="w-6 shrink-0" aria-hidden="true">
                  💗
                </span>
                <span>
                  I enjoy Japanese anime, music, and Steam and Switch games.
                </span>
              </span>
              <span className="flex">
                <span className="w-6 shrink-0" aria-hidden="true">
                  🔆
                </span>
                <span>Try my best to love life and the world.</span>
              </span>
            </p>
          </div>

          {/* <div className="flex flex-wrap gap-2">
            <span className={tagClass}>Next.js</span>
            <span className={tagClass}>React</span>
            <span className={tagClass}>UI Design</span>
          </div> */}
        </article>

        <article
          className={`${cardClass} aspect-square min-h-0 [grid-area:b] sm:aspect-square sm:h-auto sm:min-h-0 sm:self-start xl:aspect-auto xl:h-[300px] xl:min-h-0`}
        >
          <LocationGlobe />
        </article>

        <article
          className={`${cardClass} flex min-h-[180px] flex-col justify-between p-5 [grid-area:d]`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BookOpenText className="size-4 text-primary" />
              最新文章
            </div>
            <span className="text-xs text-muted-foreground">Blog</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              从一个模板开始，慢慢搭建自己的数字花园
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              把学习记录、实践经验和想法整理成可以持续维护的个人网站。
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/70"
          >
            浏览文章
            <ArrowUpRight className="size-4" />
          </Link>
        </article>

        <article
          className={`${cardClass} flex aspect-square min-h-0 items-center justify-center p-0 [grid-area:e] sm:self-start`}
        >
          <CalendarCard />
        </article>

        <article
          className={`${cardClass} flex aspect-square min-h-0 flex-col justify-between p-5 [grid-area:c] sm:self-start`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <Layers3 className="size-4 text-primary" />
            正在构建
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span>个人博客</span>
              <span className="text-primary">进行中</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span>文章系统</span>
              <span>下一步</span>
            </div>
            <div className="flex items-center justify-between">
              <span>视觉设计</span>
              <span>持续迭代</span>
            </div>
          </div>
        </article>

        <article
          className={`${cardClass} flex aspect-square min-h-0 flex-col justify-between p-5 [grid-area:f] sm:self-start`}
        >
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div className="origin-center scale-[0.46] sm:scale-[0.54] xl:scale-[0.75] [&_canvas]:brightness-0 dark:[&_canvas]:invert">
              <IconCloud
                showControl={false}
                items={[
                  <IconBrandPython key="python" color="#000000" size={80} />,
                  "/icons/pytorch.svg",
                  <IconBrandNextjs key="nextjs" color="#000000" size={80} />,
                  <IconFileTypeJs key="javascript" color="#000000" size={80} />,
                  <IconFileTypeTs key="typescript" color="#000000" size={80} />,
                  <IconBrandCpp key="cpp" color="#000000" size={80} />,
                  <IconBrandGit key="git" color="#000000" size={80} />,
                  <IconBrandDocker key="docker" color="#000000" size={80} />,
                  <IconBrandOpenai key="gpt" color="#000000" size={80} />,
                  <IconBrandReact key="react" color="#000000" size={80} />,
                  "/icons/matlab.svg",
                  <IconBrandVscode key="vscode" color="#000000" size={80} />,
                  <IconBrandUbuntu key="linux" color="#000000" size={80} />,
                  <IconMarkdown key="markdown" color="#000000" size={80} />,
                ]}
              />
            </div>
          </div>
        </article>

        <article
          className={`${cardClass} flex aspect-[2/1] min-h-0 flex-col justify-between p-4 [grid-area:g] sm:aspect-[2.125/1] sm:self-start sm:p-4 xl:aspect-auto xl:min-h-0 xl:self-stretch xl:p-5`}
        >
          <GitHubHeatmap />
        </article>

        <article
          className={`${cardClass} relative flex aspect-square min-h-0 items-end p-4 [grid-area:h] sm:aspect-auto sm:min-h-0 sm:p-6 xl:aspect-auto xl:min-h-[200px]`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,oklch(0.95_0.08_230_/_0.8),transparent_35%),linear-gradient(135deg,transparent_30%,oklch(0.55_0.12_240_/_0.18))] dark:bg-[radial-gradient(circle_at_25%_20%,oklch(0.55_0.12_240_/_0.25),transparent_35%),linear-gradient(135deg,transparent_30%,oklch(0.35_0.12_240_/_0.3))]" />
          <div className="relative max-w-lg">
            <p className="text-xs tracking-[0.24em] text-primary uppercase">
              Digital garden
            </p>
            <p className="mt-3 text-xl leading-tight font-medium tracking-tight sm:text-3xl">
              保持好奇，持续创造。
            </p>
          </div>
        </article>

        <article
          className={`relative flex aspect-square min-h-0 flex-col p-0 [grid-area:l] sm:aspect-square sm:min-h-0 sm:self-start xl:aspect-auto xl:h-[300px] xl:min-h-0`}
        >
          <PixelImageCarousel />
        </article>
      </section>
    </div>
  )
}
