import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { MoodEntry, MoodStats, MoodType } from '@/types/mood'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('moodflow_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error)

        if (error.response?.status === 401) {
          localStorage.removeItem('moodflow_token')
          localStorage.removeItem('moodflow_user')
          window.location.href = '/login'
        }

        return Promise.reject(error)
      }
    )
  }

  async getMoodEntries(startDate?: string, endDate?: string): Promise<MoodEntry[]> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    const queryString = params.toString();
    const url = queryString ? `/moods?${queryString}` : '/moods';

    const response = await this.api.get(url);
    return response.data;
  }

  async getMoodByDate(date: string): Promise<MoodEntry | null> {
    const response = await this.api.get(`/moods/${date}`)
    return response.data
  }

  async createMoodEntry(mood: Omit<MoodEntry, 'id'>): Promise<MoodEntry> {
    const response = await this.api.post('/moods', mood)
    return response.data
  }

  async updateMoodEntry(id: number, mood: Partial<MoodEntry>): Promise<MoodEntry> {
    const response = await this.api.put(`/moods/${id}`, mood)
    return response.data
  }

  async deleteMoodEntry(id: number): Promise<void> {
    await this.api.delete(`/moods/${id}`)
  }

  async getMoodStats(startDate?: string, endDate?: string): Promise<MoodStats> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    const response = await this.api.get(`/moods/stats?${params.toString()}`)
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService
