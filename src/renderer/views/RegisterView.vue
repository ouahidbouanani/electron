<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-md bg-white rounded-xl shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900">Créer un compte</h1>
      <p class="text-sm text-gray-500 mt-1">Inscris-toi pour utiliser l'application.</p>

      <div class="mt-6 space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">Nom</label>
          <input v-model="nom" class="mt-1 w-full border rounded-lg px-3 py-2" placeholder="ex: Admin" />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 w-full border rounded-lg px-3 py-2" placeholder="ex: admin@mail.com" />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700">Mot de passe</label>
          <input v-model="password" type="password" class="mt-1 w-full border rounded-lg px-3 py-2" placeholder="••••••••" />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700">Confirmer</label>
          <input v-model="confirm" type="password" class="mt-1 w-full border rounded-lg px-3 py-2" placeholder="••••••••" />
        </div>

        <p v-if="localError" class="text-sm text-red-600">{{ localError }}</p>
        <p v-if="auth.error" class="text-sm text-red-600">{{ auth.error }}</p>

        <button
          class="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-60"
          :disabled="auth.loading"
          @click="onRegister"
        >
          {{ auth.loading ? "Création..." : "S'inscrire" }}
        </button>

        <div class="text-sm text-gray-600 text-center">
          Déjà un compte ?
          <RouterLink to="/login" class="text-blue-700 font-medium hover:underline">Se connecter</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const auth = useAuthStore();

const nom = ref("");
const email = ref("");
const password = ref("");
const confirm = ref("");
const localError = ref("");

async function onRegister() {
  localError.value = "";

  if (!nom.value.trim()) {
    localError.value = "Nom requis.";
    return;
  }

  if (!email.value.trim()) {
    localError.value = "Email requis.";
    return;
  }

  if (password.value.length < 4) {
    localError.value = "Mot de passe trop court (min 4).";
    return;
  }

  if (password.value !== confirm.value) {
    localError.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  const ok = await auth.register({
    nom: nom.value.trim(),
    email: email.value.trim(),
    password: password.value
  });

  if (ok) router.push("/dashboard");
}

</script>
