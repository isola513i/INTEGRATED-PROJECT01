<template>
  <section
    class="w-full border-b border-gray-200 bg-white py-10 px-4 md:px-8 mb-1"
  >
    <h1 class="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
      Filter
    </h1>

    <div class="flex items-center flex-wrap gap-4 md:gap-6">
      <div class="relative">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-medium transition duration-200 shadow-sm"
        >
          Categories
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-4">
        <button class="text-blue-600 font-semibold transition hover:underline">
          Relevance
        </button>
        <span class="text-gray-300">|</span>
        <button class="text-gray-500 hover:text-gray-800 transition">
          New
        </button>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped></style>
