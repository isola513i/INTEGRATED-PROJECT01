<script setup>
import { ref, computed, watchEffect, watch } from "vue";
import { useFlashFormStore } from "@/store/useFlashFormStore";
import { useRouter } from "vue-router";
import { brandValidations } from "@/validators/useBrandValidation.js";
const {
  correctBrandFormat,
  numberOfNameChar,
  numberOfCountryOfOriginChar,
  validWebsiteUrl,
} = brandValidations();

const props = defineProps({
  brandEdit: Object,
});

const emit = defineEmits(["submitForm"]);
const flashForm = useFlashFormStore();

const nameMsg = ref(null);
const websiteUrlMsg = ref(null);
const countryOfOriginMsg = ref(null);

flashForm.messages.forEach((messageObj) => {
  if (messageObj.name === "name") nameMsg.value = messageObj;
  if (messageObj.name === "websiteUrl") websiteUrlMsg.value = messageObj;
  if (messageObj.name === "countryOfOrigin")
    countryOfOriginMsg.value = messageObj;
});

watchEffect(() => {
  nameMsg.value = flashForm.messages.find((msg) => msg.name === "name") || null;
  websiteUrlMsg.value =
    flashForm.messages.find((msg) => msg.name === "websiteUrl") || null;
  countryOfOriginMsg.value =
    flashForm.messages.find((msg) => msg.name === "countryOfOrigin") || null;
});

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
  flashForm.clearAllMessages();
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
  return (
    isNoChange.value ||
    brand.value.name.trim() === "" ||
    !numberOfNameChar(brand.value.name) ||
    !numberOfCountryOfOriginChar(brand.value.countryOfOrigin) ||
    !validWebsiteUrl(brand.value.websiteUrl)
  );
});

watch(
  () => brand.value.name,
  () => numberOfNameChar(brand.value.name),
);
watch(
  () => brand.value.countryOfOrigin,
  () => numberOfCountryOfOriginChar(brand.value.countryOfOrigin),
);
watch(
  () => brand.value.websiteUrl,
  () => validWebsiteUrl(brand.value.websiteUrl),
);

const onNameChange = () => {
  numberOfNameChar(brand.value.name);
};
const onCountryOfOriginChange = () => {
  numberOfCountryOfOriginChar(brand.value.countryOfOrigin);
};
const onWebsiteUrlChange = () => {
  validWebsiteUrl(brand.value.websiteUrl);
};

const focusNext = (nextIndex) => {
  const nextInputField = document.getElementById(nextIndex);
  if (nextInputField) nextInputField.focus();
};
</script>

<template>
  <div class="flex justify-center text-black">
    <div
      class="w-full md:w-5/10 border border-gray-800 shadow-md m-5 rounded-md p-1 py-3 md:p-5 flex flex-col items-center"
    >
      <p class="text-xl font-semibold">Add new Brand</p>
      <form
        id="brandForm"
        @keydown.enter.prevent
        @submit.prevent="submitData"
        class="md:w-3/5 w-8/10 flex flex-col gap-5"
      >
        <div>
          <div class="flex">
            <label
              class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
              >name
            </label>
          </div>
          <input
            id="name"
            type="text"
            placeholder="name"
            class="itbms-name w-full border px-4 py-2 rounded"
            v-model.trim="brand.name"
            @change="onNameChange"
            @keydown.enter.prevent="focusNext('websiteUrl')"
          />
          <div class="mt-4">
            <label v-if="nameMsg" :class="nameMsg.style">
              {{ nameMsg.message }}
            </label>
          </div>
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
            @keydown.enter.prevent="focusNext('countryOfOrigin')"
            @change="onWebsiteUrlChange"
          />
          <div class="mt-4">
            <label v-if="websiteUrlMsg" :class="websiteUrlMsg.style">
              {{ websiteUrlMsg.message }}
            </label>
          </div>
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
            @keydown.enter.prevent="focusNext('isActive')"
            @change="onCountryOfOriginChange"
          />
          <div class="mt-4">
            <label v-if="countryOfOriginMsg" :class="countryOfOriginMsg.style">
              {{ countryOfOriginMsg.message }}
            </label>
          </div>
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
            save
          </button>
          <button
            type="button"
            class="itbms-cancel-button px-5 py-2 border rounded-md"
            @click="handleCancel()"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
