<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchSellerOrderDetail } from "@/services/orderService";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const order = ref(null);
const loading = ref(true);
const error = ref(null);

const formatDate = (isoString) => {
	if (!isoString) return "-";
	return new Date(isoString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");

onMounted(async () => {
	if (!auth.isLoggedIn || auth.user?.userType !== "SELLER") {
		router.push("/signin"); // Redirect if not logged in or not a seller
		return;
	}

	const orderId = route.params.orderId;
	const sellerId = auth.userId;

	try {
		// Fetching detail automatically marks it as viewed on the backend
		const response = await fetchSellerOrderDetail(sellerId, orderId);
		order.value = response;
	} catch (e) {
		error.value = e.message || "Could not load order details.";
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<div class="bg-gray-50 min-h-screen py-8">
		<div class="max-w-4xl mx-auto px-4">
			<div class="mb-6">
				<router-link
					to="/sale-orders"
					class="itbms-sale-orders-button text-blue-600 hover:underline text-lg"
				>
					Sale Orders
				</router-link>
				<span class="mx-2 text-gray-500">›</span>
				<span class="text-lg font-semibold text-gray-800">Order Details</span>
			</div>

			<div v-if="loading" class="text-center py-10 text-gray-500">
				Loading details...
			</div>
			<div
				v-else-if="error"
				class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg"
			>
				{{ error }}
			</div>

			<div
				v-else-if="order"
				class="bg-white border border-gray-200 rounded-lg shadow-sm"
			>
				<div class="p-6 border-b">
					<div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
						<div>
							<p class="font-semibold text-gray-600">Order No:</p>
							<p class="text-gray-800">{{ order.id }}</p>
						</div>
						<div>
							<p class="font-semibold text-gray-600">Buyer:</p>
							<p class="text-gray-800">{{ order.buyer?.username ?? "N/A" }}</p>
						</div>
						<div>
							<p class="font-semibold text-gray-600">Order Date:</p>
							<p class="text-gray-800">{{ formatDate(order.orderDate) }}</p>
						</div>
						<div>
							<p class="font-semibold text-gray-600">Payment Date:</p>
							<p class="text-gray-800">{{ formatDate(order.paymentDate) }}</p>
						</div>
						<div>
							<p class="font-semibold text-gray-600">Total:</p>
							<p class="text-gray-800 font-bold">
								฿{{ formatNumber(order.totalAmount) }}
							</p>
						</div>
						<div>
							<p class="font-semibold text-gray-600">Status:</p>
							<p class="text-gray-800">{{ order.orderStatus }}</p>
						</div>
					</div>
					<div
						class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm"
					>
						<div>
							<p class="font-semibold text-gray-600">Shipped To:</p>
							<p class="text-gray-800">{{ order.shippingAddress }}</p>
						</div>
						<div v-if="order.orderNote">
							<p class="font-semibold text-gray-600">Note:</p>
							<p class="text-gray-800">{{ order.orderNote }}</p>
						</div>
					</div>
				</div>

				<div class="p-6 space-y-4">
					<div
						v-for="item in order.orderItems"
						:key="item.no"
						class="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0"
					>
						<div
							class="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0"
						>
							<img
								:src="item.imageUrl"
								:alt="item.description"
								class="w-full h-full object-cover"
							/>
						</div>
						<div class="flex-grow">
							<p class="font-semibold text-gray-800 text-sm">
								{{ item.description }}
							</p>
						</div>
						<div class="text-sm text-gray-600 w-20 text-center">
							<p class="font-semibold">Qty:</p>
							<p>{{ item.quantity }}</p>
						</div>
						<div class="text-sm text-gray-600 w-28 text-right">
							<p class="font-semibold">Unit Price:</p>
							<p class="itbms-item-price">฿{{ formatNumber(item.price) }}</p>
						</div>
						<div class="text-sm font-bold text-gray-800 w-28 text-right">
							<p class="font-semibold">Price:</p>
							<p class="itbms-item-total-price">
								฿{{ formatNumber(item.price * item.quantity) }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
