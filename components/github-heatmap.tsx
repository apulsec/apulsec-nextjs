"use client"

import { useEffect, useState } from "react"

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

  const weeks = data?.weeks ?? EMPTY_WEEKS
  const gridStyle = {
    gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
      <div className="min-w-0">
        <div
          className="grid w-[calc(100%/0.95)] origin-top-left -translate-y-1 scale-[0.95] grid-flow-col grid-rows-7 gap-1 sm:gap-2"
          style={gridStyle}
          aria-label="GitHub contribution calendar"
        >
          {weeks.flatMap((week, weekIndex) => {
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
                  className={`aspect-square min-w-0 rounded-[6px] border border-border/90 ${
                    LEVEL_CLASSES[day?.contributionLevel ?? "NONE"]
                  }`}
                />
              )
            })
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-[16px] text-muted-foreground">
        {error ? (
          <span className="truncate" title={error}>
            配置 GitHub 后显示真实提交
          </span>
        ) : data ? (
          <span>{formatContributionCount(data.totalContributions)}</span>
        ) : (
          <span>设置账号后加载</span>
        )}

        <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
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
              className={`size-4 rounded-[6px] border border-border/90 ${LEVEL_CLASSES[level]}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
