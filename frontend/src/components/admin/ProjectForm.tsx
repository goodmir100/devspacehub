import { useState, type ChangeEvent, type FormEvent } from 'react'

import { api, ApiError } from '@/api/client'
import Button from '@/components/Button'
import { CheckIcon, PlusIcon } from '@/components/Icons'

interface ProjectFormProps {
  adminKey: string
  onCreated: () => void
}

const emptyForm = {
  title: '',
  description: '',
  technologies: '',
  github_link: '',
  demo_link: '',
  image_url: '',
  featured: false,
}

const inputClass =
  'w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800 dark:placeholder:text-slate-500'

const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300'

export default function ProjectForm({ adminKey, onCreated }: ProjectFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange =
    (field: keyof typeof emptyForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
      setForm((current) => ({ ...current, [field]: value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      await api.createProject(
        {
          title: form.title.trim(),
          description: form.description.trim(),
          technologies: form.technologies
            .split(',')
            .map((tech) => tech.trim())
            .filter(Boolean),
          github_link: form.github_link.trim() || null,
          demo_link: form.demo_link.trim() || null,
          image_url: form.image_url.trim() || null,
          featured: form.featured,
        },
        adminKey,
      )
      setForm(emptyForm)
      setSuccess(true)
      onCreated()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось создать проект')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="project-title" className={labelClass}>
            Название
          </label>
          <input
            id="project-title"
            required
            minLength={2}
            value={form.title}
            onChange={handleChange('title')}
            placeholder="DevSpaceHub"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="project-description" className={labelClass}>
            Описание
          </label>
          <textarea
            id="project-description"
            required
            minLength={10}
            rows={4}
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Кратко опишите проект, его цель и результат..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="project-technologies" className={labelClass}>
            Технологии <span className="text-slate-400">(через запятую)</span>
          </label>
          <input
            id="project-technologies"
            value={form.technologies}
            onChange={handleChange('technologies')}
            placeholder="React, TypeScript, FastAPI"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="project-github" className={labelClass}>
            Ссылка на GitHub
          </label>
          <input
            id="project-github"
            type="url"
            value={form.github_link}
            onChange={handleChange('github_link')}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="project-demo" className={labelClass}>
            Ссылка на демо
          </label>
          <input
            id="project-demo"
            type="url"
            value={form.demo_link}
            onChange={handleChange('demo_link')}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="project-image" className={labelClass}>
            Изображение (URL)
          </label>
          <input
            id="project-image"
            type="url"
            value={form.image_url}
            onChange={handleChange('image_url')}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-3 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={handleChange('featured')}
            className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Отметить как избранный проект
          </span>
        </label>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      {success && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckIcon className="size-4" />
          Проект успешно добавлен в витрину.
        </p>
      )}

      <Button type="submit" loading={submitting}>
        {!submitting && <PlusIcon className="size-4" />}
        Добавить проект
      </Button>
    </form>
  )
}
