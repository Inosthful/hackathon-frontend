import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// 🔧 MODE DEV : Mettre à true pour accéder au dashboard sans authentification
const DEV_MODE = false

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: DEV_MODE ? '/dashboard' : '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard pour protéger les routes
router.beforeEach((to, _from, next) => {
  // En mode DEV, on bypass l'authentification
  if (DEV_MODE) {
    next()
    return
  }

  const { isAuthenticated } = useAuth()

  // Routes nécessitant une authentification
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
    return
  }

  // Routes réservées aux invités (non authentifiés)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/dashboard')
    return
  }

  next()
})

export default router
