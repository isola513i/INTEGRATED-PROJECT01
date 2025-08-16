<script setup>
import { useRoute, useRouter } from "vue-router";
import BrandForm from "@/components/brand/BrandForm.vue";
import { onMounted, ref } from "vue";
import { fetchBrandById, updateBrand, addBrand } from "@/services/brandService";
import { useFlashFormStore } from "@/store/useFlashFormStore";
import { useFlashStore } from "@/store/useFlashStore";
import { brandValidations } from "@/validators/useBrandValidation.js";
const {
  correctBrandFormat,
  numberOfNameChar,
  numberOfCountryOfOriginChar,
  validWebsiteUrl,
} = brandValidations();

const route = useRoute();
const router = useRouter();
const flashForm = useFlashFormStore();
const flash = useFlashStore();

const brand = ref({});
onMounted(async () => {
  if (route.params.brandId) {
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
  }
});

const handleSubmitForm = async (brand) => {
  if (!correctBrandFormat(brand)) return false;
  if (!numberOfNameChar(brand.name)) return false;
  if (!numberOfCountryOfOriginChar(brand.countryOfOrigin)) return false;
  if (!validWebsiteUrl(brand.websiteUrl)) return false;

  const submitBrand = {
    name: brand.name,
    websiteUrl: brand.websiteUrl,
    isActive: brand.isActive,
    countryOfOrigin: brand.countryOfOrigin,
  };
  if (route.params.brandId) {
    try {
      const res = await updateBrand(route.params.brandId, submitBrand);
      if (res.status !== 400) {
        flash.setMessage(
          "✅ The brand has been updated.",
          "itbms-message m-4 p-4 bg-green-100 text-green-800 shadow ",
        );
        router.back();
      }
      if (res.status === 400) {
        flash.setMessage(
          `Brand name: ${submitBrand.name} already existed.`,
          "m-1 p-1 px-2 bg-red-100 text-red-800 shadow itbms-message rounded-md",
        );
        router.back();
      }
    } catch (error) {
      console.error("Error adding brand:", error);
    }
  } else {
    try {
      const res = await addBrand(submitBrand);
      if (res === null) {
        flash.setMessage(
          `Brand name: ${submitBrand.name} already existed.`,
          "m-1 p-1 px-2 bg-red-100 text-red-800 shadow itbms-message rounded-md",
        );
        router.back();
      } else {
        flash.setMessage(
          "The brand has been added.",
          "itbms-message m-4 p-4 bg-green-100 text-green-800 shadow",
        );
        router.back();
      }
    } catch (error) {
      console.error("Error adding brand:", error);
    }
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
    <BrandForm v-if="!brand.id" @submitForm="handleSubmitForm" />
  </div>
</template>

<style scoped></style>
