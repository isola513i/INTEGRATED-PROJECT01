<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useFlashStore } from "@/store/useFlashStore";
import { placeOrder } from "@/services/orderService";
import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
import { LinkIcon } from "@heroicons/vue/16/solid";
import router from "@/router";
import { getCartDetail, setDetail } from "@/services/cartService";

const auth = useAuthStore();
const cart = useCartStore();
const flash = useFlashStore();

const PREF_KEY = "checkoutPref";
const shipAddress = ref("");
const shipNote = ref("");
const placing = ref(false);

onMounted(async () => {
  const res = await getCartDetail(auth.userId);
  shipAddress.value = res?.shippingAddress;
  shipNote.value = res?.note;
});

const selectedItems = computed(() => cart.items.filter((i) => i.selected));

const totalItems = computed(() =>
  selectedItems.value.reduce((sum, it) => sum + Number(it.quantity || 0), 0)
);

const totalPrice = computed(() =>
  selectedItems.value.reduce(
    (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
    0
  )
);

async function handlePlaceOrder({ address, note }) {
  if (selectedItems.value.length === 0 || placing.value) return;

  placing.value = true;

  const sellerGroups = buildSellerGroups(selectedItems.value);
  if (sellerGroups.length === 0) {
    placing.value = false;
    alert("No valid items selected");
    return;
  }

  const payload = {
    buyerId: auth.userId,
    shippingAddress: address || null,
    orderNote: note || null,
    sellerGroups,
  };

  // console.log("[placeOrder] payload ->", JSON.stringify(payload, null, 2));

  try {
    const res = await placeOrder(payload, auth.userId);
    // success: ลบของที่สั่งออกจาก cart
    const removeIds = selectedItems.value.map((i) => i.saleItemId ?? i.id);
    cart.removeMany(removeIds);
    cart.items.forEach((i) => (i.selected = false));
    cart.save();
    cart.clearSelected();
    // (optional) redirect ไป /your-orders
    await setDetail(auth.userId, "", "");
    shipAddress.value = "";
    shipNote.value = "";

    flash.setMessage(
      "✅ Your order has been successfully processed.",
      "success"
    );
  } catch (e) {
    flash.setMessage(`❌ ${e.message || "Place order failed"}`, "error");
  } finally {
    placing.value = false;
  }
}

function buildSellerGroups(items) {
  const map = new Map();

  for (const it of items) {

    const sellerId = Number(it.sellerId ?? it.seller?.id);
    const saleItemId = Number(it.saleItemId ?? it.id);
    const quantity = Number(it.quantity ?? 0);
    if (
      !sellerId ||
      !saleItemId ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      continue;
    }
    if (!map.has(sellerId)) map.set(sellerId, []);
    map.get(sellerId).push({ saleItemId, quantity });
  }

  // แปลงเป็น array + กรองกลุ่มที่ไม่มี item
  return Array.from(map.entries())
    .map(([sellerId, items]) => ({ sellerId, items }))
    .filter((g) => g.sellerId && g.items.length > 0);
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ✅ Toast Flash Message -->
    <transition name="slide-down">
      <div
        v-if="flash.message"
        :class="[
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium text-sm sm:text-base tracking-wide select-none itbms-message',
          flash.style === 'success' ? 'bg-green-600' : 'bg-red-600',
        ]"
      >
        {{ flash.message }}
      </div>
    </transition>
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
            v-model:address="shipAddress"
            v-model:note="shipNote"
            :loading="placing"
            @place-order="handlePlaceOrder"
          />
        </aside>
      </div>
    </div>
  </div>
</template>
<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.slide-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
