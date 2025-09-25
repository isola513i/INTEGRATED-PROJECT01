<!-- <script setup>
import { ref, computed } from "vue";

const form = ref({ email: "", password: "" });

const isDisabled = computed(
	() => !form.value.email.trim() || !form.value.password.trim()
);

const emit = defineEmits(["submitForm"]);
const props = defineProps({
	errorMessage: { type: String, default: "" },
	loading: { type: Boolean, default: false },
});

const submitData = () => {
	emit("submitForm", { ...form.value });
};

const showPassword = ref(false);
const togglePassword = () => (showPassword.value = !showPassword.value);
const focusNext = (nextId) => {
	const el = document.getElementById(nextId);
	if (el) el.focus();
};
</script>

<template>
	<div class="flex justify-center min-h-screen text-black">
		<form
			@submit.prevent="submitData"
			class="p-8 h-fit w-full max-w-lg space-y-5"
		>
			<h2 class="text-2xl font-bold text-gray-800 text-center">
				Welcome To ITB-MShop
			</h2>

			<div
				v-if="props.errorMessage"
				class="rounded-md border border-red-300 bg-red-50 text-red-700 text-sm p-3 flex items-start gap-2"
			>
				<span aria-hidden="true">⚠️</span>
				<span>{{ props.errorMessage }}</span>
			</div>

			<div>
				<label for="email" class="block mb-2 font-medium text-gray-700"
					>Email</label
				>
				<input
					id="email"
					type="email"
					v-model.trim="form.email"
					autocomplete="email"
					class="w-full border border-gray-300 px-4 py-2.5 rounded-lg bg-white focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
					@keydown.enter="focusNext('password')"
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 font-medium text-gray-700"
					>Password</label
				>
				<div class="relative">
					<input
						id="password"
						:type="showPassword ? 'text' : 'password'"
						v-model.trim="form.password"
						class="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition pr-12"
					/>
					<button
						type="button"
						@click="togglePassword"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
					>
						{{ showPassword ? "🙈" : "👁️" }}
					</button>
				</div>
			</div>
			<div class="pt-1">
				<button
					type="submit"
					:disabled="isDisabled || props.loading"
					:class="[
						'w-full px-6 py-2.5 text-white rounded-lg font-medium shadow-md transition',
						isDisabled || props.loading
							? 'bg-blue-300 cursor-not-allowed'
							: 'bg-blue-500 hover:bg-blue-600',
					]"
				>
					{{ props.loading ? "Signing in…" : "Sign In" }}
				</button>
			</div>
		</form>
	</div>
</template> -->
