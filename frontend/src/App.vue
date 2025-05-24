<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/layout/Navbar.vue";
import Footer from "./components/layout/Footer.vue";
</script>
<template>
	<div class="bg-[#ffffff]">
		<Navbar />
		<main class="pt-15">
			<RouterView />
		</main>

		<Footer />
	</div>
</template>

<style scoped></style>
