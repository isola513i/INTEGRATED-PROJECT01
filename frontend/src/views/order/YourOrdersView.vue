<script setup>
import { ref, onMounted, computed, watch } from "vue"; // เพิ่ม computed
import { useAuthStore } from "@/store/useAuthStore";
import { fetchOrdersByBuyer } from "@/services/orderService";
import Pagination from "@/components/Pagination/Pagination.vue";

const auth = useAuthStore();
const pagination = ref({ page: 0, totalPages: 1 });
const loading = ref(true);
const error = ref(null);
const selectedTab = ref("Completed");
const allOrders = ref([]);

const loadOrders = async (page = 0) => {
	loading.value = true;
	error.value = null;
	try {
		const response = await fetchOrdersByBuyer(auth.userId, { page });
		allOrders.value = response.content;
		pagination.value = {
			page: response.page,
			totalPages: response.totalPages,
		};
	} catch (e) {
		error.value = e.message || "An error occurred while fetching your orders.";
	} finally {
		loading.value = false;
	}
};

const filteredOrders = computed(() => {
	const statusToFilter = selectedTab.value.toUpperCase();
	return allOrders.value.filter(
		(order) => order.orderStatus === statusToFilter
	);
});

const formatDate = (isoString) => {
	if (!isoString) return "-";
	return new Date(isoString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const formatNumber = (num) => {
	return Number(num || 0).toLocaleString("en-US");
};

watch(selectedTab, () => {
	loadOrders(0);
});

onMounted(() => {
	if (auth.isLoggedIn) {
		loadOrders();
	} else {
		loading.value = false;
		error.value = "Please log in to see your orders.";
	}
});
</script>

<template>
	<div class="bg-gray-50 min-h-screen py-8">
		<div class="max-w-4xl mx-auto px-4">
			<h1 class="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>

			<div class="mb-6 border-b border-gray-200">
				<nav class="flex space-x-4" aria-label="Tabs">
					<button
						@click="selectedTab = 'Completed'"
						:class="[
							'itbms-completed-orders-button px-3 py-2 font-medium text-sm rounded-t-lg',
							selectedTab === 'Completed'
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
						]"
					>
						Completed
					</button>
					<button
						@click="selectedTab = 'Canceled'"
						:class="[
							'itbms-canceled-orders-button px-3 py-2 font-medium text-sm rounded-t-lg',
							selectedTab === 'Canceled'
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
						]"
					>
						Canceled
					</button>
				</nav>
			</div>

			<div v-if="loading" class="text-center py-10 text-gray-500">
				Loading your orders...
			</div>

			<div
				v-else-if="error"
				class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg"
			>
				{{ error }}
			</div>

			<div
				v-else-if="filteredOrders.length === 0"
				class="text-center py-10 text-gray-500"
			>
				You have no {{ selectedTab.toLowerCase() }} orders.
			</div>

			<div v-else class="space-y-6">
				<router-link
					v-for="order in filteredOrders"
					:key="order.id"
					:to="`/your-orders/${order.id}`"
					class="itbms-row block bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200"
				>
					<div
						class="bg-gray-50 p-4 border-b grid grid-cols-2 md:grid-cols-5 gap-4 text-sm"
					>
						<div>
							<div class="font-semibold text-gray-500">ORDER PLACED</div>
							<div class="itbms-order-date text-gray-800">
								{{ formatDate(order.orderDate) }}
							</div>
						</div>
						<div>
							<div class="font-semibold text-gray-500">TOTAL</div>
							<div class="itbms-total-order-price text-gray-800">
								฿{{ formatNumber(order.totalAmount) }}
							</div>
						</div>
						<div>
							<div class="font-semibold text-gray-500">SELLER</div>
							<div class="itbms-nickname text-gray-800">
								{{ order.seller.userName }}
							</div>
						</div>
						<div class="hidden md:block">
							<div class="font-semibold text-gray-500">STATUS</div>
							<div class="itbms-order-status text-gray-800">
								{{ order.orderStatus }}
							</div>
						</div>
						<div class="text-right">
							<div class="font-semibold text-gray-500">ORDER NO.</div>
							<div class="itbms-order-id text-gray-800">
								{{ order.orderNo }}
							</div>
						</div>
					</div>

					<div class="p-4">
						<div class="mb-4">
							<p class="font-semibold text-gray-800">
								Shipped To:
								<span class="itbms-shipping-address font-normal">{{
									order.shippingAddress
								}}</span>
							</p>
							<p v-if="order.orderNote" class="text-sm text-gray-600">
								Note:
								<span class="itbms-order-note">{{ order.orderNote }}</span>
							</p>
						</div>

						<div class="space-y-4">
							<div
								v-for="item in order.orderItems"
								:key="item.no"
								class="itbms-item-row flex items-center gap-4"
							>
								<div
									class="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0"
								>
									<img
										:src="item.imageUrl"
										:alt="item.description"
										class="w-full h-full object-cover"
									/>
								</div>
								<div class="flex-grow">
									<p
										class="itbms-item-description font-semibold text-gray-800 text-sm"
									>
										{{ item.description }}
									</p>
								</div>
								<div class="text-sm text-gray-600">
									Qty:
									<span class="itbms-item-quantity font-medium text-gray-800">{{
										item.quantity
									}}</span>
								</div>
								<div
									class="text-sm font-semibold text-gray-800 w-24 text-right"
								>
									Price:
									<span class="itbms-item-total-price"
										>฿{{ formatNumber(item.price * item.quantity) }}</span
									>
								</div>
							</div>
						</div>
					</div>
				</router-link>
				<div class="flex flex-col items-center mt-8">
					<Pagination
						:current-page="pagination.page"
						:total-pages="pagination.totalPages"
						@update:page="loadOrders"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
