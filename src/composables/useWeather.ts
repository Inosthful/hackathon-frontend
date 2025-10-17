import { ref } from 'vue';

import { apiClient } from './useAuth';

export function useWeather() {
  const weatherData = ref<any | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchWeatherSuggestion = async (latitude: number, longitude: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/weather?latitude=${latitude}&longitude=${longitude}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch weather suggestion');
      }
      weatherData.value = response.data;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    weatherData,
    loading,
    error,
    fetchWeatherSuggestion,
  };
}
