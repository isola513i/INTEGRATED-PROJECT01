<script setup>
import { formToJSON } from "axios";
import { ref } from "vue";

const brand = ref({name:'',websiteUrl:'',isActive:true,countryOfOrigin:''})
const validator = (input) =>{
  if (typeof input !== 'string' || input === '') return false;
  return true
} 
const submitForm = async () => {
  const formData = new FormData();
    validator(brand.value.name)
    formData.append('name',brand.value.name)
    formData.append('websiteUrl',brand.value.websiteUrl)
    formData.append('isActive',brand.value.isActive)
    formData.append('countryOfOrigin',brand.value.countryOfOrigin)

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
        @submit.prevent="submitForm"
        class="w-1/2 flex flex-col gap-5"
      >
        <div>
          <label
            class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
            >name</label
          >
          <input
            type="text"
            placeholder="name"
            class="itbms-name w-full border px-4 py-2 rounded"
            v-model.trim="brand.name"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium text-gray-700 ml-1"
            >Website URL</label
          >
          <input
            type="text"
            placeholder="Website URL"
            class="itbms-websiteUrl w-full border px-4 py-2 rounded"
            v-model.trim="brand.websiteUrl"
          />
        </div>
        <div>
          <label class="flex items-center gap-2">
            <span class="block mb-1 font-medium text-gray-700 ml-1"
              >Active</span
            >
            <input
              type="checkbox"
              class="itbms-isActive toggle toggle-primary"
              v-model="brand.isActive"
            />
          </label>
        </div>
        <div>
          <label class="block mb-1 font-medium text-gray-700 ml-1"
            >Country Of Origin</label
          >
          <input
            type="text"
            placeholder="Country Of Origin"
            class="itbms-countryOfOrigin w-full border px-4 py-2 rounded"
            v-model.trim="brand.countryOfOrigin"
          />
        </div>

        <div class="flex justify-center gap-5">
          <button type="submit" class="itbms-save-button px-5 py-2 bg-blue-500 text-white rounded-md ">Save</button>
          <button class="itbms-cancel-button px-5 py-2 border rounded-md">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
