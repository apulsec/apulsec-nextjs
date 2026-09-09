import { Calendar } from "@/components/ui/calendar"

export default function CalendarCard() {
  return (
    <div className="flex h-full items-center justify-center">
      {/* 保留完整月历外观，但不传入 selection props，不显示日期选择状态。 */}
      <Calendar
        className="max-w-full rounded-2xl border border-border/60 bg-background/20 [--cell-size:--spacing(5)] sm:[--cell-size:--spacing(6)] xl:[--cell-size:--spacing(7)]"
      />
    </div>
  )
}
