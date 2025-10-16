<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { RegisterData } from '@/types/auth'

const router = useRouter()
const { register, loading, error } = useAuth()

const step = ref(1)

const formData = ref<RegisterData>({
  lastName: '',
  firstName: '',
  email: '',
  birthDate: '',
  password: '',
  passwordConfirm: '',
})

const nextStep = () => {
  // Basic validation for step 1
  if (formData.value.firstName && formData.value.lastName && formData.value.email && formData.value.birthDate) {
    step.value = 2
  } else {
    error.value = 'Veuillez remplir tous les champs.'
  }
}

const prevStep = () => {
  step.value = 1
}

const handleRegister = async () => {
  const success = await register(formData.value)

  if (success) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="register-view min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="register-card max-w-md w-full">
      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 sm:space-y-6">
        <!-- Header -->
        <div class="text-center space-y-1 sm:space-y-2">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            MoodFlow+
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Crée ton compte pour commencer
          </p>
        </div>

        <!-- Message d'erreur -->
        <Transition name="slide-fade">
          <div
            v-if="error"
            class="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-3 sm:p-4 rounded"
          >
            <p class="text-red-700 dark:text-red-400 text-xs sm:text-sm">{{ error }}</p>
          </div>
        </Transition>

        <!-- Formulaire -->
        <form @submit.prevent="step === 1 ? nextStep() : handleRegister()" class="space-y-3 sm:space-y-4">
          <!-- Step 1: User Info -->
          <div v-if="step === 1" class="space-y-3 sm:space-y-4">
            <!-- Nom -->
            <div>
              <label for="lastName" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Nom
              </label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                placeholder="Doe"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200"
              />
            </div>

            <!-- Prénom -->
            <div>
              <label for="firstName" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Prénom
              </label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                placeholder="John"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                placeholder="ton.email@exemple.com"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200"
              />
            </div>

            <!-- Date anniversaire -->
            <div>
              <label for="birthDate" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Date anniversaire
              </label>
              <input
                id="birthDate"
                v-model="formData.birthDate"
                type="date"
                required
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200"
              />
            </div>
          </div>

          <!-- Step 2: Password -->
          <div v-if="step === 2" class="space-y-3 sm:space-y-4">
            <!-- Password -->
            <div>
              <label for="password" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                required
                minlength="6"
                placeholder="••••••••"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Au moins 6 caractères
              </p>
            </div>

            <!-- Password Confirm -->
            <div>
              <label for="passwordConfirm" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Confirmer le mot de passe
              </label>
              <input
                id="passwordConfirm"
                v-model="formData.passwordConfirm"
                type="password"
                required
                minlength="6"
                placeholder="••••••••"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200"
              />
            </div>
          </div>

          <!-- Boutons de navigation -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3" :class="[step === 1 ? 'sm:justify-end' : 'sm:justify-between']">
            <button
              v-if="step === 2"
              @click="prevStep"
              type="button"
              class="py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200"
            >
              Précédent
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-purple-600 to-pink-600
                     text-white font-semibold shadow-lg hover:shadow-xl
                     transform hover:scale-105 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {{ step === 1 ? 'Suivant' : (loading ? 'Inscription...' : 'S\'inscrire') }}
            </button>
          </div>
        </form>

        <!-- Lien connexion -->
        <div class="text-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Déjà un compte ?
            <router-link
              to="/login"
              class="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>