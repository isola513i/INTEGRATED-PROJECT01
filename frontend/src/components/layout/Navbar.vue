<script setup>
import { ref } from "vue";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";   

const auth = useAuthStore();                            
const isOpen = ref(false);
const searchStore = useSearchStore();
const searchQuery = ref(searchStore.search); 

const handleSearch = () => {
  const trimmed = searchQuery.value.trim();
  searchStore.setSearch(trimmed); 
  isOpen.value = false;
};

const clearSearch = () => {
  searchQuery.value = "";
  searchStore.setSearch("");
};
</script>

<template>
  <nav class="bg-[#171717] fixed w-full z-50 text-white py-3">
    <div
      class="w-full relative flex items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <!-- Logo -->
      <div class="flex-shrink-0">
        <router-link to="/">
          <img class="w-16 h-10" src="/image/ITBM_SHOP.png" alt="logo" />
        </router-link>
      </div>

      <!-- Desktop Navigation Menu -->
      <div
        class="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-6 lg:space-x-10"
      >
        <router-link
          to="/sale-items"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300"
          >Store</router-link
        >
        <router-link
          to="/"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300"
          >Support</router-link
        >
        <router-link
          to="/"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300"
          >Categories</router-link
        >
        <router-link
          to="/"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300"
          >Promotions</router-link
        >
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <!-- Search Bar - Desktop Only -->
        <div class="relative hidden lg:block">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            @keyup.enter="handleSearch"
            class="itbms-search-text pl-10 pr-10 py-2 w-64 xl:w-72 rounded-full bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <!-- Search Icon -->
          <svg
            class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <!-- Clear Button (อยู่ตลอด) -->
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="itbms-search-clear-button absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
          >
            ✖
          </button>
        </div>

        <!-- Action Buttons - Desktop & Tablet -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Cart Icon -->
          <button
            class="hover:text-gray-400 transition-colors duration-200"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
          <!-- User Icon -->
          <button
            class="hover:text-gray-400 transition-colors duration-200"
            aria-label="User"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>
          <div v-if="auth.isAuthenticated" class="hidden md:block font-medium">
          Hi, {{ auth.nickname }}
        </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
          @click="isOpen = !isOpen"
          aria-label="Menu"
        >
          <svg
            class="w-6 h-6"
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

    <!-- Mobile Menu -->
    <div
      v-if="isOpen"
      class="md:hidden px-4 sm:px-6 lg:px-8 mt-3 space-y-1 pb-3 border-t border-gray-600"
    >
      <!-- Mobile Search -->
      <div class="relative py-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="pl-10 pr-10 py-2 w-full rounded-full bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <!-- Search Icon -->
        <svg
          class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <!-- Clear Button -->
        <button
          @click="searchQuery = ''"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
        >
          ✖
        </button>
      </div>

      <!-- Mobile Links -->
      <router-link
        to="/sale-items"
        class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200"
        @click="isOpen = false"
        >Store</router-link
      >
      <router-link
        to="/"
        class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200"
        @click="isOpen = false"
        >Support</router-link
      >
      <router-link
        to="/"
        class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200"
        @click="isOpen = false"
        >Categories</router-link
      >
      <router-link
        to="/"
        class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200"
        @click="isOpen = false"
        >Promotions</router-link
      >
      <router-link
        to="/"
        class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200"
        @click="isOpen = false"
        >Collection</router-link
      >
    </div>
  </nav>
</template>
