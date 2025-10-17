import { apiService } from "@/services/api";
import type { MoodEntry, MoodStats, MoodType } from "@/types/mood";
import { computed, ref } from "vue";

const moodEntries = ref<MoodEntry[]>([]);
const currentMood = ref<MoodEntry | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const currentDate = ref(new Date());

export function useMoodData() {
  const fetchMoodEntries = async (startDate?: string, endDate?: string) => {
    loading.value = true;
    error.value = null;
    try {
      const entries = await apiService.getMoodEntries(startDate, endDate);

      const dateMap = new Map<string, MoodEntry[]>();
      entries.forEach((entry) => {
        const date = entry.date?.substring(0, 10);
        if (date) {
          if (!dateMap.has(date)) {
            dateMap.set(date, []);
          }
          dateMap.get(date)!.push(entry);
        }
      });

      moodEntries.value = entries;
    } catch (e) {
      error.value = "Erreur lors du chargement des humeurs";
    } finally {
      loading.value = false;
    }
  };

  const fetchMoodByDate = async (date: string) => {
    loading.value = true;
    error.value = null;
    try {
      currentMood.value = await apiService.getMoodByDate(date);
    } catch (e) {
      error.value = "Erreur lors du chargement de l'humeur";
    } finally {
      loading.value = false;
    }
  };

  const saveMood = async (mood: Omit<MoodEntry, "id">) => {
    loading.value = true;
    error.value = null;
    try {
      const targetDate = mood.date.substring(0, 10);

      const existingEntries = moodEntries.value.filter((entry) => {
        if (!entry.date) return false;
        const entryDate = entry.date.substring(0, 10);
        return entryDate === targetDate;
      });

      if (existingEntries.length > 0) {
        const existing = existingEntries.reduce((latest, current) => {
          return current.id && latest.id && current.id > latest.id
            ? current
            : latest;
        });

        const updated = await apiService.updateMoodEntry(existing.id!, mood);

        const index = moodEntries.value.findIndex((e) => e.id === existing.id);
        if (index !== -1) {
          moodEntries.value[index] = updated;
        }

        if (existingEntries.length > 1) {
          for (const entry of existingEntries) {
            if (entry.id !== existing.id && entry.id) {
              try {
                await apiService.deleteMoodEntry(entry.id);
                moodEntries.value = moodEntries.value.filter(
                  (e) => e.id !== entry.id
                );
              } catch (deleteError) {}
            }
          }
        }

        return updated;
      } else {
        const created = await apiService.createMoodEntry(mood);
        moodEntries.value.push(created);
        return created;
      }
    } catch (e) {
      error.value = "Erreur lors de l'enregistrement de l'humeur";

      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteMood = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await apiService.deleteMoodEntry(id);
      moodEntries.value = moodEntries.value.filter((entry) => entry.id !== id);
    } catch (e) {
      error.value = "Erreur lors de la suppression de l'humeur";

      throw e;
    } finally {
      loading.value = false;
    }
  };

  const toISODateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getWeekMoods = () => {
    const weekStart = new Date(currentDate.value);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekDays = [];
    const todayStr = toISODateString(new Date());

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = toISODateString(date);

      const moodsForDay = moodEntries.value.filter((entry) => {
        const entryDatePart = (entry.date || "").substring(0, 10);
        const comparisonResult = entryDatePart === dateStr;
        return comparisonResult;
      });
      let representativeMood: MoodEntry | null = null;

      if (moodsForDay.length > 0) {
        if (dateStr === todayStr) {
          representativeMood = moodsForDay.sort(
            (a, b) =>
              new Date(b.beginAt!).getTime() - new Date(a.beginAt!).getTime()
          )[0];
        } else {
          representativeMood = moodsForDay.sort((a, b) => {
            const durationA = a.endAt
              ? new Date(a.endAt).getTime() - new Date(a.beginAt!).getTime()
              : 0;
            const durationB = b.endAt
              ? new Date(b.endAt).getTime() - new Date(b.beginAt!).getTime()
              : 0;
            return durationB - durationA;
          })[0];
        }
      }

      weekDays.push({
        date: dateStr,
        dayName: date.toLocaleDateString("fr-FR", { weekday: "short" }),
        mood: representativeMood,
      });
    }

    return weekDays;
  };

  const getMonthMoods = () => {
    const month = new Date(currentDate.value);
    month.setDate(1);
    const monthIndex = month.getMonth();
    const year = month.getFullYear();

    const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const monthDays = [];

    for (
      let i = 0;
      i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
      i++
    ) {
      monthDays.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, monthIndex, i);
      const dateStr = toISODateString(date);
      const mood = moodEntries.value.find(
        (entry) => (entry.date || "").substring(0, 10) === dateStr
      );

      monthDays.push({
        date: dateStr,
        dayName: date.toLocaleDateString("fr-FR", { weekday: "short" }),
        mood: mood || null,
      });
    }

    return monthDays;
  };

  const stats = computed((): MoodStats => {
    if (moodEntries.value.length === 0) {
      return {
        averageMood: 0,
        mostFrequentMood: "neutral",
        totalEntries: 0,
        weekTrend: "stable",
        moodDistribution: {
          happy: 0,
          good: 0,
          neutral: 0,
          sad: 0,
          angry: 0,
        },
      };
    }

    const distribution = moodEntries.value.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<MoodType, number>);

    const mostFrequent = Object.entries(distribution).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0] as MoodType;

    const moodValues: Record<MoodType, number> = {
      angry: 1,
      sad: 2,
      neutral: 3,
      good: 4,
      happy: 5,
    };
    const average =
      moodEntries.value.reduce(
        (sum, entry) => sum + moodValues[entry.mood],
        0
      ) / moodEntries.value.length;

    const weekMoods = getWeekMoods();
    const recentMoods = weekMoods
      .filter((day) => day.mood)
      .slice(-5)
      .map((day) => moodValues[day.mood!.mood]);

    let trend: "up" | "down" | "stable" = "stable";
    if (recentMoods.length >= 3) {
      const firstHalf = recentMoods.slice(
        0,
        Math.floor(recentMoods.length / 2)
      );
      const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg =
        secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      if (secondAvg > firstAvg + 0.5) trend = "up";
      else if (secondAvg < firstAvg - 0.5) trend = "down";
    }

    return {
      averageMood: Math.round(average * 10) / 10,
      mostFrequentMood: mostFrequent,
      totalEntries: moodEntries.value.length,
      weekTrend: trend,
      moodDistribution: distribution,
    };
  });

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

  const nextMonth = () => {
    currentDate.value.setMonth(currentDate.value.getMonth() + 1);
    currentDate.value = new Date(currentDate.value);
  };

  const previousMonth = () => {
    currentDate.value.setMonth(currentDate.value.getMonth() - 1);
    currentDate.value = new Date(currentDate.value);
  };

  const hasTodayMood = () => {
    const today = toISODateString(new Date());
    return moodEntries.value.some(
      (entry) => (entry.date || "").substring(0, 10) === today
    );
  };

  const cleanupDuplicates = async () => {
    const dateMap = new Map<string, MoodEntry[]>();

    moodEntries.value.forEach((entry) => {
      const date = entry.date?.substring(0, 10);
      if (date) {
        if (!dateMap.has(date)) {
          dateMap.set(date, []);
        }
        dateMap.get(date)!.push(entry);
      }
    });

    let deletedCount = 0;
    for (const [date, entries] of dateMap) {
      if (entries.length > 1) {
        const sorted = entries.sort((a, b) => (b.id || 0) - (a.id || 0));
        const toKeep = sorted[0];
        const toDelete = sorted.slice(1);

        for (const entry of toDelete) {
          if (entry.id) {
            try {
              await apiService.deleteMoodEntry(entry.id);
              moodEntries.value = moodEntries.value.filter(
                (e) => e.id !== entry.id
              );
              deletedCount++;
            } catch (e) {}
          }
        }
      }
    }

    return deletedCount;
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
    getMonthMoods,
    stats,
    currentDate,
    nextWeek,
    previousWeek,
    setWeek,
    nextMonth,
    previousMonth,
    hasTodayMood,
    cleanupDuplicates,
  };
}
