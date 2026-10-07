import { useCallback, useEffect, useState } from 'react'

import { api } from '@/api/client'
import type { Project, ProjectFilters } from '@/types'

interface UseProjectsResult {
  projects: Project[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useProjects({ technology, search }: ProjectFilters): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProjects({ technology, search })
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить проекты')
    } finally {
      setLoading(false)
    }
  }, [technology, search])

  useEffect(() => {
    void load()
  }, [load])

  return { projects, loading, error, reload: load }
}
