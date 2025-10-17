import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
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
  const router = useRouter();

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.post<{ token: string }>('/auth/login', { email: credentials.email, password: credentials.password });
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
      const response = await apiClient.post<AuthResponse>('/register', {
        nom: data.lastName,
        prenom: data.firstName,
        adresseMail: data.email,
        dateAnniversaire: data.birthDate,
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
    router.push('/login');
  }

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const response = await apiClient.get<{ user: User }>('/me');
      user.value = response.data.user;
      localStorage.setItem('moodflow_user', JSON.stringify(user.value));
    } catch (e) {
      console.error('[useAuth] fetchUser: Failed to fetch user', e);
      logout();
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

  const changePassword = async (passwordData: { currentPassword, newPassword }) => {
    return apiClient.post('/user/change-password', passwordData);
  };

  const deleteAccount = async (password: string) => {
    await apiClient.delete('/user', { data: { password } });
    logout();
  };

  const requestPasswordReset = async (email: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post('/forgot-password', { email });
      return response.data;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Erreur lors de la demande de réinitialisation.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post('/reset-password', { token, password, confirmPassword });
      return response.data;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe.';
      return null;
    } finally {
      loading.value = false;
    }
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
    changePassword,
    deleteAccount,
    requestPasswordReset,
    resetPassword,
  }
}