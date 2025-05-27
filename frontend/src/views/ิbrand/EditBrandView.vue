<script setup>
import { useRoute, useRouter } from "vue-router";
import BrandForm from "@/components/brand/BrandForm.vue";
import { onMounted, ref } from "vue";
import { fetchBrandById, updateBrand } from "@/services/brandService";
import { useFlashFormStore } from "@/store/useFlashFormStore";
import { useFlashStore } from "@/store/useFlashStore";

const route = useRoute();
const router = useRouter();
const flashForm = useFlashFormStore();
const flash = useFlashStore();

const brand = ref({});
onMounted(async () => {
  try {
    const brandId = parseInt(route.params.brandId);
    if (isNaN(brandId)) throw new Error("Invalid ID");
    const res = await fetchBrandById(brandId);
    brand.value = res;
  } catch (error) {
    console.error("Fetch failed:", error);
    flash.setMessage(
      "The brand does not exist.",
      "itbms-message m-4 p-4 bg-red-100 text-red-800 shadow ",
    );
    router.push("/brands");
  }
});

const validator = (input) => {
  if (
    typeof input.name !== "string" ||
    input.name === "" ||
    /^[^a-zA-Z0-9]+$/.test(input.name)
  )
    return false;
  if (input.websiteUrl === "") input.websiteUrl = null;
  if (input.countryOfOrigin === "") input.countryOfOrigin = null;
  return true;
};
const handleSubmitForm = async (brand) => {
  const formData = new FormData();

  if (!validator(brand)) {
    flashForm.setMessage(
      `Please add correct brand's name`,
      "m-1 p-1 px-2 bg-red-100 text-red-800 shadow itbms-message rounded-md",
    );
    return false;
  }
  formData.append("name", brand.name);
  formData.append("websiteUrl", brand.websiteUrl);
  formData.append("isActive", brand.isActive);
  formData.append("countryOfOrigin", brand.countryOfOrigin);
  // send object from emit
  try {
    const res = await updateBrand(route.params.brandId, formData);

    if (res.status === 200) {
      flash.setMessage(
        "✅ The brand has been updated.",
        "itbms-message m-4 p-4 bg-green-100 text-green-800 shadow ",
      );
      router.back();
    } else if (res.status === 400) {
      flashForm.setMessage(
        `Brand name : ${formData.get("name").toLocaleUpperCase()} has been already existed`,
        "itbms-message m-1 p-1 px-2 bg-red-100 text-red-800 shadow  rounded-md",
      );
    } else if (res.status === 500) {
      flash.setMessage(
        "✅ The brand could not be added.",
        "itbms-message m-1 p-1 px-2 bg-red-100 text-red-800 shadow  rounded-md",
      );
    } else {
      console.warn("Unexpected status:", res.status);
    }
  } catch (error) {
    console.error("Error adding brand:", error);
  }
};
</script>

<template>
  <div class="p-5">
    <div>
      <button
        @click="router.push({ path: '/sale-items/list' })"
        class="itbms-items-list text-blue-400 hover:text-blue-200 text-lg"
      >
        Sale Item List
      </button>
      <span class="text-blue-400"> > </span>
      <button
        @click="router.back()"
        class="itbms-manage-brand text-blue-400 hover:text-blue-200 text-lg"
      >
        Brand List
      </button>
      <span class="text-blue-400"> > </span>
      <span class="text-blue-400 text-lg font-semibold"> Edit brand</span>
    </div>
    <BrandForm
      v-if="brand.id"
      @submitForm="handleSubmitForm"
      :brandEdit="brand"
    />
  </div>
</template>

<style scoped></style>
