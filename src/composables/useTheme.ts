// Composable pour gérer le thème clair/sombre

import { ref, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

export function useTheme() {
  const currentTheme = ref<Theme>('auto')
  const isDark = ref(false)

  // Détecter la préférence système
  const getSystemTheme = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Appliquer le thème
  const applyTheme = (theme: Theme) => {
    let shouldBeDark = false

    if (theme === 'auto') {
      shouldBeDark = getSystemTheme()
    } else {
      shouldBeDark = theme === 'dark'
    }

    isDark.value = shouldBeDark

    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Changer le thème
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem('moodflow_theme', theme)
    applyTheme(theme)
  }

  // Toggle entre clair/sombre
  const toggleTheme = () => {
    if (currentTheme.value === 'auto') {
      setTheme(isDark.value ? 'light' : 'dark')
    } else {
      setTheme(isDark.value ? 'light' : 'dark')
    }
  }

  // Écouter les changements de préférence système
  onMounted(() => {
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('moodflow_theme') as Theme
    if (savedTheme) {
      currentTheme.value = savedTheme
    }

    applyTheme(currentTheme.value)

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (currentTheme.value === 'auto') {
        applyTheme('auto')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  })

  // Watch pour les changements de thème
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
  }
}
