// Composable pour gérer les données d'humeur

import { ref, computed } from 'vue'
import type { MoodEntry, MoodStats, MoodType } from '@/types/mood'
import { apiService } from '@/services/api'

const moodEntries = ref<MoodEntry[]>([])
const currentMood = ref<MoodEntry | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const currentDate = ref(new Date());

export function useMoodData() {

  // Récupérer les humeurs pour une période donnée
  const fetchMoodEntries = async (startDate?: string, endDate?: string) => {
    loading.value = true
    error.value = null
    try {
      moodEntries.value = await apiService.getMoodEntries(startDate, endDate)
    } catch (e) {
      error.value = 'Erreur lors du chargement des humeurs'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // Récupérer l'humeur pour une date spécifique
  const fetchMoodByDate = async (date: string) => {
    loading.value = true
    error.value = null
    try {
      currentMood.value = await apiService.getMoodByDate(date)
    } catch (e) {
      error.value = 'Erreur lors du chargement de l\'humeur'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // Créer ou mettre à jour une humeur
  const saveMood = async (mood: Omit<MoodEntry, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      // Vérifier si une humeur existe déjà pour cette date
      const existing = moodEntries.value.find(entry => entry.date === mood.date)

      if (existing && existing.id) {
        // Mettre à jour
        const updated = await apiService.updateMoodEntry(existing.id, mood)
        const index = moodEntries.value.findIndex(e => e.id === existing.id)
        if (index !== -1) {
          moodEntries.value[index] = updated
        }
        return updated
      } else {
        // Créer
        const created = await apiService.createMoodEntry(mood)
        moodEntries.value.push(created)
        return created
      }
    } catch (e) {
      error.value = 'Erreur lors de l\'enregistrement de l\'humeur'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Supprimer une humeur
  const deleteMood = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await apiService.deleteMoodEntry(id)
      moodEntries.value = moodEntries.value.filter(entry => entry.id !== id)
    } catch (e) {
      error.value = 'Erreur lors de la suppression de l\'humeur'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const toISODateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Obtenir les humeurs de la semaine pour la date courante
  const getWeekMoods = () => {
    const weekStart = new Date(currentDate.value)
    // Adjust to Monday as the start of the week
    const day = weekStart.getDay()
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      const dateStr = toISODateString(date)

      const mood = moodEntries.value.find(entry => entry.date === dateStr)
      weekDays.push({
        date: dateStr,
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        mood: mood || null,
      })
    }

    return weekDays
  }

  // Calculer les statistiques
  const stats = computed((): MoodStats => {
    if (moodEntries.value.length === 0) {
      return {
        averageMood: 0,
        mostFrequentMood: 'neutral',
        totalEntries: 0,
        weekTrend: 'stable',
        moodDistribution: {
          happy: 0,
          good: 0,
          neutral: 0,
          sad: 0,
          angry: 0,
        },
      }
    }

    // Distribution des humeurs
    const distribution = moodEntries.value.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {} as Record<MoodType, number>)

    // Humeur la plus fréquente
    const mostFrequent = Object.entries(distribution).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0] as MoodType

    // Calcul de la moyenne (convertir les humeurs en valeurs numériques)
    const moodValues: Record<MoodType, number> = {
      angry: 1,
      sad: 2,
      neutral: 3,
      good: 4,
      happy: 5,
    }
    const average =
      moodEntries.value.reduce((sum, entry) => sum + moodValues[entry.mood], 0) /
      moodEntries.value.length

    // Tendance de la semaine
    const weekMoods = getWeekMoods()
    const recentMoods = weekMoods
      .filter(day => day.mood)
      .slice(-5)
      .map(day => moodValues[day.mood!.mood])

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (recentMoods.length >= 3) {
      const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2))
      const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2))
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

      if (secondAvg > firstAvg + 0.5) trend = 'up'
      else if (secondAvg < firstAvg - 0.5) trend = 'down'
    }

    return {
      averageMood: Math.round(average * 10) / 10,
      mostFrequentMood: mostFrequent,
      totalEntries: moodEntries.value.length,
      weekTrend: trend,
      moodDistribution: distribution,
    }
  })

  const nextWeek = () => {
    currentDate.value.setDate(currentDate.value.getDate() + 7);
    currentDate.value = new Date(currentDate.value);
  };

  const previousWeek = () => {
    currentDate.value.setDate(currentDate.value.getDate() - 7);
    currentDate.value = new Date(currentDate.value);
  };

  const setWeek = (date: Date) => {
    currentDate.value = new Date(date);
  };

  return {
    moodEntries,
    currentMood,
    loading,
    error,
    fetchMoodEntries,
    fetchMoodByDate,
    saveMood,
    deleteMood,
    getWeekMoods,
    stats,
    currentDate,
    nextWeek,
    previousWeek,
    setWeek,
  }
}
