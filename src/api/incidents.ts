const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type IncidentStatus = 'active' | 'expiring' | 'cleared'
export type IncidentType = 'breakdown' | 'accident' | 'congestion' | 'roadwork' | 'other'

export interface IncidentRow {
  id: string
  raw_message: string
  clean_message: string
  incident_type: IncidentType
  location_name: string
  lat: number
  lng: number
  estimated_minutes: number
  reported_at: string
  expires_at: string
  status: IncidentStatus
  photo_url: string | null
  parsed_by: 'regex' | 'groq'
  source: 'whatsapp' | 'telegram' | 'manual'
  created_at: string
}

export interface IncidentPagination {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface IncidentsResponse {
  data: IncidentRow[]
  pagination: IncidentPagination
}

export interface IntelligenceSummary {
  total_today: number
  active_now: number
  avg_duration_minutes: number
  focus_junction: {
    name: string
    count: number
    lat: number
    lng: number
  } | null
}

export interface IntelligenceResponse {
  summary: IntelligenceSummary
  hourly: Array<{ hour: number; count: number }>
  by_type: Array<{ type: IncidentType; count: number }>
  hotspots: Array<{ location_name: string; count: number; lat: number; lng: number }>
  heatmap: Array<{ day: string; hour: number; count: number }>
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const fetchIncidents = (params?: Record<string, string>) => {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetch(`${BASE}/api/incidents${query}`).then((response) => parseResponse<IncidentsResponse>(response))
}

export const fetchIncident = (id: string) =>
  fetch(`${BASE}/api/incidents/${id}`).then((response) => parseResponse<IncidentRow>(response))

export const fetchIntelligence = (days = 30) =>
  fetch(`${BASE}/api/intelligence?days=${days}`).then((response) =>
    parseResponse<IntelligenceResponse>(response),
  )
