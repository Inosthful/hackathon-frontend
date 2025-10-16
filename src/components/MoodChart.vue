<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import type { MoodStats } from '@/types/mood'
import { MOOD_COLORS, MOOD_LABELS } from '@/types/mood'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

interface Props {
  stats: MoodStats
}

const props = defineProps<Props>()

// Données pour le graphique en camembert
const doughnutData = computed(() => ({
  labels: Object.keys(props.stats.moodDistribution).map(
    mood => MOOD_LABELS[mood as keyof typeof MOOD_LABELS]
  ),
  datasets: [
    {
      data: Object.values(props.stats.moodDistribution),
      backgroundColor: Object.keys(props.stats.moodDistribution).map(
        mood => MOOD_COLORS[mood as keyof typeof MOOD_COLORS]
      ),
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
}))

// Données pour le graphique en barres
const barData = computed(() => ({
  labels: Object.keys(props.stats.moodDistribution).map(
    mood => MOOD_LABELS[mood as keyof typeof MOOD_LABELS]
  ),
  datasets: [
    {
      label: 'Nombre d\'entrées',
      data: Object.values(props.stats.moodDistribution),
      backgroundColor: Object.keys(props.stats.moodDistribution).map(
        mood => MOOD_COLORS[mood as keyof typeof MOOD_COLORS]
      ),
      borderRadius: 8,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        padding: 15,
        usePointStyle: true,
      },
    },
  },
}

const barOptions = {
  ...chartOptions,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
}

const trendIcon = computed(() => {
  if (props.stats.weekTrend === 'up') return '📈'
  if (props.stats.weekTrend === 'down') return '📉'
  return '➡️'
})

const trendText = computed(() => {
  if (props.stats.weekTrend === 'up') return 'En hausse'
  if (props.stats.weekTrend === 'down') return 'En baisse'
  return 'Stable'
})
</script>

<template>
  <div class="mood-chart space-y-6">
    <!-- Statistiques générales -->
    <div class="stats-grid grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div class="text-3xl mb-2">📊</div>
        <div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {{ stats.totalEntries }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Entrées totales</div>
      </div>

      <div class="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div class="text-3xl mb-2">{{ trendIcon }}</div>
        <div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {{ trendText }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Tendance de la semaine</div>
      </div>

      <div class="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div class="text-3xl mb-2">⭐</div>
        <div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {{ MOOD_LABELS[stats.mostFrequentMood] }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Humeur dominante</div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="charts-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="chart-container bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h4 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Distribution des humeurs
        </h4>
        <Doughnut :data="doughnutData" :options="chartOptions" />
      </div>

      <div class="chart-container bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h4 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Fréquence par humeur
        </h4>
        <Bar :data="barData" :options="barOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.chart-container {
  transition: transform 0.3s ease;
}

.chart-container:hover {
  transform: translateY(-2px);
}
</style>
