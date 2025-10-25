<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";

import { fetchOrdersBySeller } from "@/services/orderService";
import Pagination from "@/components/Pagination/Pagination.vue";

const router = useRouter();
const auth = useAuthStore();
const orderStore = useOrderStore();

const orders = ref([]);
const pagination = ref({ page: 0, totalPages: 1 });
const loading = ref(true);
const error = ref(null);

// tabs
const selectedTab = ref("New Orders"); // default tab
const tabStatusMap = {
  "New Orders": "new",
  "Canceled Orders": "canceled",
  "All Orders": "all",
};

// helpers
const formatDate = (isoString) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");

// เมื่อ seller คลิกเข้าไปดูออเดอร์นี้
const viewDetails = (orderId) => {
  orderStore.decrementPending(); // ลดจาก 5 → 4 แบบทันที
  router.push(`/sale-orders/${orderId}`);
};

// โหลดรายการตามแท็บ + หน้า
const loadOrders = async (page = 0) => {
  if (!auth.userId) return;

  loading.value = true;
  error.value = null;

  const currentApiStatus = tabStatusMap[selectedTab.value];
  try {
    const response = await fetchOrdersBySeller(auth.userId, {
      status: currentApiStatus,
      page,
    });

    orders.value = (response.content || []).map((o) => {
      const totalAmount = (o.orderItems || []).reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );
      return {
        ...o,
        totalAmount,
      };
    });
    pagination.value = {
      page: response.page,
      totalPages: response.totalPages,
    };

    // 👇⚠️ ไม่ล้าง pendingCount ตรงนี้แล้ว
    // เดี๋ยวเราจะล้างเฉพาะตอนกด View เข้าไปดู detail เท่านั้น
  } catch (e) {
    error.value = e.message || "An error occurred while fetching orders.";
    orders.value = [];
    pagination.value = { page: 0, totalPages: 1 };
  } finally {
    loading.value = false;
  }
};

// เวลาเปลี่ยนแท็บก็โหลดใหม่ (ไม่ล้าง badge)
watch(selectedTab, () => {
  loadOrders(0);
});

onMounted(async () => {
  await orderStore.refreshPendingCount();
  await loadOrders(0);
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Sale Orders</h1>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex space-x-4" aria-label="Tabs">
          <!-- New Orders tab -->
          <button
            @click="selectedTab = 'New Orders'"
            :class="[
              'itbms-new-orders-button px-3 py-2 font-medium text-sm rounded-t-lg flex items-center gap-2',
              selectedTab === 'New Orders'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            <span>New Orders</span>

            <!-- badge: ตอนนี้จะยังโชว์อยู่ จนกว่าจะกด View -->
            <span
              v-if="orderStore.pendingCount > 0"
              class="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white"
            >
              {{ orderStore.pendingCount }}
            </span>
          </button>

          <!-- Canceled tab -->
          <button
            @click="selectedTab = 'Canceled Orders'"
            :class="[
              'itbms-canceled-orders-button px-3 py-2 font-medium text-sm rounded-t-lg',
              selectedTab === 'Canceled Orders'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Canceled Orders
          </button>

          <!-- All tab -->
          <button
            @click="selectedTab = 'All Orders'"
            :class="[
              'itbms-all-orders-button px-3 py-2 font-medium text-sm rounded-t-lg',
              selectedTab === 'All Orders'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            All Orders
          </button>
        </nav>
      </div>

      <!-- states -->
      <div v-if="loading" class="text-center py-10 text-gray-500">
        Loading orders...
      </div>

      <div
        v-else-if="error"
        class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg"
      >
        {{ error }}
      </div>

      <div
        v-else-if="orders.length === 0"
        class="text-center py-10 text-gray-500"
      >
        You have no {{ selectedTab.toLowerCase() }}.
      </div>

      <!-- list -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        >
          <!-- header row -->
          <div
            class="bg-gray-50 p-4 border-b grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm items-center"
          >
            <div>
              <div class="font-semibold text-gray-500">BUYER</div>
              <div class="itbms-nickname text-gray-800">
                {{ order.buyer?.username ?? "N/A" }}
              </div>
            </div>

            <div>
              <div class="font-semibold text-gray-500">ORDER #</div>
              <div class="text-gray-800">{{ order.id }}</div>
            </div>

            <div>
              <div class="font-semibold text-gray-500">ORDER DATE</div>
              <div class="text-gray-800">{{ formatDate(order.orderDate) }}</div>
            </div>

            <div>
              <div class="font-semibold text-gray-500">PAYMENT DATE</div>
              <div class="text-gray-800">
                {{ formatDate(order.paymentDate) }}
              </div>
            </div>

            <div>
              <div class="font-semibold text-gray-500">TOTAL</div>
              <div class="text-gray-800 font-semibold">
                ฿{{ formatNumber(order.totalAmount) }}
              </div>
            </div>

            <div class="text-right">
              <div class="font-semibold text-gray-500">STATUS</div>
              <div class="text-gray-800">{{ order.orderStatus }}</div>
            </div>
          </div>

          <!-- body row -->
          <div
            class="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div class="text-sm w-full md:w-1/3">
              <p class="font-semibold text-gray-800">
                Shipped To:
                <span class="font-normal">{{ order.shippingAddress }}</span>
              </p>
              <p v-if="order.orderNote" class="text-gray-600 mt-1">
                Note: <span>{{ order.orderNote }}</span>
              </p>
            </div>

            <div class="flex-grow space-y-2 w-full md:w-auto">
              <div
                v-for="item in order.orderItems"
                :key="item.no"
                class="flex items-center gap-3 border-b pb-2 last:border-b-0 last:pb-0"
              >
                <div
                  class="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0"
                >
                  <img
                    :src="item.imageUrl"
                    :alt="item.description"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div class="flex-grow">
                  <p class="font-semibold text-gray-800 text-xs">
                    {{ item.description }}
                  </p>
                </div>

                <div class="text-xs text-gray-600">
                  Qty:
                  <span class="font-medium text-gray-800">
                    {{ item.quantity }}
                  </span>
                </div>

                <div
                  class="text-xs font-semibold text-gray-800 w-20 text-right"
                >
                  Price:
                  {{ formatNumber(item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <div class="flex-shrink-0 mt-4 md:mt-0">
              <button
                @click="viewDetails(order.id)"
                class="itbms-view-button px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-150"
              >
                View
              </button>
            </div>
          </div>
        </div>

        <Pagination
          v-if="pagination.totalPages > 1"
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          @update:page="loadOrders"
        />
      </div>
    </div>
  </div>
</template>
