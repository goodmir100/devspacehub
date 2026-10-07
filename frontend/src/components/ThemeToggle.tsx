import { useTheme } from '@/context/ThemeContext'

import { MoonIcon, SunIcon } from './Icons'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      className="inline-flex size-10 items-center justify-center rounded-xl text-slate-600 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  )
}
