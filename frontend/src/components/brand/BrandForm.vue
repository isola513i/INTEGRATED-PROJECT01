<script setup>
import { ref, computed } from "vue";
import { useFlashFormStore } from "@/store/useFlashFormStore";
import { useRouter } from "vue-router";

const props = defineProps({
  brandEdit: Object,
});
const emit = defineEmits(["submitForm"]);
const flashForm = useFlashFormStore();

const brand = ref({
  name: "",
  websiteUrl: "",
  isActive: true,
  countryOfOrigin: "",
});

const originalBrand = ref(null);

const changeToEmpty = (input) => {
  return input === null || input === "null" ? "" : input;
};
if (props.brandEdit) {
  brand.value = {
    name: changeToEmpty(props.brandEdit.name),
    websiteUrl: changeToEmpty(props.brandEdit.websiteUrl),
    isActive: props.brandEdit.isActive,
    countryOfOrigin: changeToEmpty(props.brandEdit.countryOfOrigin),
  };
  originalBrand.value = {
    name: changeToEmpty(props.brandEdit.name),
    websiteUrl: changeToEmpty(props.brandEdit.websiteUrl),
    isActive: props.brandEdit.isActive,
    countryOfOrigin: changeToEmpty(props.brandEdit.countryOfOrigin),
  };
}

const router = useRouter();

function submitData() {
  emit("submitForm", brand.value);
}
const handleCancel = () => {
  router.push({ path: "/brands" });
};

const isNoChange = computed(() => {
  return (
    brand.value?.name === originalBrand.value?.name &&
    brand.value?.websiteUrl === originalBrand.value?.websiteUrl &&
    brand.value?.isActive === originalBrand.value?.isActive &&
    brand.value?.countryOfOrigin === originalBrand.value?.countryOfOrigin
  );
});

const isDisabled = computed(() => {
  return isNoChange.value || brand.value.name.trim() === "";
});

const focusNext = (nextIndex) => {
  const nextInputField = document.getElementById(nextIndex);
  if (nextInputField) nextInputField.focus();
};
</script>

<template>
  <div class="flex justify-center">
    <div
      class="w-8/10 border-1 border-gray-400 shadow-md m-5 rounded-md p-5 flex flex-col items-center"
    >
      <p class="text-xl font-semibold">Add new Brand</p>
      <form
        id="brandForm"
        @submit.prevent="submitData"
        class="w-1/2 flex flex-col gap-5"
      >
        <div>
          <div class="flex">
            <label
              class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
              >name
            </label>
            <label v-if="flashForm.message" :class="flashForm.style">
              {{ flashForm.message }}
            </label>
          </div>
          <input
            id="name"
            type="text"
            placeholder="name"
            class="itbms-name w-full border px-4 py-2 rounded"
            v-model.trim="brand.name"
            @keydown.enter="focusNext('websiteUrl')"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium text-gray-700 ml-1"
            >Website URL</label
          >
          <input
            id="websiteUrl"
            type="text"
            placeholder="Website URL"
            class="itbms-websiteUrl w-full border px-4 py-2 rounded"
            v-model.trim="brand.websiteUrl"
            @keydown.enter="focusNext('countryOfOrigin')"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium text-gray-700 ml-1"
            >Country Of Origin</label
          >
          <input
            id="countryOfOrigin"
            type="text"
            placeholder="Country Of Origin"
            class="itbms-countryOfOrigin w-full border px-4 py-2 rounded"
            v-model.trim="brand.countryOfOrigin"
            @keydown.enter="focusNext('isActive')"
          />
        </div>
        <div class="flex justify-center">
          <label class="flex items-center gap-2">
            <span class="block mb-1 font-medium text-gray-700 ml-1"
              >Active</span
            >
            <input
              id="isActive"
              type="checkbox"
              class="itbms-isActive toggle toggle-primary"
              v-model="brand.isActive"
            />
          </label>
        </div>
        <div class="flex justify-center gap-5">
          <button
            type="submit"
            :disabled="isDisabled"
            :class="[
              'itbms-save-button px-5 py-2 text-white rounded-md',
              isDisabled ? 'bg-blue-300' : 'bg-blue-500',
            ]"
          >
            Save
          </button>
          <button
            class="itbms-cancel-button px-5 py-2 border rounded-md"
            @click="handleCancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
