<template>
    <div class="flex items-center space-x-2 pt-4 px-4">
      <!-- ปุ่ม Home -->
      <router-link
        v-if="showHomeLink"
        to="/"
        class=" text-black  rounded-md shadowtransition duration-200"
      >
        Home
      </router-link>
  
      <!-- ลูกศร และ Label -->
      <span v-if="currentLabel" class="text-gray-500">›</span>
      <span v-if="currentLabel" class="text-gray-800 font-medium">{{ currentLabel }}</span>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      currentLabel() {
        const routeName = this.$route.name;
        const map = {
            'Landing': null,                  // หน้าแรก ไม่ต้องแสดง label ต่อท้าย
            'SaleItems': 'Sale Items'
            //'SaleItems-Detail': 'Item Detail'
            };
        return map[routeName] || null;
      },
      showHomeLink() {
      return this.$route.name !== 'Landing';
    }
    }
  };
  </script>