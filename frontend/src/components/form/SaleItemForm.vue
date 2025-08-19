<script setup>
import Alert from "../actions/Alert.vue";
const props = defineProps({
  updatePage: {
    type: Boolean,
    default: false,
  },
  form: Object,
  brands: Array,
  isUpdate: Boolean,
  isSubmitting: Boolean,
  isReadyToSubmit: Boolean,
  errors: Object,
});

const emit = defineEmits(["update:form", "submit", "cancel", "blur"]);

const updateField = (field, value) => {
  emit("update:form", { ...props.form, [field]: value });
};

const trimField = (field, value) => {
  emit("update:form", { ...props.form, [field]: value.trim() });
  emit("blur", field);
};

const focusNext = (nextIndex) => {
  const nextInputField = document.getElementById(nextIndex);
  if (nextInputField) nextInputField.focus();
};

import { ref, watch } from "vue";
import { previewBinaryFile } from "../../services/previewBinary.js";
const imageFiles = ref([]);
const selectedPreviewImage = ref(0);
const isUploadImageError = ref(false);
const isFileSizeOver = ref(false);
const chooseBinaryFiles = (event) => {
  for (const file of event.target.files) {
    if (
      file.name.toLowerCase().endsWith(".jpeg") ||
      file.name.toLowerCase().endsWith(".jpg") ||
      file.name.toLowerCase().endsWith(".png")
    ) {
      if (file.size <= 2 * 1024 * 1024) {
         imageFiles.value.push({
        name: file.name,
        url: previewBinaryFile(file),
        file,
      });
      }else{
      isFileSizeOver.value = true;
        setTimeout(() => {
          isFileSizeOver.value = false;
        }, 3000);}
    }
  }
  event.target.value = "";
};

//handle user add image more than four
watch(
  imageFiles,
  (newVal) => {
    if (newVal.length > 4) {
      isUploadImageError.value = true;
      setTimeout(() => {
        isUploadImageError.value = false;
      }, 3000);

      imageFiles.value.splice(4);
    }
  },
  { deep: true }
);

// select image to show a big picture
const choosePreview = (index) => {
  selectedPreviewImage.value = index;
};
const switchImageUp = (index) => {
  const image = imageFiles.value.splice(index, 1)[0]; // move image up
  imageFiles.value.splice(index - 1, 0, image);
};
const switchImageDown = (index) => {
  const image = imageFiles.value.splice(index, 1)[0]; // move image down
  imageFiles.value.splice(index + 1, 0, image);
};

const handleDeleteImage = (index) => {
  imageFiles.value.splice(index, 1);
};
</script>

<template>
  <Alert
    v-if="isUploadImageError == true"
    type="error"
    message="Maximum 4 pictures are allowed."
    class="itbms-message"
    icon="⚠️"
  />
  <Alert
    v-if="isFileSizeOver"
    type="error"
    message="The picture file size cannot be larger than 2MB."
    icon="⚠️"
  />
  <form
    @submit.prevent="$emit('submit', imageFiles)"
    class="grid gap-6 md:grid-cols-12 md:gap-8 bg-white p-4 md:p-10 rounded-xl shadow-lg"
  >
    <!-- LEFT: Picture Upload Area -->
    <div class="md:col-span-4">
      <div
        class="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-lg mb-4 md:mb-6 border border-dashed"
      >
        <span v-show="!imageFiles.length">No picture</span>
        <img
          v-if="imageFiles.length >= 1"
          :src="imageFiles[selectedPreviewImage].url"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="(image, index) in imageFiles"
          :key="index"
          class="w-20 h-20 bg-gray-50 border-2 border-gray-200 p-0.5 relative"
        >
          <img
            :src="image.url"
            class="w-full h-full object-cover"
            :class="`itbms-picture-file${index + 1}`"
            @click="choosePreview(index)"
          />
        </div>
      </div>
      <div class="mt-10">
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
          class="itbms-upload-button font-md p-2 border-2 border-amber-600 rounded-md text-sm text-white bg-amber-500"
        >
          Upload Pictures
        </label>
      </div>
      <div class="mt-5">
        <div v-for="(image, index) in imageFiles" :key="index" class="flex">
          <p :key="index" class="bg-blue-200 px-1 rounded-md text-gray-500 mb-2">
            {{ image.name }}
          </p>
          <button
            type="button"
            @click="handleDeleteImage(index)"
            class="px-3 m-2 text-center bg-red-300 rounded-xl"
          >
            x
          </button>
          <div class="flex flex-col">
            <button
              type="button"
              :disabled="index == 0"
              @click="switchImageUp(index)"
              :class="`itbms-picture-file${index + 1}-up`"
               class="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▲
            </button>
            <button
              type="button"
              :disabled="index == imageFiles.length - 1"
              @click="switchImageDown(index)"
              :class="`itbms-picture-file${index + 1}-down`"
               class="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT: Form Fields -->
    <div class="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      <!-- Brand -->
      <div>
        <label
          class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
          >Brand</label
        >
        <select
          :value="props.form.brandId"
          @blur="trimField('brandId', $event.target.value)"
          @change="updateField('brandId', $event.target.value || '')"
          class="itbms-brand w-full border px-4 py-2 rounded"
        >
          <option value="" hidden>Select brand</option>
          <option
            v-for="brand in brands"
            :key="brand.brandId"
            :value="brand.brandId"
          >
            {{ brand.name }}
          </option>
        </select>
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.brandId }}
        </p>
      </div>

      <!-- Model -->
      <div>
        <label
          class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
          >Model</label
        >
        <input
          id="model"
          type="text"
          :value="props.form.model"
          @input="updateField('model', $event.target.value)"
          @blur="trimField('model', $event.target.value)"
          class="itbms-model w-full border px-4 py-2 rounded"
          @keydown.enter="focusNext('price')"
        />
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.model }}
        </p>
      </div>

      <!-- Price -->
      <div>
        <label
          class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
          >Price</label
        >
        <input
          id="price"
          type="number"
          min="0"
          step="1"
          :value="props.form.price"
          @blur="trimField('price', $event.target.value)"
          @input="
            updateField(
              'price',
              updatePage
                ? $event.target.value
                : Math.max(Number($event.target.value))
            )
          "
          class="itbms-price w-full border px-4 py-2 rounded"
          @keydown.enter="focusNext('quantity')"
        />
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.price }}
        </p>
      </div>

      <!-- Quantity -->
      <div>
        <label
          class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
          >Quantity</label
        >
        <input
          id="quantity"
          type="number"
          min="0"
          step="1"
          :value="props.form.quantity"
          @blur="trimField('quantity', $event.target.value)"
          @input="updateField('quantity', $event.target.value)"
          class="itbms-quantity w-full border px-4 py-2 rounded"
          @keydown.enter="focusNext('ramGb')"
        />
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.quantity }}
        </p>
      </div>

      <!-- RAM -->
      <div>
        <label class="block mb-1 font-medium text-gray-700">RAM (GB)</label>
        <input
          id="ramGb"
          type="number"
          min="1"
          :value="props.form.ramGb"
          @input="updateField('ramGb', $event.target.value)"
          @blur="trimField('ramGb', $event.target.value)"
          class="itbms-ramGb w-full border px-4 py-2 rounded"
          @keydown.enter="focusNext('screenSizeInch')"
        />
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.ramGb }}
        </p>
      </div>

      <!-- Screen Size -->
      <div>
        <label class="block mb-1 font-medium text-gray-700"
          >Screen Size (Inch)</label
        >
        <input
          id="screenSizeInch"
          type="number"
          step="0.01"
          min="0"
          :value="props.form.screenSizeInch"
          @input="updateField('screenSizeInch', $event.target.value)"
          @blur="trimField('screenSizeInch', $event.target.value)"
          class="itbms-screenSizeInch w-full border px-4 py-2 rounded"
          @keydown.enter="focusNext('storageGb')"
        />
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.screenSizeInch }}
        </p>
      </div>

      <!-- Storage -->
      <div>
        <label class="block mb-1 font-medium text-gray-700">Storage (GB)</label>
        <input
          id="storageGb"
          type="number"
          min="1"
          :value="props.form.storageGb"
          @input="updateField('storageGb', $event.target.value)"
          @blur="trimField('storageGb', $event.target.value)"
          class="itbms-storageGb w-full border px-4 py-2 rounded"
          @keydown.enter="focusNext('color')"
        />
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.storageGb }}
        </p>
      </div>

      <!-- Color -->
      <div>
        <label class="block mb-1 font-medium text-gray-700">Color</label>
        <input
          id="color"
          type="text"
          :value="props.form.color"
          @input="updateField('color', $event.target.value)"
          @blur="trimField('color', $event.target.value)"
          class="itbms-color w-full border px-4 py-2 rounded"
          @keydown.enter="focusNext('description')"
        />
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.color }}
        </p>
      </div>

      <!-- Description -->
      <div class="sm:col-span-2">
        <label
          class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
          >Description</label
        >
        <textarea
          id="description"
          :value="props.form.description"
          @input="updateField('description', $event.target.value)"
          @blur="trimField('description', $event.target.value)"
          class="itbms-description w-full border px-4 py-2 rounded resize-none"
        ></textarea>
        <p class="text-red-500 text-sm mt-1 itbms-message">
          {{ props.errors.description }}
        </p>
      </div>
    </div>

    <!-- Buttons -->
    <div
      class="col-span-1 sm:col-span-2 md:col-span-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mt-6 md:mt-10"
    >
      <button
        v-if="!updatePage"
        type="submit"
        :disabled="!isReadyToSubmit || isSubmitting"
        class="itbms-save-button bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        Save
      </button>

      <button
        type="button"
        @click="$emit('cancel')"
        class="itbms-cancel-button border border-gray-400 px-6 py-2 rounded hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
