import { SparklesIcon } from './Icons'

interface HeroProps {
  projectCount: number
  technologyCount: number
}

export default function Hero({ projectCount, technologyCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div className="absolute inset-0 -z-10 bg-grid opacity-60 dark:opacity-40" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-indigo-100/70 to-transparent dark:from-indigo-500/10" />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30">
          <SparklesIcon className="size-3.5" />
          Портфолио нового поколения
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
          Проекты, которые говорят{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            сами за себя
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          DevSpaceHub — интерактивная витрина работ с живой фильтрацией по технологиям,
          аналитикой просмотров и панелью управления. Добавляйте кейсы в реальном времени.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-medium text-white shadow-sm transition hover:bg-indigo-500"
          >
            Смотреть проекты
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-base font-medium text-slate-900 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-slate-800"
          >
            Связаться
          </a>
        </div>

        <dl className="mt-14 grid max-w-md grid-cols-2 gap-6">
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Проектов в витрине</dt>
            <dd className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {projectCount}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Технологий</dt>
            <dd className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {technologyCount}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
