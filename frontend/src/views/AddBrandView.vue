<script setup>
import BrandForm from "@/components/brand/BrandForm.vue";
import { useRouter } from "vue-router";
import { addBrand } from "@/services/saleItemService";
import { useFlashStore} from "@/store/useFlashStore.js";
import {useFlashFormStore} from "@/store/useFlashFormStore.js";

const router = useRouter();
const flash = useFlashStore()
const flashForm = useFlashFormStore()

const validator = (input) => {
  if (typeof input.name !== "string" || input.name === "" || /^[^a-zA-Z0-9]+$/.test(input.name)) return false;
  if(input.websiteUrl !== "string" || input.websiteUrl === "") input.websiteUrl = null
  if(input.countryOfOrigin !== "string" || input.countryOfOrigin === "") input.countryOfOrigin = null
  return true;
};
const handleSubmitForm = async (brand) => {
  const formData = new FormData();
  
  if(!validator(brand)){
    flashForm.setMessage(`Please add correct brand's name`, "m-1 p-1 px-2 bg-red-100 text-red-800 shadow itbms-message rounded-md")
    return false
  } 
  formData.append("name", brand.name);
  formData.append("websiteUrl", brand.websiteUrl);
  formData.append("isActive", brand.isActive);
  formData.append("countryOfOrigin", brand.countryOfOrigin);
  // send object from emit
  try {
    const res = await addBrand(formData);

    if (res.status === 201) {
      flash.setMessage(
        	"The brand has been added.",
        	"itbms-message m-4 p-4 bg-green-100 text-green-800 shadow"
      );
	  router.back()
    }else if(res.status === 400){
      flashForm.setMessage(`Brand name : ${formData.get('name').toLocaleUpperCase()} has been already existed`, "m-1 p-1 px-2 bg-red-100 text-red-800 shadow itbms-message rounded-md")
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
      <span class="text-blue-400 text-lg font-semibold"> Add brand </span>
    </div>
    <BrandForm @submitForm="handleSubmitForm" />
  </div>
</template>

<style scoped></style>
