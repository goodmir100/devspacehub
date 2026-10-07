import { useState, type FormEvent, type ReactNode } from 'react'

import AnalyticsPanel from '@/components/admin/AnalyticsPanel'
import MessagesPanel from '@/components/admin/MessagesPanel'
import ProjectForm from '@/components/admin/ProjectForm'
import Button from '@/components/Button'
import { BarChartIcon, MailIcon, PlusIcon, SparklesIcon } from '@/components/Icons'

const STORAGE_KEY = 'devspacehub-admin-key'

type Tab = 'overview' | 'add' | 'messages'

const tabs: Array<{ id: Tab; label: string; icon: ReactNode }> = [
  { id: 'overview', label: 'Обзор', icon: <BarChartIcon className="size-4" /> },
  { id: 'add', label: 'Добавить проект', icon: <PlusIcon className="size-4" /> },
  { id: 'messages', label: 'Сообщения', icon: <MailIcon className="size-4" /> },
]

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(() => window.localStorage.getItem(STORAGE_KEY) ?? '')
  const [keyInput, setKeyInput] = useState('')
  const [tab, setTab] = useState<Tab>('overview')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const key = keyInput.trim()
    if (!key) return
    window.localStorage.setItem(STORAGE_KEY, key)
    setAdminKey(key)
    setKeyInput('')
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    setAdminKey('')
    setTab('overview')
  }

  if (!adminKey) {
    return (
      <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <SparklesIcon className="size-5" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Вход в панель управления
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Введите административный ключ (<code>ADMIN_API_KEY</code> из backend). Он сохранится
            только в этом браузере.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(event) => setKeyInput(event.target.value)}
              placeholder="X-Admin-Key"
              autoComplete="off"
              className="w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-800"
            />
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Панель администратора
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Управляйте витриной и следите за активностью посетителей.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Выйти
        </Button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === item.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <AnalyticsPanel key={refreshKey} adminKey={adminKey} />}
      {tab === 'add' && (
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
            Новый проект
          </h2>
          <ProjectForm adminKey={adminKey} onCreated={() => setRefreshKey((value) => value + 1)} />
        </div>
      )}
      {tab === 'messages' && <MessagesPanel adminKey={adminKey} />}
    </div>
  )
}
