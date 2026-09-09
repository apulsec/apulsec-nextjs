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

  const dateText = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now)

  const timeText = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now)

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-3 py-4 text-center">
      {/* <div className="pointer-events-none absolute -top-12 left-1/2 size-36 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" /> */}

      <div className="relative w-full">
        {/* 使用浏览器本地时间，每秒刷新一次。 */}
        <p className="text-[1.5rem] font-black tracking-[0.3em] text-primary uppercase">
          Today
        </p>
        <time
          dateTime={now.toISOString()}
          suppressHydrationWarning
          className="mt-4 block text-base leading-4 font-bold text-muted-foreground"
        >
          {dateText}
        </time>
        <div className="mx-auto my-6 h-1 w-full max-w-48 bg-border/70" />
        <time
          dateTime={now.toISOString()}
          suppressHydrationWarning
          className="block font-mono text-3xl font-semibold tracking-tight text-primary sm:text-4xl"
        >
          {timeText}
        </time>
      </div>
    </div>
  )
}
