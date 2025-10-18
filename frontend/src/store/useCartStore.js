// src/store/useCartStore.js
import { defineStore } from "pinia";
import { useAuthStore } from "./useAuthStore";
import {
  addToCart,
  getCartItemsByUser,
  setQuantity,
} from "@/services/cartService";

function normalizeId(v) {
  // กันเคส id เป็น number บ้าง string บ้าง
  return String(v ?? "");
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cart")) || [],
  }),

  getters: {
    count: (s) =>
      s.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),

    selectedtotal: (s) =>
      s.items
        .filter((i) => i.selected === true)
        .reduce(
          (sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0),
          0
        ),

    selectedCount: (s) =>
      s.items
        .filter((i) => i.selected === true)
        .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),

    // 👍 ดึงเฉพาะรายการที่ถูกเลือก (ต้องเป็น true)
    selectedItems: (s) => s.items.filter((i) => i.selected === true),
  },

  actions: {
    async getItems() {
      const userAuth = useAuthStore();
      const data = await getCartItemsByUser(userAuth.user.id);
      this.items = data || [];
      this.save();
    },

    save() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },

    async add(item, quantity = 1) {
      if (!item.id) return;
      const userAuth = useAuthStore();
      await addToCart(userAuth.user.id, item.id, quantity);
      await this.getItems();
    },

    toggleSelect(id) {
      const found = this.items.find(
        (i) => normalizeId(i.id) === normalizeId(id)
      );
      if (found) {
        found.selected = !found.selected;
        this.save();
      }
    },

    async inc(id, amount = 1) {
      const userAuth = useAuthStore();
      const found = this.items.find(
        (i) => normalizeId(i.id) === normalizeId(id)
      );
      await setQuantity(userAuth.user.id, id, found.quantity + amount);
      await this.getItems();
    },

    async dec(id, amount = 1) {
      const userAuth = useAuthStore();
      const found = this.items.find(
        (i) => normalizeId(i.id) === normalizeId(id)
      );
      await setQuantity(userAuth.user.id, id, found.quantity - amount);
      await this.getItems();
    },

    async setQty(id, qty) {
      const userAuth = useAuthStore();

      await setQuantity(userAuth.user.id, id, qty);
      await this.getItems();
    },

    // 🆕 ลบทีละหลายชิ้น (รับ array ของ id หรือรับ predicate function)
    removeMany(idsOrPredicate) {
      if (Array.isArray(idsOrPredicate)) {
        const set = new Set(idsOrPredicate.map(normalizeId));
        this.items = this.items.filter((i) => !set.has(normalizeId(i.id)));
      } else if (typeof idsOrPredicate === "function") {
        this.items = this.items.filter((i) => !idsOrPredicate(i));
      }
      this.save();
    },

    // 🆕 ลบเฉพาะที่ถูกเลือก
    clearSelected() {
      this.removeMany((i) => i.selected === true);
    },

    clear() {
      this.items = [];
      this.save();
    },
  },
});
