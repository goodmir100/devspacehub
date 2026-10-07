import type {
  AnalyticsEventInput,
  AnalyticsSummary,
  ContactInput,
  ContactMessage,
  Project,
  ProjectCreateInput,
  ProjectFilters,
} from '@/types'

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const data = (await response.json()) as { detail?: unknown }
      if (typeof data.detail === 'string') detail = data.detail
    } catch {
      // тело ответа может быть пустым — оставляем статус как сообщение
    }
    throw new ApiError(detail || 'Ошибка запроса', response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value)
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

function adminHeaders(adminKey: string): Record<string, string> {
  return { 'X-Admin-Key': adminKey }
}

export const api = {
  getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
    const query = buildQuery({
      technology: filters.technology,
      search: filters.search,
    })
    return request<Project[]>(`/api/projects${query}`)
  },

  createProject(input: ProjectCreateInput, adminKey: string): Promise<Project> {
    return request<Project>('/api/projects', {
      method: 'POST',
      headers: adminHeaders(adminKey),
      body: JSON.stringify(input),
    })
  },

  deleteProject(projectId: number, adminKey: string): Promise<void> {
    return request<void>(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: adminHeaders(adminKey),
    })
  },

  trackEvent(input: AnalyticsEventInput): Promise<void> {
    return request<void>('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  getSummary(adminKey: string): Promise<AnalyticsSummary> {
    return request<AnalyticsSummary>('/api/analytics/summary', {
      headers: adminHeaders(adminKey),
    })
  },

  sendContact(input: ContactInput): Promise<ContactMessage> {
    return request<ContactMessage>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  getMessages(adminKey: string): Promise<ContactMessage[]> {
    return request<ContactMessage[]>('/api/contact', {
      headers: adminHeaders(adminKey),
    })
  },

  updateMessage(
    messageId: number,
    isRead: boolean,
    adminKey: string,
  ): Promise<ContactMessage> {
    return request<ContactMessage>(`/api/contact/${messageId}`, {
      method: 'PATCH',
      headers: adminHeaders(adminKey),
      body: JSON.stringify({ is_read: isRead }),
    })
  },
}
