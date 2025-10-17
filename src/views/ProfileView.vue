<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const {
  user,
  logout,
  fetchUser,
  updateUser,
  requestEmailChange,
  changePassword,
  deleteAccount,
} = useAuth();
const router = useRouter();

const formData = ref({
  nom: "",
  prenom: "",
  dateAnniversaire: "",
});

const newEmail = ref("");
const emailChangeLoading = ref(false);
const emailChangeSuccess = ref("");
const emailChangeError = ref("");

const currentPassword = ref("");
const newPassword = ref("");
const passwordChangeLoading = ref(false);
const passwordChangeSuccess = ref("");
const passwordChangeError = ref("");

const showDeleteModal = ref(false);
const deletePassword = ref("");
const deleteLoading = ref(false);
const deleteError = ref("");

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

onMounted(async () => {
  if (!user.value) {
    await fetchUser();
  }
  if (user.value) {
    formData.value = {
      nom: user.value.nom || "",
      prenom: user.value.prenom || "",
      dateAnniversaire: user.value.dateAnniversaire
        ? new Date(user.value.dateAnniversaire).toISOString().split("T")[0]
        : "",
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
  successMessage.value = "";
  errorMessage.value = "";

  try {
    await updateUser(formData.value);
    successMessage.value =
      "Vos informations ont été mises à jour avec succès !";
    setTimeout(() => (successMessage.value = ""), 4000);
  } catch (error) {
    errorMessage.value = "Un problème est survenu. Veuillez réessayer.";
    setTimeout(() => (errorMessage.value = ""), 4000);
  } finally {
    loading.value = false;
  }
};

const handleEmailChange = async () => {
  if (!newEmail.value) {
    emailChangeError.value = "Veuillez saisir une nouvelle adresse e-mail.";
    setTimeout(() => (emailChangeError.value = ""), 5000);
    return;
  }
  emailChangeLoading.value = true;
  emailChangeSuccess.value = "";
  emailChangeError.value = "";

  try {
    await requestEmailChange(newEmail.value);
    emailChangeSuccess.value =
      "Un e-mail de confirmation a été envoyé à votre nouvelle adresse.";
    newEmail.value = "";
    setTimeout(() => {
      emailChangeSuccess.value = "";
      logout();
    }, 5000);
  } catch (error: any) {
    const backendMessage = error.response?.data?.message;
    const errorMap: { [key: string]: string } = {
      "This email address is already in use.":
        "Cette adresse e-mail est déjà utilisée.",
      "Invalid email provided": "Veuillez fournir une adresse e-mail valide.",
    };
    emailChangeError.value =
      errorMap[backendMessage] ||
      "Une erreur est survenue. Veuillez réessayer.";
    setTimeout(() => (emailChangeError.value = ""), 5000);
  } finally {
    emailChangeLoading.value = false;
  }
};

const handlePasswordChange = async () => {
  if (!currentPassword.value || !newPassword.value) {
    passwordChangeError.value = "Veuillez remplir tous les champs.";
    return;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(newPassword.value)) {
    passwordChangeError.value =
      "Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
    return;
  }

  passwordChangeLoading.value = true;
  passwordChangeSuccess.value = "";
  passwordChangeError.value = "";

  try {
    await changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    passwordChangeSuccess.value =
      "Votre mot de passe a été mis à jour avec succès !";
    currentPassword.value = "";
    newPassword.value = "";
    setTimeout(() => (passwordChangeSuccess.value = ""), 4000);
  } catch (error: any) {
    const backendMessage = error.response?.data?.message;
    const errorMap: { [key: string]: string } = {
      "Invalid current password": "Votre ancien mot de passe est incorrect.",
      "Current and new passwords are required":
        "Veuillez fournir votre ancien et votre nouveau mot de passe.",
    };
    passwordChangeError.value =
      errorMap[backendMessage] ||
      "Une erreur inattendue est survenue. Veuillez réessayer.";
    setTimeout(() => (passwordChangeError.value = ""), 5000);
  } finally {
    passwordChangeLoading.value = false;
  }
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
  deleteError.value = "";
  deletePassword.value = "";
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const handleAccountDelete = async () => {
  if (!deletePassword.value) {
    deleteError.value = "Le mot de passe est requis pour confirmer.";
    return;
  }
  deleteLoading.value = true;
  deleteError.value = "";

  try {
    await deleteAccount(deletePassword.value);
    router.push("/login");
  } catch (error: any) {
    const backendMessage = error.response?.data?.message;
    if (backendMessage === "Invalid password.") {
      deleteError.value = "Mot de passe incorrect.";
    } else {
      deleteError.value =
        "Une erreur est survenue. Impossible de supprimer le compte.";
    }
  } finally {
    deleteLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen w-full bg-[#FAF7F2] dark:bg-gray-900 font-sans transition-colors duration-300"
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

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <h1
          class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-white tracking-tighter leading-tight"
        >
          Cultivez votre
          <span
            class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] bg-clip-text text-transparent"
            >Bien-être</span
          >
        </h1>
        <p
          class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
        >
          Mettre à jour votre profil est un pas de plus vers une meilleure
          connaissance de soi. Prenez un moment pour vous.
        </p>
      </header>

      <div
        class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <div
            class="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col items-center justify-center text-center"
          >
            <div
              class="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-[#A5D6A7] to-[#80CBC4] text-white text-5xl font-bold shadow-lg mb-4"
            >
              {{ user?.prenom?.charAt(0).toUpperCase() || "U" }}
            </div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ user?.prenom }} {{ user?.nom }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ user?.adresseMail }}
            </p>

            <div class="w-full mt-8">
              <p
                class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"
              >
                Profil complété à
              </p>
              <div
                class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"
              >
                <div
                  class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: profileCompletion + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ Math.round(profileCompletion) }}%
              </p>
            </div>
          </div>

          <div class="lg:col-span-8 p-8 md:p-12">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Mes informations
            </h3>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label
                    for="prenom"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Prénom</label
                  >
                  <input
                    type="text"
                    id="prenom"
                    v-model="formData.prenom"
                    placeholder="Votre prénom"
                    class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div class="form-group">
                  <label
                    for="nom"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Nom</label
                  >
                  <input
                    type="text"
                    id="nom"
                    v-model="formData.nom"
                    placeholder="Votre nom"
                    class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div class="form-group">
                <label
                  for="dateAnniversaire"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Date de naissance</label
                >
                <input
                  type="date"
                  id="dateAnniversaire"
                  v-model="formData.dateAnniversaire"
                  class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div
                class="pt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-4"
              >
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="loading">Sauvegarde...</span>
                  <span v-else>Sauvegarder</span>
                </button>
              </div>
            </form>

            <hr class="my-8 border-gray-200/50 dark:border-gray-700/50" />

            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Changer mon adresse e-mail
            </h3>
            <form @submit.prevent="handleEmailChange" class="space-y-6">
              <div class="form-group">
                <label
                  for="new-email"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Nouvelle adresse e-mail</label
                >
                <input
                  type="email"
                  id="new-email"
                  v-model="newEmail"
                  placeholder="nouvel.email@example.com"
                  class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div class="pt-6 flex justify-end">
                <button
                  type="submit"
                  :disabled="emailChangeLoading"
                  class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="emailChangeLoading">Envoi...</span>
                  <span v-else>Recevoir l'e-mail de confirmation</span>
                </button>
              </div>
            </form>

            <hr class="my-8 border-gray-200/50 dark:border-gray-700/50" />

            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Changer mon mot de passe
            </h3>
            <form @submit.prevent="handlePasswordChange" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label
                    for="current-password"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Ancien mot de passe</label
                  >
                  <input
                    type="password"
                    id="current-password"
                    v-model="currentPassword"
                    placeholder="••••••••"
                    class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div class="form-group">
                  <label
                    for="new-password"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Nouveau mot de passe</label
                  >
                  <input
                    type="password"
                    id="new-password"
                    v-model="newPassword"
                    placeholder="••••••••"
                    class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div class="pt-6 flex justify-end">
                <button
                  type="submit"
                  :disabled="passwordChangeLoading"
                  class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="passwordChangeLoading">Changement...</span>
                  <span v-else>Changer le mot de passe</span>
                </button>
              </div>
            </form>

            <hr class="my-8 border-gray-200/50 dark:border-gray-700/50" />

            <div class="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl">
              <h3 class="text-xl font-bold text-red-800 dark:text-red-300">
                Zone de danger
              </h3>
              <p class="text-red-700 dark:text-red-400 mt-2 text-sm">
                La suppression de votre compte est une action définitive et
                irréversible. Toutes vos données seront perdues.
              </p>
              <div class="mt-4 flex justify-end">
                <button
                  @click="openDeleteModal"
                  class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <transition name="slide-up">
        <div
          v-if="successMessage || errorMessage"
          class="fixed bottom-10 right-10 max-w-sm w-full z-50"
        >
          <div
            :class="successMessage ? 'bg-green-500' : 'bg-red-500'"
            class="text-white p-4 rounded-xl shadow-2xl flex items-center"
          >
            <svg
              v-if="successMessage"
              class="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <svg
              v-if="errorMessage"
              class="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{{ successMessage || errorMessage }}</span>
          </div>
        </div>
      </transition>

      <transition name="slide-up">
        <div
          v-if="emailChangeSuccess || emailChangeError"
          class="fixed bottom-24 right-10 max-w-sm w-full z-50"
        >
          <div
            :class="emailChangeSuccess ? 'bg-blue-500' : 'bg-red-500'"
            class="text-white p-4 rounded-xl shadow-2xl flex items-center"
          >
            <svg
              v-if="emailChangeSuccess"
              class="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <svg
              v-if="emailChangeError"
              class="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{{ emailChangeSuccess || emailChangeError }}</span>
          </div>
        </div>
      </transition>

      <transition name="slide-up">
        <div
          v-if="passwordChangeSuccess || passwordChangeError"
          class="fixed bottom-40 right-10 max-w-sm w-full z-50"
        >
          <div
            :class="passwordChangeSuccess ? 'bg-green-500' : 'bg-red-500'"
            class="text-white p-4 rounded-xl shadow-2xl flex items-center"
          >
            <svg
              v-if="passwordChangeSuccess"
              class="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <svg
              v-if="passwordChangeError"
              class="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{{ passwordChangeSuccess || passwordChangeError }}</span>
          </div>
        </div>
      </transition>

      <footer
        class="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm"
      >
        <p>Conçu avec soin pour votre épanouissement.</p>
      </footer>
    </div>

    <transition name="fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 m-4"
        >
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
            Confirmer la suppression
          </h3>
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            Cette action est
            <strong class="font-bold text-red-600 dark:text-red-400"
              >irréversible</strong
            >. Pour confirmer, veuillez saisir votre mot de passe.
          </p>

          <div class="mt-6">
            <label
              for="delete-password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Mot de passe</label
            >
            <input
              type="password"
              id="delete-password"
              v-model="deletePassword"
              @keyup.enter="handleAccountDelete"
              placeholder="••••••••"
              class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <transition name="fade">
            <div
              v-if="deleteError"
              class="mt-4 text-red-600 dark:text-red-400 text-sm font-medium"
            >
              {{ deleteError }}
            </div>
          </transition>

          <div class="mt-8 flex justify-end gap-4">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 text-sm rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Annuler
            </button>
            <button
              @click="handleAccountDelete"
              :disabled="deleteLoading"
              class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="deleteLoading">Suppression...</span>
              <span v-else>Je comprends, supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
