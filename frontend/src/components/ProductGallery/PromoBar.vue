<template>
  <Transition name="fade-slide" appear>
    <div
      v-if="visible"
      class="fixed bottom-5 left-5 z-50 bg-white border border-black rounded-md px-3 py-2 flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-200 transition-all duration-300 shadow-sm"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <span :class="[hovered ? 'text-black' : 'text-black']">
        <strong>GET 20% OFF</strong>
      </span>
      <button
        @click.stop="visible = false"
        class="text-black hover:text-gold text-base leading-none font-semibold focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(true);
const hovered = ref(false);
</script>

<style scoped>
.text-gold {
  color: #d4af37;
}

.fade-slide-enter-active {
  transition: all 0.6s ease;
}
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
