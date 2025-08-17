<script setup>
import { ref, computed, onMounted } from "vue"

const props = defineProps({
  type: {
    type: String,
    default: "info", // "success", "error", "warning", "info"
  },
  title: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 3000, // auto-dismiss in 3s
  },
  icon: {
    type: String,
    default: "",
  }
})

const visible = ref(true)

const typeClasses = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-100 text-green-700 border border-green-300"
    case "error":
      return "bg-red-100 text-red-700 border border-red-300"
    case "warning":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300"
    default:
      return "bg-blue-100 text-blue-700 border border-blue-300"
  }
})

onMounted(() => {
  setTimeout(() => {
    visible.value = false
  }, props.duration)
})
</script>

 
<template>
  <div
    v-if="visible"
    :class="[
      'flex items-start p-4 mb-4 rounded-lg shadow-md transition-opacity duration-500',
      typeClasses
    ]"
    role="alert"
  >
    <!-- Icon -->
    <span v-if="icon" class="mr-2 text-xl">
      {{ icon }}
    </span>

    <!-- Content -->
    <div class="flex-1">
      <h3 v-if="title" class="font-semibold mb-1">{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

 
<style scoped>

</style>