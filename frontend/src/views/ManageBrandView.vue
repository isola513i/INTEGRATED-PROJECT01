<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted , ref } from "vue";
import BrandList from "@/components/brand/BrandList.vue";
import { fetchBrands } from "@/services/saleItemService";

const router = useRouter();
const brands= ref([])
const errorMessage = ref("");

onMounted(async () => {
	try {
		brands.value = await fetchBrands();
        console.log(brands.value)
	} catch (error) {
		errorMessage.value = "Failed to load brands";
	}
});
</script>

<template>
  <div class="p-2">
    <div>
      <button
        @click="router.back()"
        class="itbms-items-list text-blue-400 hover:text-blue-200  text-lg  "
      >
        Sale Item List
      </button>
      <span class="text-blue-400"> > </span>
      <button
      @click="router.push({path:'brands/add'})"
        class="itbms-add-button text-blue-400 hover:text-blue-200 text-lg "
      >
        Add brand
      </button>
    </div>
    <BrandList
    v-if="brands.length!==0" 
    :items="brands"/>
  </div>
</template>

<style scoped></style>
