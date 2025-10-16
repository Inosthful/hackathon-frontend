import { ref, computed } from 'vue'
import axios from 'axios'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'

const user = ref<User | null>(null)
const token = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const API_URL = '/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`
  }
  return config
})

const loadStoredAuth = () => {
  const storedToken = localStorage.getItem('moodflow_token')
  const storedUser = localStorage.getItem('moodflow_user')

  if (storedToken && storedUser && storedUser !== 'undefined') {
    token.value = storedToken
    try {
      user.value = JSON.parse(storedUser)
    } catch (e) {
      console.error('Failed to parse stored user, clearing storage', e)
      localStorage.removeItem('moodflow_user')
      localStorage.removeItem('moodflow_token')
    }
  }
}

loadStoredAuth()

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.post<{ token: string }>('/auth/login', credentials)
      const authToken = response.data.token

      token.value = authToken
      localStorage.setItem('moodflow_token', authToken)

      const userResponse = await apiClient.get<{ user: User }>('/me')
      const authUser = userResponse.data.user

      user.value = authUser
      localStorage.setItem('moodflow_user', JSON.stringify(authUser))

      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Erreur lors de la connexion'
      logout()
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    loading.value = true
    error.value = null

    if (data.password !== data.passwordConfirm) {
      error.value = 'Les mots de passe ne correspondent pas'
      loading.value = false
      return false
    }

    if (data.password.length < 6) {
      error.value = 'Le mot de passe doit contenir au moins 6 caractères'
      loading.value = false
      return false
    }

    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        lastName: data.lastName,
        firstName: data.firstName,
        email: data.email,
        birthDate: data.birthDate,
        password: data.password,
      })

      const { token: authToken, user: authUser } = response.data

      token.value = authToken
      user.value = authUser

      localStorage.setItem('moodflow_token', authToken)
      localStorage.setItem('moodflow_user', JSON.stringify(authUser))

      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || "Erreur lors de l'inscription"
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('moodflow_token')
    localStorage.removeItem('moodflow_user')
  }

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const response = await apiClient.get<{ user: User }>('/me');
      user.value = response.data.user;
      localStorage.setItem('moodflow_user', JSON.stringify(user.value));
    } catch (e) {
      console.error('Failed to fetch user', e);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user.value) throw new Error('User not authenticated');

    const response = await apiClient.patch(`/utilisateurs/${user.value.id}`, data, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      }
    });

    user.value = { ...user.value, ...response.data };
    localStorage.setItem('moodflow_user', JSON.stringify(user.value));
  };

  const requestEmailChange = async (email: string) => {
    return apiClient.post('/user/request-email-change', { email });
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    updateUser,
    requestEmailChange,
  }
}