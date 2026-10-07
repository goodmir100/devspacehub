import { useCallback, useEffect, useState } from 'react'

import { api } from '@/api/client'
import { CheckIcon, MailIcon } from '@/components/Icons'
import Skeleton from '@/components/Skeleton'
import type { ContactMessage } from '@/types'

interface MessagesPanelProps {
  adminKey: string
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MessagesPanel({ adminKey }: MessagesPanelProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setMessages(await api.getMessages(adminKey))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить сообщения')
    } finally {
      setLoading(false)
    }
  }, [adminKey])

  useEffect(() => {
    void load()
  }, [load])

  const toggleRead = async (message: ContactMessage) => {
    try {
      const updated = await api.updateMessage(message.id, !message.is_read, adminKey)
      setMessages((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      // Игнорируем — пользователь может повторить действие.
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
        {error}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <MailIcon className="mx-auto mb-3 size-8 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Пока нет сообщений.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <article
          key={message.id}
          className={`rounded-2xl border p-5 transition ${
            message.is_read
              ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              : 'border-indigo-200 bg-indigo-50/60 dark:border-indigo-500/30 dark:bg-indigo-500/10'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{message.name}</p>
              <a
                href={`mailto:${message.email}`}
                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {message.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(message.created_at)}
              </span>
              <button
                type="button"
                onClick={() => void toggleRead(message)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
              >
                <CheckIcon className="size-3.5" />
                {message.is_read ? 'Непрочитанное' : 'Прочитано'}
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {message.message}
          </p>
        </article>
      ))}
    </div>
  )
}
