export interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  github_link: string | null
  demo_link: string | null
  image_url: string | null
  featured: boolean
  created_at: string
}

export interface ProjectCreateInput {
  title: string
  description: string
  technologies: string[]
  github_link?: string | null
  demo_link?: string | null
  image_url?: string | null
  featured: boolean
}

export type AnalyticsEventType = 'view' | 'click'

export interface AnalyticsEventInput {
  project_id: number | null
  event_type: AnalyticsEventType
}

export interface ContactInput {
  name: string
  email: string
  message: string
}

export interface ContactMessage extends ContactInput {
  id: number
  is_read: boolean
  created_at: string
}

export interface ProjectStats {
  project_id: number
  title: string
  views: number
  clicks: number
}

export interface DailyPoint {
  day: string
  views: number
  clicks: number
}

export interface AnalyticsSummary {
  total_views: number
  total_clicks: number
  total_projects: number
  total_messages: number
  unread_messages: number
  per_project: ProjectStats[]
  daily: DailyPoint[]
}

export interface ProjectFilters {
  technology?: string
  search?: string
}
