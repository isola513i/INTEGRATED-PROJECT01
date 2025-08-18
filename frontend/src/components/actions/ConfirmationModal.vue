<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: "Confirm Action" },
  message: { type: String, default: "Are you sure?" },
});

defineEmits(["confirm", "cancel"]);
</script>

<template>
  <div
  class="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
>
  <div class="bg-white rounded-lg shadow-lg p-6 w-80">
    <!-- Title -->
    <h2 class="text-lg font-semibold mb-2">{{ title }}</h2>

    <!-- Message -->
    <p class="text-gray-600 mb-4">{{ message }}</p>

    <!-- Actions -->
    <div class="flex justify-end gap-2">
      <button
        @click="$emit('cancel')"
        class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        @click="$emit('confirm')"
        class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
      >
        Confirm
      </button>
    </div>
  </div>
</div>
</template>

<style scoped></style>
