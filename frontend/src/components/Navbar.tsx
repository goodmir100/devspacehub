import { Link, useLocation } from 'react-router-dom'

import { CodeIcon } from './Icons'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Проекты', to: '/#projects' },
  { label: 'Контакты', to: '/#contact' },
  { label: 'Админ', to: '/admin' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <CodeIcon className="size-5" />
          </span>
          <span>
            DevSpace<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`hidden rounded-lg px-3 py-2 text-sm font-medium transition sm:inline-block ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            to="/admin"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Админ
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
