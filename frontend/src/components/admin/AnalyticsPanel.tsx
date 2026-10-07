import { useCallback, useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { api } from '@/api/client'
import { BarChartIcon, ClickIcon, EyeIcon, MailIcon } from '@/components/Icons'
import Skeleton from '@/components/Skeleton'
import type { AnalyticsSummary } from '@/types'

import StatCard from './StatCard'

interface AnalyticsPanelProps {
  adminKey: string
}

function formatDay(day: string): string {
  const [, month, date] = day.split('-')
  return `${date}.${month}`
}

export default function AnalyticsPanel({ adminKey }: AnalyticsPanelProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setSummary(await api.getSummary(adminKey))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить аналитику')
    } finally {
      setLoading(false)
    }
  }, [adminKey])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
        {error ?? 'Нет данных'}
      </div>
    )
  }

  const dailyData = summary.daily.map((point) => ({
    ...point,
    label: formatDay(point.day),
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Просмотры" value={summary.total_views} icon={<EyeIcon className="size-5" />} />
        <StatCard
          label="Клики по ссылкам"
          value={summary.total_clicks}
          icon={<ClickIcon className="size-5" />}
        />
        <StatCard
          label="Проекты"
          value={summary.total_projects}
          icon={<BarChartIcon className="size-5" />}
        />
        <StatCard
          label="Сообщения"
          value={`${summary.total_messages} / ${summary.unread_messages} новых`}
          icon={<MailIcon className="size-5" />}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-6 text-base font-semibold text-slate-900 dark:text-white">
          Активность за 14 дней
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="views"
                name="Просмотры"
                stroke="#6366f1"
                fill="url(#viewsFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                name="Клики"
                stroke="#22c55e"
                fill="url(#clicksFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-6 text-base font-semibold text-slate-900 dark:text-white">
          Популярность проектов
        </h3>
        {summary.per_project.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Пока нет проектов.</p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.per_project} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis
                  dataKey="title"
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                  className="text-slate-400"
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Legend />
                <Bar dataKey="views" name="Просмотры" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="clicks" name="Клики" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
