export interface User {
  id: number;
  adresseMail: string;
  nom: string;
  prenom: string;
  dateAnniversaire: string;
  joursConsecutifs: number;
  derniereConnexion: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  adresseMail: string;
  dateAnniversaire: string;
  password: string;
  passwordConfirm: string;
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
