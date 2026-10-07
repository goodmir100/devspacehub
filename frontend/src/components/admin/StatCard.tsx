import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: number | string
  icon: ReactNode
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-indigo-600 dark:text-indigo-400">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}
