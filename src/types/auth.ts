export interface User {
  id: number
  email: string
  username: string
  createdAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  lastName: string
  firstName: string
  email: string
  birthDate: string
  password: string
  passwordConfirm: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
