<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserProfile } from "@/services/userService";
import { useFlashStore } from "@/store/useFlashStore";

const router = useRouter();
const auth = useAuthStore();
const flash = useFlashStore();

const profile = ref(null);
const loading = ref(true);
const errorMsg = ref("");

const isSeller = computed(
	() => (profile.value?.userType || "").toUpperCase() === "SELLER"
);

async function load() {
	loading.value = true;
	errorMsg.value = "";
	try {
		const data = await getUserProfile(auth.userId);
		profile.value = data;
	} catch (e) {
		errorMsg.value = e?.message || "Cannot load profile";
	} finally {
		loading.value = false;
	}
}

function goEdit() {
	router.push({ name: "ProfileEditView" });
}

onMounted(load);
</script>

<template>
	<div class="min-h-[calc(100vh-80px)">
		<!-- Breadcrumbs + Left hint -->
		<div class="container mx-auto px-4 mt-4">
			<div class="flex items-center justify-between text-sm text-gray-500">
				<div>
					<router-link to="/" class="text-blue-600 hover:underline"
						>Home</router-link
					>
					<span class="mx-2">›</span>
					<span>Profile</span>
				</div>
			</div>
		</div>
i
		<!-- Content -->
		<div class="container mx-auto px-4 py-8">
			<!-- Flash message -->
			<div v-if="flash.message" :class="flash.style" class="px-4 mb-4">
				{{ flash.message }}
			</div>
			<div class="max-w-2xl mx-auto">
				<!-- Card -->
				<div class="bg-blue-100 rounded-xl shadow p-6 md:p-8 text-center">
					<!-- Avatar -->
					<div
						class="mx-auto -mt-16 mb-2 w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center ring-4 ring-white shadow"
					>
						<svg
							class="w-9 h-9 text-white"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5Z"
							/>
						</svg>
					</div>

					<div v-if="loading" class="py-6 text-gray-500">Loading…</div>
					<div v-else-if="errorMsg" class="py-6 text-red-600">
						{{ errorMsg }}
					</div>

					<template v-else>
						<!-- Display fields (match sample) -->
						<p class="text-sm text-black">
							<span class="font-semibold">Nickname : </span>
							<span data-testid="itbms-nickname">{{ profile.nickName }}</span>
						</p>
						<p class="text-sm mt-2 text-black">
							<span class="font-semibold">Email : </span>
							<span data-testid="itbms-email">{{ profile.email }}</span>
						</p>
						<p class="text-sm mt-2 text-black">
							<span class="font-semibold">Fullname : </span>
							<span data-testid="itbms-fullname">{{ profile.fullName }}</span>
						</p>
						<p class="text-sm mt-2 text-black">
							<span class="font-semibold">Type : </span>
							<span data-testid="itbms-type">{{ profile.userType }}</span>
						</p>

						<!-- Seller extra (masked from BE) -->
						<template v-if="isSeller">
							<p class="text-sm mt-2 text-black">
								<span class="font-semibold">Mobile : </span>
								<span data-testid="itbms-mobile">{{
									profile.phoneNumber
								}}</span>
							</p>
							<p class="text-sm mt-2 text-black">
								<span class="font-semibold">Bank Account No : </span>
								<span data-testid="itbms-bankAccount">{{
									profile.bankAccount
								}}</span>
							</p>
							<p class="text-sm mt-2 text-black">
								<span class="font-semibold">Bank Name : </span>
								<span data-testid="itbms-bankName">{{ profile.bankName }}</span>
							</p>
						</template>

						<!-- Edit button -->
						<div class="mt-6">
							<button
								data-testid="itbms-profile-button"
								@click="goEdit"
								class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
							>
								Edit Profile
							</button>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
