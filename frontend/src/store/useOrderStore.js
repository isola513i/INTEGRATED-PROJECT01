// useOrderStore.js
import { defineStore } from "pinia";
import { fetchNewOrderCount } from "@/services/orderService";
import { useAuthStore } from "@/store/useAuthStore";

export const useOrderStore = defineStore("order", {
  state: () => ({
    pendingCount: 0,
    loadingPending: false,
  }),
  actions: {
    async refreshPendingCount() {
      const auth = useAuthStore();
      if (!auth.userId) {
        this.pendingCount = 0;
        return;
      }

      this.loadingPending = true;
      try {
        const count = await fetchNewOrderCount(auth.userId);
        this.pendingCount = Number(count) || 0;
      } catch (err) {
        console.error("refreshPendingCount error", err);
      } finally {
        this.loadingPending = false;
      }
    },

    // เปลี่ยนจาก clearPending() -> decrementPending()
    decrementPending() {
      if (this.pendingCount > 0) {
        this.pendingCount = this.pendingCount - 1;
      }
    },
  },
});
