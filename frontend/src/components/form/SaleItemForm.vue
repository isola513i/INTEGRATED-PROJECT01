<script setup>
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
</script>

<template>
  <form
    @submit.prevent="$emit('submit')"
    class="grid gap-6 md:grid-cols-12 md:gap-8 bg-white p-4 md:p-10 rounded-xl shadow-lg"
  >
    <!-- LEFT: Picture Upload Area -->
    <div class="md:col-span-4">
      <div
        class="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-lg text-gray-400 rounded-lg mb-4 md:mb-6 border border-dashed"
      >
        No Picture
      </div>
      <div class="grid grid-cols-4 gap-2 md:gap-4">
        <div
          v-for="n in 4"
          :key="n"
          class="w-12 h-12 md:w-16 md:h-16 bg-gray-50 text-xs text-gray-400 border flex justify-center items-center rounded-lg"
        >
          +
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
          @change="updateField('brandId', Number($event.target.value) || '')"
          class="itbms-brand w-full border px-4 py-2 rounded"
        >
          <option value="" disabled>Select brand</option>
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
                : Math.max(0, Number($event.target.value)),
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
          min="1"
          step="1"
          :value="props.form.quantity"
          @blur="trimField('quantity', $event.target.value)"
          @input="
            updateField('quantity', Math.max(0, Number($event.target.value)))
          "
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
          @input="updateField('ramGb', Number($event.target.value))"
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
          @input="updateField('screenSizeInch', Number($event.target.value))"
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
          @input="updateField('storageGb', Number($event.target.value))"
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
        {{ isSubmitting ? "Saving..." : "Save" }}
      </button>

      <button
        v-if="updatePage"
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
