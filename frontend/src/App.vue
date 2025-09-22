<!-- App.vue -->
<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import Navbar from "./components/layout/Navbar.vue";
import Footer from "./components/layout/Footer.vue";
import Register from "./components/layout/RegisterBanner.vue";

const isLogin = ref(false);
const nickName = localStorage.getItem("nickname");
if (nickName) isLogin.value = true;
</script>

<template>
	<div class="bg-white">
		<Register v-show="!isLogin" class="w-full h-10" />
		<Navbar class="w-full h-16" />
		<main>
			<RouterView />
		</main>
		<Footer />
	</div>
</template>
