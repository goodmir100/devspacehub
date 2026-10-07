interface TagFilterProps {
  technologies: string[]
  active: string | undefined
  onChange: (technology: string | undefined) => void
}

export default function TagFilter({ technologies, active, onChange }: TagFilterProps) {
  const chips: Array<{ label: string; value: string | undefined }> = [
    { label: 'Все', value: undefined },
    ...technologies.map((tech) => ({ label: tech, value: tech })),
  ]

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по технологиям">
      {chips.map((chip) => {
        const isActive = active === chip.value
        return (
          <button
            key={chip.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(chip.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
