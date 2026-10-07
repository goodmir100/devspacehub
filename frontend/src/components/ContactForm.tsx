import { useState, type ChangeEvent, type FormEvent } from 'react'

import { api, ApiError } from '@/api/client'

import Button from './Button'
import { CheckIcon, SendIcon } from './Icons'

const initialForm = { name: '', email: '', message: '' }

const inputClass =
  'w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800 dark:placeholder:text-slate-500'

export default function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange =
    (field: keyof typeof initialForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      await api.sendContact(form)
      setForm(initialForm)
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Не удалось отправить сообщение. Попробуйте позже.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Имя
          </label>
          <input
            id="contact-name"
            type="text"
            required
            minLength={2}
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Как к вам обращаться?"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Сообщение
        </label>
        <textarea
          id="contact-message"
          required
          minLength={5}
          rows={5}
          value={form.message}
          onChange={handleChange('message')}
          placeholder="Расскажите о вашей задаче..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      {success && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckIcon className="size-4" />
          Сообщение отправлено. Я свяжусь с вами в ближайшее время.
        </p>
      )}

      <Button type="submit" loading={submitting} className="w-full sm:w-auto">
        {!submitting && <SendIcon className="size-4" />}
        Отправить сообщение
      </Button>
    </form>
  )
}
