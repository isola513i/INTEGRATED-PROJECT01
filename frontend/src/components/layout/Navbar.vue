<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const searchStore = useSearchStore();
import { useCartStore } from "@/store/useCartStore";
const cart = useCartStore();
const isCartDisabled = computed(() => cart.count === 0);

const isOpen = ref(false);
const isSignedIn = computed(() => auth.isAuthenticated);

// --- Search state + debounce (ยิงค้นหาอัตโนมัติหลังพิมพ์หยุด 400ms) ---
const searchQuery = ref(searchStore.search || "");
let debounceTimer;
function setSearchDebounced(v) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchStore.setSearch(v.trim());
  }, 400);
}
function handleSearch() {
  const trimmed = searchQuery.value.trim();
  searchStore.setSearch(trimmed);
  // router.push({ name: "SaleItemsV2" });
}
function clearSearch() {
  searchQuery.value = "";
  searchStore.setSearch("");
}

const searchInputRef = ref(null);

//

// Nav active state helper
function linkClasses(toPath) {
  const isActive =
    route.name === toPath ||
    route.path === toPath ||
    route.matched.some((m) => m.path === toPath);
  return [
    "relative font-semibold tracking-wide transition-colors duration-300",
    isActive ? "text-white" : "text-gray-300 hover:text-white",
  ].join(" ");
}

// Actions
function goToProfile() {
  router.push({ name: "ProfileView" });
  isOpen.value = false;
}
function goToSignIn() {
  router.push({ name: "signin" });
  isOpen.value = false;
}
function goToRegister() {
  router.push({ name: "register" });
  isOpen.value = false;
}
function handleLogOut() {
  auth.logout();
  router.push({ name: "SaleItemsV2" });
}
const orderStore = useOrderStore();

const sellerOrderCount = computed(() => orderStore.pendingCount || 0);

onMounted(() => {
  // ถ้าเป็น seller ให้เช็คจำนวนออเดอร์ใหม่
  if (auth.user?.userType === "SELLER") {
    orderStore.refreshPendingCount();
  }
});
</script>

<template>
  <nav
    class="sticky top-0 z-50 w-full bg-[#111112]/90 backdrop-blur border-b border-white/10"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-14 items-center justify-between">
        <div class="flex items-center gap-2 pl-0">
          <router-link to="/" class="inline-flex items-center">
            <img
              class="h-9 w-auto"
              src="/image/ITBM_SHOP.png"
              alt="ITBM Shop logo"
            />
          </router-link>
        </div>

        <div class="hidden md:flex items-center gap-8">
          <router-link to="/sale-items" :class="linkClasses('/sale-items')"
            >Store</router-link
          >
          <router-link to="/" :class="linkClasses('/')">Support</router-link>
          <router-link to="/" :class="linkClasses('/')">Categories</router-link>
          <router-link to="/" :class="linkClasses('/')">Promotions</router-link>
        </div>

        <div class="flex items-center gap-2">
          <div class="relative hidden lg:block">
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              @input="setSearchDebounced($event.target.value)"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Press / to search"
              class="peer pl-10 pr-10 py-2 w-72 xl:w-80 rounded-full bg-white/95 text-black text-sm outline-none ring-0 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
              aria-label="Search products"
            />
            <svg
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Clear search"
            >
              ✖
            </button>
          </div>

          <router-link to="/cart" custom v-slot="{ navigate }">
            <button
              class="itbms-cart-quantity relative hidden md:inline-flex items-center justify-center rounded-full p-2 text-gray-300 hover:text-white focus:outline-none  disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="isCartDisabled"
              :aria-disabled="isCartDisabled"
              :title="isCartDisabled ? 'Your cart is empty' : 'Cart'"
              @click="!isCartDisabled && navigate()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>

              <span
                v-if="cart.count > 0"
                class="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white"
              >
                {{ cart.count }}
              </span>
            </button>
          </router-link>

          <div
            class="itbms-cart-quantity relative hidden md:inline-flex items-center justify-center rounded-full p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <template v-if="isSignedIn">
              <router-link
                v-if="auth.user?.userType === 'BUYER'"
                to="/your-orders"
                class="rounded-md px-2 py-1 hover:text-white focus:outline-none "
              >
                <svg
                  class="h-7 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.0784 2.89423C8.57288 2.89423 6.54176 4.92534 6.54176 7.43086V7.50253H3.70513C2.72667 7.50253 1.93347 8.29572 1.93347 9.27418V16.6475C1.93347 19.662 4.37723 22.1058 7.39177 22.1058H16.6084C19.6229 22.1058 22.0667 19.662 22.0667 16.6475V9.27418C22.0667 8.29572 21.2735 7.50253 20.295 7.50253H17.4583V7.43086C17.4583 4.92535 15.4272 2.89423 12.9217 2.89423H11.0784ZM15.7583 9.20253V10.1958C15.7583 10.6653 16.1389 11.0458 16.6083 11.0458C17.0778 11.0458 17.4583 10.6653 17.4583 10.1958V9.20253H20.295C20.3346 9.20253 20.3667 9.23461 20.3667 9.27418V16.6475C20.3667 18.7231 18.684 20.4058 16.6084 20.4058H7.39177C5.31612 20.4058 3.63347 18.7231 3.63347 16.6475V9.27418C3.63347 9.23461 3.66555 9.20253 3.70513 9.20253H6.54176V10.1958C6.54176 10.6653 6.92231 11.0458 7.39176 11.0458C7.8612 11.0458 8.24176 10.6653 8.24176 10.1958V9.20253H15.7583ZM15.7583 7.50253V7.43086C15.7583 5.86423 14.4883 4.59423 12.9217 4.59423H11.0784C9.51176 4.59423 8.24176 5.86423 8.24176 7.43086V7.50253H15.7583Z"
                    fill="currentColor"
                  />
                </svg>
              </router-link>
              <router-link
                v-else-if="auth.user?.userType === 'SELLER'"
                to="/sale-orders"
                class="relative inline-flex items-center gap-1 rounded-md px-2 py-1 hover:text-white focus:outline-none "
              >
                <div class="relative">
                  <svg
                    class="h-7 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="0.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.0784 2.89423C8.57288 2.89423 6.54176 4.92534 6.54176 7.43086V7.50253H3.70513C2.72667 7.50253 1.93347 8.29572 1.93347 9.27418V16.6475C1.93347 19.662 4.37723 22.1058 7.39177 22.1058H16.6084C19.6229 22.1058 22.0667 19.662 22.0667 16.6475V9.27418C22.0667 8.29572 21.2735 7.50253 20.295 7.50253H17.4583V7.43086C17.4583 4.92535 15.4272 2.89423 12.9217 2.89423H11.0784ZM15.7583 9.20253V10.1958C15.7583 10.6653 16.1389 11.0458 16.6083 11.0458C17.0778 11.0458 17.4583 10.6653 17.4583 10.1958V9.20253H20.295C20.3346 9.20253 20.3667 9.23461 20.3667 9.27418V16.6475C20.3667 18.7231 18.684 20.4058 16.6084 20.4058H7.39177C5.31612 20.4058 3.63347 18.7231 3.63347 16.6475V9.27418C3.63347 9.23461 3.66555 9.20253 3.70513 9.20253H6.54176V10.1958C6.54176 10.6653 6.92231 11.0458 7.39176 11.0458C7.8612 11.0458 8.24176 10.6653 8.24176 10.1958V9.20253H15.7583ZM15.7583 7.50253V7.43086C15.7583 5.86423 14.4883 4.59423 12.9217 4.59423H11.0784C9.51176 4.59423 8.24176 5.86423 8.24176 7.43086V7.50253H15.7583Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span
                    v-if="sellerOrderCount > 0"
                    class="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white"
                  >
                    {{ sellerOrderCount }}
                  </span>
                </div>

                
              </router-link>

              <router-link
                :to="{ name: 'ProfileView' }"
                class="rounded-md px-2 py-1 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Profile
              </router-link>
              <div class="hidden lg:block text-sm">
                Hi, {{ auth.nickname ?? auth.user?.nickName }}
              </div>
              <button
                @click="handleLogOut"
                class="rounded-md px-2 py-1 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Log out
              </button>
            </template>
            <template v-else>
              <button
                @click="goToSignIn"
                class="rounded-md px-3 py-1.5 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign in
              </button>
              <button
                @click="goToRegister"
                class="rounded-full px-3 py-1.5 bg-white text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Register
              </button>
            </template>
          </div>

          <button
            class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="isOpen = !isOpen"
            aria-label="Toggle menu"
            :aria-expanded="isOpen"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isOpen"
      class="md:hidden border-t border-white/10 bg-[#111112] px-4 sm:px-6 lg:px-8 pb-4"
    >
      <div class="relative mt-3">
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Search products"
          class="w-full rounded-xl bg-white/95 py-2 pl-10 pr-10 text-sm text-black outline-none ring-0 focus:ring-2 focus:ring-blue-500"
          aria-label="Search products"
        />
        <svg
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Clear search"
        >
          ✖
        </button>
      </div>

      <div class="mt-3 space-y-1 text-white">
        <router-link
          to="/sale-items"
          class="block rounded-md px-3 py-2 text-base font-medium hover:bg-white/10"
          @click="isOpen = false"
          >Store</router-link
        >
        <router-link
          to="/"
          class="block rounded-md px-3 py-2 text-base font-medium hover:bg-white/10"
          @click="isOpen = false"
          >Support</router-link
        >
        <router-link
          to="/"
          class="block rounded-md px-3 py-2 text-base font-medium hover:bg-white/10"
          @click="isOpen = false"
          >Categories</router-link
        >
        <router-link
          to="/"
          class="block rounded-md px-3 py-2 text-base font-medium hover:bg-white/10"
          @click="isOpen = false"
          >Promotions</router-link
        >
      </div>

      <div class="mt-2">
        <template v-if="isSignedIn">
          <router-link
            v-if="auth.user?.userType === 'BUYER'"
            to="/your-orders"
            class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10"
            @click="isOpen = false"
          >
            Your Orders
          </router-link>
          <router-link
            v-else-if="auth.user?.userType === 'SELLER'"
            to="/sale-orders"
            class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10"
            @click="isOpen = false"
          >
            Sale Orders
          </router-link>

          <button
            @click="goToProfile"
            class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10"
          >
            Profile
          </button>
          <button
            @click="handleLogOut"
            class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10"
          >
            Log out
          </button>
        </template>
        <template v-else>
          <button
            @click="goToSignIn"
            class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-white/10"
          >
            Sign in
          </button>
          <button
            @click="goToRegister"
            class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-left text-base font-medium text-black hover:bg-gray-100"
          >
            Register
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
