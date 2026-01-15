import { defineStore } from "pinia";

export type AuthUser = { id: number; nom: string; email: string; created_at: string };

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
    loading: false,
    error: "" as string,
  }),
  actions: {
    async hydrate() {
      try {
        this.loading = true;
        this.error = "";
        this.user = await window.api.auth.me();
      } catch (e: any) {
        this.error = e?.message ?? String(e);
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    async register(payload: { nom: string; email: string; password: string }) {
      try {
        this.loading = true;
        this.error = "";
        this.user = await window.api.auth.register(payload);
        return true;
      } catch (e: any) {
        this.error = e?.message ?? String(e);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async login(payload: { email: string; password: string }) {
      try {
        this.loading = true;
        this.error = "";
        this.user = await window.api.auth.login(payload);
        return true;
      } catch (e: any) {
        this.error = e?.message ?? String(e);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      await window.api.auth.logout();
      this.user = null;
    },
  },
});
