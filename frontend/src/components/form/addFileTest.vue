<script setup>
import { ref } from "vue";
import { previewBinaryFile } from "../../services/previewBinary.js";
const imageFiles = ref([]);
const chooseBinaryFiles = (event) => {
  if (
    event.target.files[0].name.toLowerCase().endsWith(".jpeg") ||
    event.target.files[0].name.toLowerCase().endsWith(".jpg") ||
    event.target.files[0].name.toLowerCase().endsWith(".png")
  ) {
    imageFiles.value.push(previewBinaryFile(event.target.files[0]));
  }
};

const removeImage = (index) => {
  imageFiles.value.splice(index, 1);
};
</script>

<template>
  <div class="m-3">
    <input
      id="fileInput"
      type="file"
      accept=".jpg,.jpeg,.png"
      multiple
      @change="chooseBinaryFiles"
      class="hidden"
    />

    <!-- Styled label as + button -->
    <label
      for="fileInput"
      class="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer text-3xl text-gray-500 hover:bg-gray-100"
    >
      +
    </label>
    <div class="flex gap-3">
      <div
        v-show="imageFiles.length"
        v-for="(image, index) in imageFiles"
        :key="index"
        class="relative w-24 h-24 rounded overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <!-- Delete button -->
        <button
          @click="removeImage(index)"
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-600"
        >
          ×
        </button>

        <!-- Image preview -->
        <img
          :src="image"
          class="w-full h-full object-cover cursor-pointer"
          @click="deleteImage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
