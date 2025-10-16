<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import type { MoodStats } from '@/types/mood'
import { MOOD_COLORS, MOOD_LABELS, MOOD_EMOJIS } from '@/types/mood'

// Enregistrer les composants ECharts nécessaires
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

interface Props {
  stats: MoodStats
}

const props = defineProps<Props>()

// Options pour le graphique en donut (camembert)
const doughnutOptions = computed(() => {
  const data = Object.entries(props.stats.moodDistribution).map(([mood, count]) => ({
    name: MOOD_LABELS[mood as keyof typeof MOOD_LABELS],
    value: count,
    itemStyle: {
      color: MOOD_COLORS[mood as keyof typeof MOOD_COLORS],
    },
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#777',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 14,
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      textStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        name: 'Humeurs',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: false,
        },
        data,
        animationType: 'scale',
        animationDelay: (idx: number) => idx * 100,
      },
    ],
  }
})

// Options pour le graphique en barres
const barOptions = computed(() => {
  const categories = Object.keys(props.stats.moodDistribution).map(
    mood => MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS] + ' ' + MOOD_LABELS[mood as keyof typeof MOOD_LABELS]
  )
  const values = Object.values(props.stats.moodDistribution)
  const colors = Object.keys(props.stats.moodDistribution).map(
    mood => MOOD_COLORS[mood as keyof typeof MOOD_COLORS]
  )

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#777',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 14,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        fontSize: 11,
        rotate: 0,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        fontSize: 12,
      },
    },
    series: [
      {
        name: 'Nombre',
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index],
            borderRadius: [8, 8, 0, 0],
          },
        })),
        barWidth: '60%',
        animationDelay: (idx: number) => idx * 100,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
})

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

const trendColor = computed(() => {
  if (props.stats.weekTrend === 'up') return 'text-green-600 dark:text-green-400'
  if (props.stats.weekTrend === 'down') return 'text-red-600 dark:text-red-400'
  return 'text-blue-600 dark:text-blue-400'
})
</script>

<template>
  <div class="mood-chart space-y-4 sm:space-y-6">
    <!-- Statistiques générales -->
    <div class="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div
        class="stat-card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800"
      >
        <div class="text-3xl sm:text-4xl mb-2">📊</div>
        <div
          class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          {{ stats.totalEntries }}
        </div>
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          Entrées totales
        </div>
      </div>

      <div
        class="stat-card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 sm:p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800"
      >
        <div class="text-3xl sm:text-4xl mb-2">{{ trendIcon }}</div>
        <div class="text-2xl sm:text-3xl font-bold" :class="trendColor">
          {{ trendText }}
        </div>
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          Tendance de la semaine
        </div>
      </div>

      <div
        class="stat-card bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 sm:p-6 rounded-xl shadow-lg border border-yellow-200 dark:border-yellow-800"
      >
        <div class="text-3xl sm:text-4xl mb-2">⭐</div>
        <div
          class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200"
        >
          {{ MOOD_LABELS[stats.mostFrequentMood] }}
        </div>
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          Humeur dominante
        </div>
      </div>
    </div>

    <!-- Graphiques ECharts -->
    <div class="charts-grid grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div
        class="chart-container bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h4
          class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200"
        >
          📊 Distribution des humeurs
        </h4>
        <VChart
          :option="doughnutOptions"
          :autoresize="true"
          class="chart h-64 sm:h-80"
        />
      </div>

      <div
        class="chart-container bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h4
          class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200"
        >
          📈 Fréquence par humeur
        </h4>
        <VChart
          :option="barOptions"
          :autoresize="true"
          class="chart h-64 sm:h-80"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.chart-container {
  transition: all 0.3s ease;
}

.chart-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.chart {
  width: 100%;
}

/* Animation d'apparition */
.stats-grid,
.charts-grid {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
