"use client"

import { useEffect, useRef, useState } from "react"

type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE"

type ContributionDay = {
  date: string
  contributionCount: number
  contributionLevel: ContributionLevel
}

type ContributionWeek = {
  contributionDays: ContributionDay[]
}

type HeatmapData = {
  profileUrl: string
  totalContributions: number
  username: string
  weeks: ContributionWeek[]
}

const EMPTY_WEEKS: ContributionWeek[] = Array.from({ length: 19 }, () => ({
  contributionDays: Array.from({ length: 7 }, () => ({
    contributionCount: 0,
    contributionLevel: "NONE" as const,
    date: "",
  })),
}))

const DEFAULT_VISIBLE_WEEKS = 19
const MIN_VISIBLE_WEEKS = 8
const TARGET_CELL_SIZE = 12
const CELL_GAP = 4

const LEVEL_CLASSES: Record<ContributionLevel, string> = {
  NONE: "bg-secondary/55",
  FIRST_QUARTILE: "bg-primary/25",
  SECOND_QUARTILE: "bg-primary/45",
  THIRD_QUARTILE: "bg-primary/70",
  FOURTH_QUARTILE: "bg-primary",
}

function getWeekDays(week: ContributionWeek) {
  const days: Array<ContributionDay | undefined> = Array(7).fill(undefined)

  for (const day of week.contributionDays) {
    const dayIndex = new Date(`${day.date}T00:00:00Z`).getUTCDay()
    days[dayIndex] = day
  }

  return days
}

function formatContributionCount(count: number) {
  return `${count} ${count === 1 ? "contribution" : "contributions"}`
}

export function GitHubHeatmap() {
  const [data, setData] = useState<HeatmapData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [visibleWeekCount, setVisibleWeekCount] = useState(
    DEFAULT_VISIBLE_WEEKS
  )
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/github/contributions")
      .then(async (response) => {
        const payload = (await response.json()) as HeatmapData & {
          error?: string
        }

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load GitHub data.")
        }

        return payload
      })
      .then((payload) => {
        if (!cancelled) setData(payload)
      })
      .catch((requestError: Error) => {
        if (!cancelled) setError(requestError.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    const updateVisibleWeekCount = () => {
      const width = chart.clientWidth
      if (!width) return

      const nextCount = Math.max(
        MIN_VISIBLE_WEEKS,
        Math.floor((width + CELL_GAP) / (TARGET_CELL_SIZE + CELL_GAP))
      )

      setVisibleWeekCount((currentCount) =>
        currentCount === nextCount ? currentCount : nextCount
      )
    }

    updateVisibleWeekCount()
    const observer = new ResizeObserver(updateVisibleWeekCount)
    observer.observe(chart)

    return () => observer.disconnect()
  }, [])

  const weeks = data?.weeks ?? EMPTY_WEEKS
  const visibleWeeks = weeks.slice(-Math.min(visibleWeekCount, weeks.length))
  const gridStyle = {
    gridTemplateColumns: `repeat(${visibleWeeks.length}, minmax(0, 1fr))`,
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
      <div
        ref={chartRef}
        className="flex min-w-0 flex-1 items-center xl:-translate-y-3"
      >
        <div
          className="grid w-full grid-flow-col grid-rows-7 gap-1"
          style={gridStyle}
          aria-label="GitHub contribution calendar"
        >
          {visibleWeeks.flatMap((week, weekIndex) => {
            const days = getWeekDays(week)

            return days.map((day, dayIndex) => {
              const label = day?.date
                ? `${day.date}: ${formatContributionCount(day.contributionCount)}`
                : "No contribution data"

              return (
                <span
                  key={`${weekIndex}-${dayIndex}`}
                  title={label}
                  aria-label={label}
                  className={`aspect-square min-w-0 rounded-[3px] border border-border/90 ${
                    LEVEL_CLASSES[day?.contributionLevel ?? "NONE"]
                  }`}
                />
              )
            })
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[0.65rem] text-muted-foreground">
        {error ? (
          <span className="truncate" title={error}>
            配置 GitHub 后显示真实提交
          </span>
        ) : data ? (
          <span>{formatContributionCount(data.totalContributions)}</span>
        ) : (
          <span>设置账号后加载</span>
        )}

        <div className="flex shrink-0 items-center gap-0.5" aria-hidden="true">
          {(
            [
              "NONE",
              "FIRST_QUARTILE",
              "SECOND_QUARTILE",
              "THIRD_QUARTILE",
              "FOURTH_QUARTILE",
            ] as ContributionLevel[]
          ).map((level) => (
            <span
              key={level}
              className={`size-2.5 rounded-[2px] border border-border/90 ${LEVEL_CLASSES[level]}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
