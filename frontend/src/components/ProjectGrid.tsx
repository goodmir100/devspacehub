import type { Project } from '@/types'

import ProjectCard from './ProjectCard'
import { ProjectCardSkeleton } from './Skeleton'

interface ProjectGridProps {
  projects: Project[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

export default function ProjectGrid({ projects, loading, error, onRetry }: ProjectGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
        <p className="mb-4 text-sm text-rose-700 dark:text-rose-300">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500"
        >
          Повторить попытку
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <p className="text-slate-500 dark:text-slate-400">
          Проекты не найдены. Попробуйте изменить фильтр или поисковый запрос.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}
