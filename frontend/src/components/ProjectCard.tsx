import { useEffect, useRef } from 'react'

import { api } from '@/api/client'
import type { Project } from '@/types'

import { ExternalLinkIcon, GithubIcon, StarIcon } from './Icons'

interface ProjectCardProps {
  project: Project
  index?: number
}

function TechnologyBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
      {label}
    </span>
  )
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const tracked = useRef(false)

  // Фиксируем просмотр один раз, когда карточка появляется во вьюпорте.
  useEffect(() => {
    const node = cardRef.current
    if (!node || tracked.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !tracked.current) {
            tracked.current = true
            void api
              .trackEvent({ project_id: project.id, event_type: 'view' })
              .catch(() => undefined)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [project.id])

  const trackClick = () => {
    void api.trackEvent({ project_id: project.id, event_type: 'click' }).catch(() => undefined)
  }

  return (
    <article
      ref={cardRef}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className="group flex animate-fade-in-up flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          {project.title}
        </h3>
        {project.featured && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
            title="Избранный проект"
          >
            <StarIcon className="size-3" />
            Featured
          </span>
        )}
      </div>

      <p className="mb-5 line-clamp-3 grow text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {project.description}
      </p>

      {project.technologies.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <TechnologyBadge key={tech} label={tech} />
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        {project.github_link && (
          <a
            href={project.github_link}
            target="_blank"
            rel="noreferrer noopener"
            onClick={trackClick}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <GithubIcon className="size-4" />
            Код
          </a>
        )}
        {project.demo_link && (
          <a
            href={project.demo_link}
            target="_blank"
            rel="noreferrer noopener"
            onClick={trackClick}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ExternalLinkIcon className="size-4" />
            Демо
          </a>
        )}
        {!project.github_link && !project.demo_link && (
          <span className="text-sm text-slate-400 dark:text-slate-600">Ссылки не указаны</span>
        )}
      </div>
    </article>
  )
}
