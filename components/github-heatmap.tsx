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

const EMPTY_WEEKS: ContributionWeek[] = Array.from({ length: 26 }, () => ({
  contributionDays: Array.from({ length: 7 }, () => ({
    contributionCount: 0,
    contributionLevel: "NONE" as const,
    date: "",
  })),
}))

const CELL_GAP = 4
const GRID_ROW_COUNT = 7

const LEVEL_CLASSES: Record<ContributionLevel, string> = {
  NONE: "bg-secondary/55",
  FIRST_QUARTILE: "bg-primary/25",
  SECOND_QUARTILE: "bg-primary/45",
  THIRD_QUARTILE: "bg-primary/70",
  FOURTH_QUARTILE: "bg-primary",
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getMondayDateKey(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`)
  const daysFromMonday = (date.getUTCDay() + 6) % 7

  date.setUTCDate(date.getUTCDate() - daysFromMonday)

  return date.toISOString().slice(0, 10)
}

function normalizeWeeks(weeks: ContributionWeek[]) {
  const daysByWeek = new Map<string, ContributionDay[]>()

  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (!day.date) continue

      const mondayDateKey = getMondayDateKey(day.date)
      const days = daysByWeek.get(mondayDateKey) ?? []
      days.push(day)
      daysByWeek.set(mondayDateKey, days)
    }
  }

  if (daysByWeek.size === 0) return weeks

  return [...daysByWeek.entries()]
    .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
    .map(([, contributionDays]) => ({ contributionDays }))
}

function getWeekDays(week: ContributionWeek) {
  const days: Array<ContributionDay | undefined> = Array(7).fill(undefined)

  for (const day of week.contributionDays) {
    const dayIndex = (new Date(`${day.date}T00:00:00Z`).getUTCDay() + 6) % 7
    days[dayIndex] = day
  }

  return days
}

function formatContributionCount(count: number) {
  return `${count} ${count === 1 ? "contribution" : "contributions"}`
}

function getVisibleWeekCount(width: number, height: number, weekCount: number) {
  const maxCellHeight =
    (height - CELL_GAP * (GRID_ROW_COUNT - 1)) / GRID_ROW_COUNT

  if (maxCellHeight <= 0) return weekCount

  const weeksThatFit = Math.floor(
    (width + CELL_GAP) / (maxCellHeight + CELL_GAP)
  )

  return Math.max(1, Math.min(weekCount, weeksThatFit))
}

export function GitHubHeatmap() {
  const [data, setData] = useState<HeatmapData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [visibleWeekCount, setVisibleWeekCount] = useState(0)
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 })
  const chartRef = useRef<HTMLDivElement>(null)
  const weeks = normalizeWeeks(data?.weeks ?? EMPTY_WEEKS)
  const weekCount = weeks.length

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
      const height = chart.clientHeight
      if (!width || !height) return

      setChartSize((currentSize) =>
        currentSize.width === width && currentSize.height === height
          ? currentSize
          : { width, height }
      )

      const nextCount = getVisibleWeekCount(width, height, weekCount)

      setVisibleWeekCount((currentCount) =>
        currentCount === nextCount ? currentCount : nextCount
      )
    }

    updateVisibleWeekCount()
    const observer = new ResizeObserver(updateVisibleWeekCount)
    observer.observe(chart)

    return () => observer.disconnect()
  }, [weekCount])

  const visibleWeeks = weeks.slice(-Math.min(visibleWeekCount, weeks.length))
  const todayKey = getLocalDateKey(new Date())
  const maxCellWidth =
    chartSize.width > 0
      ? (chartSize.width - CELL_GAP * (visibleWeeks.length - 1)) /
        visibleWeeks.length
      : 0
  const maxCellHeight =
    chartSize.height > 0
      ? (chartSize.height - CELL_GAP * (GRID_ROW_COUNT - 1)) / GRID_ROW_COUNT
      : 0
  const cellSize = Math.max(0, Math.min(maxCellWidth, maxCellHeight))
  const gridWidth =
    cellSize > 0
      ? cellSize * visibleWeeks.length + CELL_GAP * (visibleWeeks.length - 1)
      : undefined
  const gridHeight =
    cellSize > 0
      ? cellSize * GRID_ROW_COUNT + CELL_GAP * (GRID_ROW_COUNT - 1)
      : undefined
  const gridStyle = {
    gridTemplateColumns: `repeat(${visibleWeeks.length}, minmax(0, 1fr))`,
    ...(gridHeight
      ? { gridTemplateRows: `repeat(${GRID_ROW_COUNT}, ${cellSize}px)` }
      : {}),
    ...(gridWidth ? { width: `${gridWidth}px` } : {}),
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
      <div
        ref={chartRef}
        className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden"
      >
        <div
          className="grid w-full grid-flow-col grid-rows-7 gap-1"
          style={gridStyle}
          aria-label="GitHub contribution calendar"
        >
          {visibleWeeks.flatMap((week, weekIndex) => {
            const days = getWeekDays(week)

            return days.map((day, dayIndex) => {
              const isFutureDay =
                weekIndex === visibleWeeks.length - 1 &&
                (!day?.date || day.date > todayKey)

              if (isFutureDay) {
                return (
                  <span
                    key={`${weekIndex}-${dayIndex}`}
                    aria-hidden="true"
                    className="invisible min-w-0"
                  />
                )
              }

              const label = day?.date
                ? `${day.date}: ${formatContributionCount(day.contributionCount)}`
                : "No contribution data"

              return (
                <span
                  key={`${weekIndex}-${dayIndex}`}
                  title={label}
                  aria-label={label}
                  className={`min-w-0 rounded-[3px] border border-border/90 xl:rounded-[5px] ${
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
              className={`size-2.5 rounded-[4px] border border-border/90 ${LEVEL_CLASSES[level]}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
