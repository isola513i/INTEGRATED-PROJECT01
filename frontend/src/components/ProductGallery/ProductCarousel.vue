<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const imageModules = import.meta.glob("@/assets/carousel/*.jpg", {
  eager: true,
});

const images = Object.values(imageModules).map((mod) => mod.default);
const currentIndex = ref(0);

function next() {
  currentIndex.value = (currentIndex.value + 1) % images.length;
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
}

let intervalId;

onMounted(() => {
  intervalId = setInterval(() => {
    next();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="relative w-full overflow-hidden h-[400px] md:h-[500px]">
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="w-full flex-shrink-0 h-full flex items-center justify-center"
      >
        <img
          :src="image"
          alt="Carousel Image"
          class="max-w-full max-h-full object-contain relative bottom-80"
        />
      </div>
    </div>
    <div
      class="absolute top-1/2 left-12 transform -translate-y-1/2 z-10 text-white max-w-md ml-5"
    >
      <h2 class="text-3xl md:text-4xl font-semibold mb-4 drop-shadow-lg">
        Innovation Meets Elegance
      </h2>
      <p class="text-sm md:text-base mb-6 drop-shadow-md">
        Upgrade your everyday with next-gen design.
      </p>
      <button
        class="border border-white text-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all text-sm font-medium"
      >
        Learn More
      </button>
    </div>

    <button
      @click="prev"
      class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black text-3xl focus:outline-none z-10"
      aria-label="Previous"
    >
      ‹
    </button>
    <button
      @click="next"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black text-3xl focus:outline-none z-10"
      aria-label="Next"
    >
      ›
    </button>
  </div>
</template>

<style scoped></style>
