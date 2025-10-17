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
      const existing = moodEntries.value.find(entry => (entry.date || '').substring(0, 10) === mood.date)

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

  const toUTCISODateString = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Obtenir les humeurs de la semaine pour la date courante
  const getWeekMoods = () => {
    const weekStart = new Date(currentDate.value);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekDays = [];
    const todayStr = toUTCISODateString(new Date());

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = toUTCISODateString(date);

      const moodsForDay = moodEntries.value.filter(entry => {
        const entryDatePart = (entry.date || '').substring(0, 10);
        const comparisonResult = entryDatePart === dateStr;
        return comparisonResult;
      });
      let representativeMood: MoodEntry | null = null;

      if (moodsForDay.length > 0) {
        if (dateStr === todayStr) {
          representativeMood = moodsForDay.sort((a, b) =>
            new Date(b.beginAt!).getTime() - new Date(a.beginAt!).getTime()
          )[0];
        } else {
          representativeMood = moodsForDay.sort((a, b) => {
            const durationA = a.endAt ? new Date(a.endAt).getTime() - new Date(a.beginAt!).getTime() : 0;
            const durationB = b.endAt ? new Date(b.endAt).getTime() - new Date(b.beginAt!).getTime() : 0;
            return durationB - durationA;
          })[0];
        }
      }

      weekDays.push({
        date: dateStr,
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        mood: representativeMood,
      });
    }

    return weekDays;
  }

  // Obtenir les humeurs du mois complet pour la date courante
  const getMonthMoods = () => {
    const month = new Date(currentDate.value)
    month.setDate(1)
    const monthIndex = month.getMonth()
    const year = month.getFullYear()

    const firstDayOfMonth = new Date(year, monthIndex, 1).getDay()
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

    const monthDays = []

    // Ajouter des jours vides pour aligner le premier jour
    for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
      monthDays.push(null)
    }

    // Ajouter tous les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, monthIndex, i)
      const dateStr = toUTCISODateString(date)
      const mood = moodEntries.value.find(entry => (entry.date || '').substring(0, 10) === dateStr)

      monthDays.push({
        date: dateStr,
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        mood: mood || null,
      })
    }

    return monthDays
  }

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

    const distribution = moodEntries.value.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {} as Record<MoodType, number>)

    const mostFrequent = Object.entries(distribution).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0] as MoodType

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

  // Vérifier si une humeur existe pour aujourd'hui
  const hasTodayMood = () => {
    const today = toUTCISODateString(new Date())
    return moodEntries.value.some(entry => (entry.date || '').substring(0, 10) === today)
  }

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
    getMonthMoods,
    stats,
    currentDate,
    nextWeek,
    previousWeek,
    setWeek,
    hasTodayMood,
  }
}
