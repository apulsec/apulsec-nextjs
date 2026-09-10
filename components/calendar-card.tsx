"use client"

import { useEffect, useState } from "react"

export default function CalendarCard() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const weekdayText = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(now)
  const monthText = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(now)
  const dayText = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
  }).format(now)
  const yearText = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
  }).format(now)

  const timeText = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now)

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-3 py-4 text-center xl:px-5 xl:py-5">
      {/* <div className="pointer-events-none absolute -top-12 left-1/2 size-36 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" /> */}

      <div className="relative flex w-full flex-col items-center">
        {/* 使用浏览器本地时间，每秒刷新一次。 */}
        <p className="text-[0.65rem] font-bold tracking-[0.24em] text-primary uppercase xl:text-sm xl:tracking-[0.3em]">
          Today
        </p>
        <time
          dateTime={now.toISOString()}
          suppressHydrationWarning
          className="mt-2 flex items-baseline justify-center gap-1.5 whitespace-nowrap text-muted-foreground xl:mt-3 xl:gap-2"
        >
          <span className="text-base font-semibold xl:text-xl">
            {monthText}
          </span>
          <span className="text-3xl leading-none font-black tracking-tight text-foreground xl:text-5xl">
            {dayText}
          </span>
        </time>
        <p className="mt-1 text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase xl:mt-2 xl:text-xs xl:tracking-[0.2em]">
          {weekdayText} · {yearText}
        </p>
        <div className="my-3 h-px w-12 bg-border/70 xl:my-5 xl:w-16" />
        <time
          dateTime={now.toISOString()}
          suppressHydrationWarning
          className="block font-mono text-2xl font-semibold tracking-tight text-primary sm:text-3xl xl:text-4xl"
        >
          {timeText}
        </time>
      </div>
    </div>
  )
}
