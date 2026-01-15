<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-md bg-white rounded-xl shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900">Connexion</h1>
      <p class="text-sm text-gray-500 mt-1">Connecte-toi pour accéder à l'application.</p>

      <div class="mt-6 space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 w-full border rounded-lg px-3 py-2" placeholder="ex: you@mail.com" />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700">Mot de passe</label>
          <input v-model="password" type="password" class="mt-1 w-full border rounded-lg px-3 py-2" placeholder="••••••••" />
        </div>

        <p v-if="auth.error" class="text-sm text-red-600">{{ auth.error }}</p>

        <button
          class="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-60"
          :disabled="auth.loading"
          @click="onLogin"
        >
          {{ auth.loading ? "Connexion..." : "Se connecter" }}
        </button>

        <div class="text-sm text-gray-600 text-center">
          Pas de compte ?
          <RouterLink to="/register" class="text-blue-700 font-medium hover:underline">S'inscrire</RouterLink>
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

const email = ref("");
const password = ref("");

async function onLogin() {
  const ok = await auth.login({ email: email.value.trim(), password: password.value });
  if (ok) router.push("/dashboard");
}
</script>
