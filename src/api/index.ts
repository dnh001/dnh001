const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api.dnh001.com'
  : 'http://localhost:8787'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

class HttpClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${this.baseUrl}${path}`, config)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const searchParams = params ? '?' + new URLSearchParams(params).toString() : ''
    return this.request<T>(`${path}${searchParams}`)
  }

  post<T>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, { method: 'POST', body })
  }

  put<T>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body })
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

export const api = new HttpClient(API_BASE)

// City APIs
export const cityApi = {
  list: (params?: { page?: number; limit?: number; sort?: string; filter?: string }) =>
    api.get<{ cities: any[]; total: number }>('/api/cities', params as Record<string, string>),
  getById: (id: string) => api.get<any>(`/api/cities/${id}`),
  getBySlug: (slug: string) => api.get<any>(`/api/cities/slug/${slug}`),
  getTrending: () => api.get<any[]>('/api/cities/trending'),
  getTopRated: () => api.get<any[]>('/api/cities/top-rated'),
}

// Article APIs
export const articleApi = {
  list: (params?: { page?: number; limit?: number; category?: string; cityId?: string }) =>
    api.get<{ articles: any[]; total: number }>('/api/articles', params as Record<string, string>),
  getById: (id: string) => api.get<any>(`/api/articles/${id}`),
  getLatest: (limit?: number) => api.get<any[]>('/api/articles/latest', { limit: String(limit || 10) }),
}

// Meetup APIs
export const meetupApi = {
  list: (params?: { cityId?: string; upcoming?: boolean }) =>
    api.get<{ meetups: any[] }>('/api/meetups', params as Record<string, string>),
  getUpcoming: (limit?: number) =>
    api.get<any[]>('/api/meetups/upcoming', { limit: String(limit || 5) }),
}

// Review APIs
export const reviewApi = {
  list: (cityId: string, params?: { page?: number; limit?: number }) =>
    api.get<{ reviews: any[]; total: number }>(`/api/cities/${cityId}/reviews`, params as Record<string, string>),
  create: (cityId: string, data: any) =>
    api.post<any>(`/api/cities/${cityId}/reviews`, data),
}

// User APIs
export const userApi = {
  getProfile: () => api.get<any>('/api/user/profile'),
  updateProfile: (data: any) => api.put<any>('/api/user/profile', data),
  getCheckins: () => api.get<any[]>('/api/user/checkins'),
  getFavorites: () => api.get<any[]>('/api/user/favorites'),
  addFavorite: (cityId: string) => api.post<any>('/api/user/favorites', { cityId }),
  removeFavorite: (cityId: string) => api.delete<any>(`/api/user/favorites/${cityId}`),
}
