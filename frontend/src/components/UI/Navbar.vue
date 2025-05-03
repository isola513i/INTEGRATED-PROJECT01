<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>

<template>
  <nav class="bg-[#050610] fixed w-full z-50 text-white py-3">
    <div
      class="w-full relative flex items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <div class="flex-shrink-0">
        <router-link to="/">
          <img class="w-16 h-10" src="/image/ITBM_SHOP.png" alt="logo" />
        </router-link>
        <div class="hidden md:flex space-x-10 ml-24">
          <router-link
            to="/sale-items"
            class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300 after:content-[''] after:block after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all after:duration-300 after:mt-1"
            >store</router-link
          >
          <router-link
            to="/"
            class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300 after:content-[''] after:block after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all after:duration-300 after:mt-1"
            >support</router-link
          >
        </div>
      </div>

      <div
        class="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-10"
      >
        <router-link
          to="/sale-items"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300 after:content-[''] after:block after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all after:duration-300 after:mt-1"
          >Store</router-link
        >
        <router-link
          to="/"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300 after:content-[''] after:block after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all after:duration-300 after:mt-1"
          >Support</router-link
        >
        <router-link
          to="/"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300 after:content-[''] after:block after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all after:duration-300 after:mt-1"
          >Categories</router-link
        >
        <router-link
          to="/"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300 after:content-[''] after:block after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all after:duration-300 after:mt-1"
          >Promotions</router-link
        >
        <router-link
          to="/"
          class="relative font-semibold tracking-wide text-white hover:text-gray-300 transition duration-300 after:content-[''] after:block after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all after:duration-300 after:mt-1"
          >Collection</router-link
        >
      </div>

      <div class="flex items-center space-x-4">
        <div class="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search"
            class="pl-10 pr-4 py-1.5 rounded-full bg-white text-black text-sm focus:outline-none w-48 sm:w-64"
          />
          <svg
            class="w-4 h-4 absolute left-3 top-2.5 text-gray-500"
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
        </div>

        <div class="hidden md:flex items-center space-x-6">
          <button class="hover:text-gray-400 cursor-pointer" aria-label="Cart">
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
          <button class="hover:text-gray-400 cursor-pointer" aria-label="User">
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
        </div>

        <button class="md:hidden" @click="isOpen = !isOpen" aria-label="Menu">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="isOpen"
      class="md:hidden px-4 sm:px-6 lg:px-8 mt-3 space-y-2 pb-3"
    >
      <router-link
        to="/"
        class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
        @click="isOpen = false"
        >SUPPORT</router-link
      >
      <router-link
        to="/sale-items"
        class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
        @click="isOpen = false"
        >STORE</router-link
      >
    </div>
  </nav>
</template>
