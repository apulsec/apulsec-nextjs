"use client"

import { useState } from "react"
import { CalendarDays } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"

export default function CalendarCard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="size-4 text-primary" />
          日历
        </div>
        <span className="text-xs text-muted-foreground">Pick a day</span>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="mx-auto rounded-2xl border border-border/60 bg-background/20"
      />

      <p className="mt-auto text-xs text-muted-foreground">
        {date
          ? `当前选择：${date.toLocaleDateString("zh-CN")}`
          : "请选择一个日期"}
      </p>
    </div>
  )
}
