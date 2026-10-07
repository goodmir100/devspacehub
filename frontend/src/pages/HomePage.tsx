import { useEffect, useMemo, useState } from 'react'

import ContactForm from '@/components/ContactForm'
import Hero from '@/components/Hero'
import { MailIcon, SearchIcon } from '@/components/Icons'
import ProjectGrid from '@/components/ProjectGrid'
import TagFilter from '@/components/TagFilter'
import { useProjects } from '@/hooks/useProjects'

export default function HomePage() {
  const [technology, setTechnology] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [totalProjects, setTotalProjects] = useState(0)

  // Дебаунс поиска, чтобы не дёргать API на каждый символ.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(timeout)
  }, [search])

  const { projects, loading, error, reload } = useProjects({
    technology,
    search: debouncedSearch,
  })

  // Список тегов только пополняется, чтобы не «схлопываться» при активном фильтре.
  useEffect(() => {
    if (projects.length === 0) return
    setTechnologies((current) => {
      const set = new Set(current)
      projects.forEach((project) => project.technologies.forEach((tech) => set.add(tech)))
      return Array.from(set).sort((a, b) => a.localeCompare(b))
    })
  }, [projects])

  // Общее количество проектов фиксируем при отсутствии фильтров.
  useEffect(() => {
    if (!loading && !error && !technology && !debouncedSearch) {
      setTotalProjects(projects.length)
    }
  }, [projects, loading, error, technology, debouncedSearch])

  const technologyCount = useMemo(() => technologies.length, [technologies])

  return (
    <>
      <Hero projectCount={totalProjects} technologyCount={technologyCount} />

      <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Витрина проектов
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Фильтруйте по технологиям и ищите нужные кейсы в реальном времени.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по проектам..."
                aria-label="Поиск по проектам"
                className="w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {technologies.length > 0 && (
            <TagFilter technologies={technologies} active={technology} onChange={setTechnology} />
          )}
        </div>

        <ProjectGrid projects={projects} loading={loading} error={error} onRetry={reload} />
      </section>

      <section
        id="contact"
        className="scroll-mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30">
              <MailIcon className="size-3.5" />
              Обратная связь
            </span>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Есть идея или предложение?
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-slate-600 dark:text-slate-400">
              Оставьте сообщение — уведомление придёт мне в Telegram, и я отвечу вам в ближайшее
              время.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  )
}
