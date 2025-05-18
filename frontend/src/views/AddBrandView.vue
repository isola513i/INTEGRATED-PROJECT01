<script setup>
import BrandForm from '@/components/brand/BrandForm.vue';
import {useRouter} from 'vue-router'
const router = useRouter()
</script>
 
<template>
<div class="p-5">
    <div>
      <button
        @click="router.push({path:'/sale-items/list'})"
        class="itbms-items-list text-blue-400 hover:text-blue-200  text-lg  "
      >
        Sale Item List
      </button>
      <span class="text-blue-400"> > </span>
      <button
        @click="router.back()"
        class="itbms-manage-brand text-blue-400 hover:text-blue-200  text-lg  "
      >
        Brand List
      </button>
      <span class="text-blue-400"> > </span>
      <span
        class=" text-blue-400 text-lg font-semibold  "
      >
        Add brand
    </span>
    </div>
    <BrandForm/>
</div>
</template>
 
<style scoped>

</style>