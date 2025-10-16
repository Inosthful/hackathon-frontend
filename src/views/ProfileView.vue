<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { user, fetchUser, updateUser } = useAuth();
const router = useRouter();

const formData = ref({
  nom: '',
  prenom: '',
  dateAnniversaire: '',
});

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(async () => {
  if (!user.value) {
    await fetchUser();
  }
  if (user.value) {
    formData.value = {
      nom: user.value.nom || '',
      prenom: user.value.prenom || '',
      dateAnniversaire: user.value.dateAnniversaire ? new Date(user.value.dateAnniversaire).toISOString().split('T')[0] : '',
    };
  }
});

const profileCompletion = computed(() => {
  let completedFields = 0;
  if (formData.value.nom) completedFields++;
  if (formData.value.prenom) completedFields++;
  if (formData.value.dateAnniversaire) completedFields++;
  return (completedFields / 3) * 100;
});

const handleSubmit = async () => {
  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await updateUser(formData.value);
    successMessage.value = 'Vos informations ont été mises à jour avec succès !';
    setTimeout(() => successMessage.value = '', 4000);
  } catch (error) {
    errorMessage.value = 'Un problème est survenu. Veuillez réessayer.';
    console.error(error);
    setTimeout(() => errorMessage.value = '', 4000);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/dashboard');
};
</script>

<template>
  <div class="min-h-screen w-full bg-[#F5F5F5] dark:bg-gray-900 font-sans transition-colors duration-300">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="rgba(165, 214, 167, 0.3)" />
                    <stop offset="100%" stop-color="rgba(165, 214, 167, 0)" />
                </radialGradient>
                <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="rgba(128, 203, 196, 0.3)" />
                    <stop offset="100%" stop-color="rgba(128, 203, 196, 0)" />
                </radialGradient>
            </defs>
            <rect x="-20%" y="-20%" width="60%" height="60%" fill="url(#grad1)" transform="rotate(-45)" />
            <rect x="60%" y="40%" width="60%" height="60%" fill="url(#grad2)" transform="rotate(30)" />
        </svg>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-white tracking-tighter leading-tight">
          Cultivez votre <span class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] bg-clip-text text-transparent">Bien-être</span>
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Mettre à jour votre profil est un pas de plus vers une meilleure connaissance de soi. Prenez un moment pour vous.
        </p>
      </header>

      <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12">

          <div class="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col items-center justify-center text-center">
            <div class="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-[#A5D6A7] to-[#80CBC4] text-white text-5xl font-bold shadow-lg mb-4">
              {{ user?.prenom?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ user?.prenom }} {{ user?.nom }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ user?.email }}</p>

            <div class="w-full mt-8">
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Profil complété à</p>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] h-2.5 rounded-full transition-all duration-500" :style="{ width: profileCompletion + '%' }"></div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ Math.round(profileCompletion) }}%</p>
            </div>
          </div>

          <div class="lg:col-span-8 p-8 md:p-12">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Mes informations</h3>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label for="prenom">Prénom</label>
                  <input type="text" id="prenom" v-model="formData.prenom" placeholder="Votre prénom" />
                </div>
                <div class="form-group">
                  <label for="nom">Nom</label>
                  <input type="text" id="nom" v-model="formData.nom" placeholder="Votre nom" />
                </div>
              </div>
              <div class="form-group">
                <label for="dateAnniversaire">Date de naissance</label>
                <input type="date" id="dateAnniversaire" v-model="formData.dateAnniversaire" />
              </div>

              <div class="pt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-4">
                <button type="button" @click="goBack" class="btn btn-secondary">
                  Retour
                </button>
                <button type="submit" :disabled="loading" class="btn btn-primary">
                  <span v-if="loading">Sauvegarde...</span>
                  <span v-else>Sauvegarder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <transition name="slide-up">
        <div v-if="successMessage || errorMessage" class="fixed bottom-10 right-10 max-w-sm w-full z-50">
            <div :class="successMessage ? 'bg-green-500' : 'bg-red-500'" class="text-white p-4 rounded-xl shadow-2xl flex items-center">
                <svg v-if="successMessage" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <svg v-if="errorMessage" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{{ successMessage || errorMessage }}</span>
            </div>
        </div>
      </transition>

      <footer class="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
        <p>Conçu avec soin pour votre épanouissement.</p>
      </footer>
    </div>
  </div>
</template>

