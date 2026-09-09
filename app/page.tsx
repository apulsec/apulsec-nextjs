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
      <section className="mx-auto grid max-w-[375px] grid-cols-2 gap-6 [grid-template-areas:'a_a'_'a_a'_'b_d'_'e_c'_'h_h'_'f_g'_'l_l'] sm:max-w-screen-sm sm:grid-cols-3 sm:[grid-template-areas:'a_a_b'_'a_a_l'_'c_d_d'_'e_f_g'_'h_h_h'] xl:max-w-screen-xl xl:grid-cols-4 xl:[grid-template-areas:'a_a_b_l'_'c_d_d_e'_'f_g_g_h']">
        <article
          className={`${cardClass} flex min-h-[240px] flex-col justify-between p-6 [grid-area:a] sm:min-h-[270px] xl:min-h-[300px]`}
        >
          <div>
            {/* <div className="mb-6 flex items-center justify-between gap-4">
              <span className="text-xs font-medium tracking-[0.24em] text-primary uppercase">
                Personal space
              </span>
              <div className="rounded-full border border-border/60 bg-background/35 p-2.5">
                <Sparkles className="size-4 text-primary" />
              </div>
            </div> */}

            <TypingAnimation
              as="h1"
              delay={250}
              duration={110}
              className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Light years.🍭
            </TypingAnimation>
            <p className="mt-4 max-w-xl text-xs leading-7 text-muted-foreground sm:text-sm">
              🎓 A Grade 2022 CS Student in SEU. Currently pursuing a
              master&apos;s degree at SEU.
              <br />
              ⚡ Interested in signal processing and
              front-end development.
              <br />
              🎮 I am a hardcore anime fan, and I also enjoy playing all kinds
              of games.
              <br />
              🔭 I am learning everything I find interesting.
            </p>
          </div>

          {/* <div className="flex flex-wrap gap-2">
            <span className={tagClass}>Next.js</span>
            <span className={tagClass}>React</span>
            <span className={tagClass}>UI Design</span>
          </div> */}
        </article>

        <article
          className={`${cardClass} min-h-[250px] [grid-area:b] sm:min-h-[270px] xl:min-h-[300px]`}
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
          className={`${cardClass} flex aspect-square min-h-0 items-center justify-center p-0 [grid-area:e]`}
        >
          <CalendarCard />
        </article>

        <article
          className={`${cardClass} flex aspect-square min-h-[160px] flex-col justify-between p-5 [grid-area:c]`}
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
          className={`${cardClass} flex aspect-square min-h-[160px] flex-col justify-between p-5 [grid-area:f]`}
        >
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div className="origin-center scale-[0.46] [&_canvas]:brightness-0 dark:[&_canvas]:invert sm:scale-[0.54] xl:scale-[0.75]">
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
          className={`${cardClass} flex aspect-square min-h-[160px] flex-col justify-between p-5 [grid-area:g] xl:aspect-auto`}
        >
          <GitHubHeatmap />
        </article>

        <article
          className={`${cardClass} relative flex min-h-[200px] items-end p-6 [grid-area:h]`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,oklch(0.95_0.08_230_/_0.8),transparent_35%),linear-gradient(135deg,transparent_30%,oklch(0.55_0.12_240_/_0.18))] dark:bg-[radial-gradient(circle_at_25%_20%,oklch(0.55_0.12_240_/_0.25),transparent_35%),linear-gradient(135deg,transparent_30%,oklch(0.35_0.12_240_/_0.3))]" />
          <div className="relative max-w-lg">
            <p className="text-xs tracking-[0.24em] text-primary uppercase">
              Digital garden
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              保持好奇，持续创造。
            </p>
          </div>
        </article>

        <article
          className={`${cardClass} flex aspect-square min-h-[160px] flex-col p-5 [grid-area:l] xl:aspect-auto xl:min-h-[300px]`}
        >
          <PixelImageCarousel />
        </article>
      </section>
    </div>
  )
}
