<script setup>
import {ref} from "vue";
import { RouterView } from "vue-router";
import Navbar from "./components/layout/Navbar.vue";
import Footer from "./components/layout/Footer.vue";
import Register from "./components/layout/RegisterBanner.vue";

const isLogin = ref(false)
const nickName = localStorage.getItem('nickname')
if(nickName){
  isLogin.value = true
}

</script>

<template>
   <div class="bg-[#ffffff]">
    
    <!-- Register Bar -->
    <Register v-show="!isLogin" class="top-0 left-0 w-full  h-10" />

    <!-- Navbar -->
    <Navbar class="top-10 left-0 w-full h-16" />

    <!-- Main content (เว้น padding-top = Register + Navbar) -->
    <main class="pt-[104px]">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped></style>
