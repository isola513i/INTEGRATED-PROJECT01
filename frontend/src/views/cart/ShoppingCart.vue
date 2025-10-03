<script setup>
import { computed, ref } from "vue";
const shipAddress = ref("");
const shipNote = ref("");
import { useCartStore } from "@/store/useCartStore";
import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
const cart = useCartStore();

const selectedItems = computed(() => cart.items);
const totalItems = computed(() =>
  selectedItems.value.reduce((sum, it) => sum + Number(it.quantity || 0), 0)
);
const totalPrice = computed(() =>
  selectedItems.value.reduce(
    (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),0)
);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto p-4">
      <!-- Header -->
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-black">Shopping Cart</h1>
        <p class="text-sm text-gray-600">
          Review your items and proceed to checkout.
        </p>
      </header>

      <!-- Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- LEFT: Items -->
        <section class="lg:col-span-2">
          <CartItem />
        </section>

        <!-- RIGHT: Summary -->
        <aside class="lg:col-span-1">
          <CartSummary
            :total-items="totalItems"
            :total-price="totalPrice"
            :loading="false"
          />
        </aside>
      </div>
    </div>
  </div>
</template>
