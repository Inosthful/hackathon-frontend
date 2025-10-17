<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import type { RegisterData } from "@/types/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { register, loading, error } = useAuth();

const step = ref(1);
const registrationSuccessMessage = ref("");

const formData = ref<RegisterData>({
  nom: "",
  prenom: "",
  adresseMail: "",
  dateAnniversaire: "",
  password: "",
  passwordConfirm: "",
});

const nextStep = () => {
  error.value = null;

  if (
    !formData.value.prenom ||
    !formData.value.nom ||
    !formData.value.adresseMail ||
    !formData.value.dateAnniversaire
  ) {
    error.value = "Veuillez remplir tous les champs.";
    return;
  }

  const birthDate = new Date(formData.value.dateAnniversaire);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 12) {
    error.value = "Vous devez avoir au moins 12 ans pour vous inscrire.";
    return;
  }

  step.value = 2;
};

const prevStep = () => {
  step.value = 1;
};

const handleRegister = async () => {
  const success = await register(formData.value);

  if (success) {
    registrationSuccessMessage.value =
      "Un email a été envoyé à votre adresse email afin de finaliser la création de votre compte.";
    setTimeout(() => {
      router.push("/login");
    }, 5000);
  }
};
</script>

<template>
  <div
    class="register-view min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-gray-900 p-4 relative"
  >
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
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
        <rect
          x="-20%"
          y="-20%"
          width="60%"
          height="60%"
          fill="url(#grad1)"
          transform="rotate(-45)"
        />
        <rect
          x="60%"
          y="40%"
          width="60%"
          height="60%"
          fill="url(#grad2)"
          transform="rotate(30)"
        />
      </svg>
    </div>

    <div class="register-card max-w-md w-full relative z-10">
      <div
        class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/20 p-6 sm:p-8 space-y-4 sm:space-y-6"
      >
        <div class="text-center space-y-1 sm:space-y-2">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white tracking-tighter"
          >
            Cultivez votre
            <span
              class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] bg-clip-text text-transparent"
              >Bien-être</span
            >
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Crée ton compte pour commencer
          </p>
        </div>

        <Transition name="slide-fade">
          <div
            v-if="error"
            class="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-3 sm:p-4 rounded"
          >
            <p class="text-red-700 dark:text-red-400 text-xs sm:text-sm">
              {{ error }}
            </p>
          </div>
        </Transition>

        <Transition name="slide-fade">
          <div
            v-if="registrationSuccessMessage"
            class="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 p-3 sm:p-4 rounded"
          >
            <p class="text-green-700 dark:text-green-400 text-xs sm:text-sm">
              {{ registrationSuccessMessage }}
            </p>
          </div>
        </Transition>

        <form
          @submit.prevent="step === 1 ? nextStep() : handleRegister()"
          class="space-y-3 sm:space-y-4"
        >
          <div v-if="step === 1" class="space-y-3 sm:space-y-4">
            <div>
              <label
                for="lastName"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Nom
              </label>
              <input
                id="lastName"
                v-model="formData.nom"
                type="text"
                required
                placeholder="Doe"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                for="firstName"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Prénom
              </label>
              <input
                id="firstName"
                v-model="formData.prenom"
                type="text"
                required
                placeholder="John"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                for="email"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Email
              </label>
              <input
                id="email"
                v-model="formData.adresseMail"
                type="email"
                required
                placeholder="ton.email@exemple.com"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                for="birthDate"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Date anniversaire
              </label>
              <input
                id="birthDate"
                v-model="formData.dateAnniversaire"
                type="date"
                required
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div v-if="step === 2" class="space-y-3 sm:space-y-4">
            <div>
              <label
                for="password"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                required
                minlength="8"
                placeholder="••••••••"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Au moins 8 caractères
              </p>
            </div>

            <div>
              <label
                for="passwordConfirm"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="passwordConfirm"
                v-model="formData.passwordConfirm"
                type="password"
                required
                minlength="8"
                placeholder="••••••••"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div
            class="flex flex-col sm:flex-row gap-2 sm:gap-3"
            :class="[step === 1 ? 'sm:justify-end' : 'sm:justify-between']"
          >
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
              class="py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {{
                step === 1
                  ? "Suivant"
                  : loading
                  ? "Inscription..."
                  : "S'inscrire"
              }}
            </button>
          </div>
        </form>

        <div
          class="text-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Déjà un compte ?
            <router-link
              to="/login"
              class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] bg-clip-text text-transparent font-semibold hover:underline"
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
