// Composable pour gérer l'authentification

import { ref, computed } from 'vue'
import axios from 'axios'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'

// 🔧 MODE DEV : Mettre à true pour utiliser un utilisateur fictif
const DEV_MODE = true

const user = ref<User | null>(null)
const token = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Utilisateur fictif pour le mode développement
const mockUser: User = {
  id: 999,
  email: 'dev@moodflow.com',
  username: 'Dev Tester',
  createdAt: new Date().toISOString(),
}

// Charger le token et l'utilisateur depuis localStorage au démarrage
const loadStoredAuth = () => {
  // En mode DEV, charger l'utilisateur fictif
  if (DEV_MODE) {
    token.value = 'dev-token-123'
    user.value = mockUser
    return
  }

  const storedToken = localStorage.getItem('moodflow_token')
  const storedUser = localStorage.getItem('moodflow_user')

  if (storedToken && storedUser) {
    token.value = storedToken
    user.value = JSON.parse(storedUser)
  }
}

// Initialiser au chargement
loadStoredAuth()

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8000/api'

  // Connexion
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials)

      const { token: authToken, user: authUser } = response.data

      // Stocker le token et l'utilisateur
      token.value = authToken
      user.value = authUser

      localStorage.setItem('moodflow_token', authToken)
      localStorage.setItem('moodflow_user', JSON.stringify(authUser))

      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Erreur lors de la connexion'
      return false
    } finally {
      loading.value = false
    }
  }

  // Inscription
  const register = async (data: RegisterData): Promise<boolean> => {
    loading.value = true
    error.value = null

    // Validation côté client
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
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
        lastName: data.lastName,
        firstName: data.firstName,
        email: data.email,
        birthDate: data.birthDate,
        password: data.password,
      })

      const { token: authToken, user: authUser } = response.data

      // Stocker le token et l'utilisateur
      token.value = authToken
      user.value = authUser

      localStorage.setItem('moodflow_token', authToken)
      localStorage.setItem('moodflow_user', JSON.stringify(authUser))

      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Erreur lors de l\'inscription'
      return false
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const logout = () => {
    token.value = null
    user.value = null

    localStorage.removeItem('moodflow_token')
    localStorage.removeItem('moodflow_user')
  }

  // Récupérer le token pour les requêtes API
  const getToken = () => token.value

  // Récupérer l'utilisateur courant
  const getCurrentUser = () => user.value

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getToken,
    getCurrentUser,
  }
}
