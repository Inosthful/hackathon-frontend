import { ref, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

export function useTheme() {
  const currentTheme = ref<Theme>('auto')
  const isDark = ref(false)

  const getSystemTheme = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

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

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem('moodflow_theme', theme)
    applyTheme(theme)
  }

  const toggleTheme = () => {
    if (currentTheme.value === 'auto') {
      setTheme(isDark.value ? 'light' : 'dark')
    } else {
      setTheme(isDark.value ? 'light' : 'dark')
    }
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('moodflow_theme') as Theme
    if (savedTheme) {
      currentTheme.value = savedTheme
    }

    applyTheme(currentTheme.value)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (currentTheme.value === 'auto') {
        applyTheme('auto')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  })

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
