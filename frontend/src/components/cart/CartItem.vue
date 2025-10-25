<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/store/useCartStore";

const cart = useCartStore();

// modal state
const showModal = ref(false);
const pendingDeleteId = ref(null);

function confirmDelete(id) {
  pendingDeleteId.value = id;
  showModal.value = true;
}

function deleteItem() {
  if (pendingDeleteId.value !== null) {
    cart.setQty(pendingDeleteId.value, 0);
  }
  pendingDeleteId.value = null;
  showModal.value = false;
}

// ---- helpers ----
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0 });

// group ตามผู้ขาย
const groups = computed(() => {
  const map = new Map();
  for (const it of cart.items) {
    const name = it?.sellerUsername || "Unknown";
    const id = it?.sellerId ?? name; // ถ้าไม่มี id ก็ใช้ name เป็น key
    const key = `${id}::${name}`;
    if (!map.has(key)) map.set(key, { id, name, items: [] });
    map.get(key).items.push(it);
  }
  return Array.from(map.values());
});

// select-all
const isAllSelected = computed(
  () => cart.items.length > 0 && cart.items.every((i) => i.selected)
);

function toggleAll() {
  const next = !isAllSelected.value;
  cart.items.forEach((i) => (i.selected = next));
  cart.save();
}

function toggleSeller(name) {
  const group = groups.value.find((g) => g.name === name);
  if (!group) return;
  const next = !(
    group.items.length > 0 && group.items.every((i) => i.selected)
  );
  group.items.forEach((i) => (i.selected = next));
  cart.save();
}

function toggleItem(id) {
  cart.toggleSelect(id);
}

// ลดจำนวน: ถ้าเหลือ 1 แล้วกดลด -> เปิดยืนยันลบ
function decQtyByItem(it) {
  const q = Number(it.quantity || 1);
  if (q <= 1) {
    confirmDelete(it.id);
  } else {
    cart.dec(it.id, 1);
  }
}

function incQty(id) {
  cart.inc(id, 1);
}
function onQtyInput(id, e) {
  const v = Number(e.target.value);
  if (Number.isFinite(v) && v <= 0) {
    confirmDelete(id);
  } else {
    cart.setQty(id, v);
  }
}
</script>

<template>
  <section class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <!-- Select All -->
      <div class="px-4 py-3 flex items-center gap-2">
        <input
          id="select-all"
          class="itbms-select-all h-4 w-4 accent-blue-600"
          type="checkbox"
          :checked="isAllSelected"
          @change="toggleAll"
        />
        <label for="select-all" class="text-sm text-gray-800 font-medium">
          Select All
        </label>
      </div>

      <!-- Groups by seller -->
      <div class="px-4 pb-4 space-y-4">
        <div
          v-for="group in groups"
          :key="group.id"
          class="bg-gray-50 rounded border border-gray-200"
        >
          <!-- Seller header -->
          <div
            class="flex items-center gap-2 px-3 py-2 border-b border-gray-200"
          >
            <input
              class="itbms-select-nickname h-4 w-4 accent-blue-600"
              type="checkbox"
              :checked="
                group.items.length > 0 && group.items.every((i) => i.selected)
              "
              @change="toggleSeller(group.name)"
            />
            <div class="itbms-nickname text-sm font-semibold text-gray-900">
              {{ group.name }}
            </div>
          </div>

          <!-- Items -->
          <div class="divide-y divide-gray-200">
            <div
              v-for="it in group.items"
              :key="it.id"
              class="itbms-item-row flex items-center gap-3 px-3 py-3 bg-white"
            >
              <!-- select item -->
              <input
                class="h-4 w-4 accent-blue-600"
                type="checkbox"
                :checked="it.selected"
                @change="toggleItem(it.id)"
              />

              <!-- image -->
              <div
                class="w-16 h-16 shrink-0 bg-gray-100 rounded overflow-hidden grid place-items-center"
              >
                <img
                  :src="it.thumbnailUrl || it.imageUrl"
                  :alt="it.model || it.brandName || 'item'"
                  class="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>

              <!-- desc -->
              <div class="itbms-item-description flex-1">
                <div class="text-sm font-semibold text-gray-900">
                  {{ it.brandName }} {{ it.model }}
                  <span v-if="it.storageGb" class="text-gray-500 font-normal">
                    ({{ it.storageGb }}GB<span v-if="it.color"
                      >, {{ it.color }}</span
                    >)
                  </span>
                </div>
                <div class="text-xs text-gray-500 line-clamp-1">
                  {{ it.description || "" }}
                </div>
              </div>

              <!-- quantity control -->
              <div class="itbms-item-quantity flex items-center gap-2">
                <button
                  class="itbms-dec-qty-button inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
                  @click="decQtyByItem(it)"
                  aria-label="decrease"
                  :title="(it.quantity || 1) <= 1 ? 'Remove item' : 'decrease'"
                >
                  -
                </button>

                <input
                  class="text-black w-12 h-8 text-center rounded border border-gray-300"
                  type="number"
                  min="1"
                  :max="it.maxQty || 999999"
                  :value="it.quantity"
                  @input="onQtyInput(it.id, $event)"
                />

                <button
                  class="itbms-inc-qty-button inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  @click="incQty(it.id)"
                  aria-label="increase"
                  :disabled="(it.quantity || 0) >= (it.maxQty || Infinity)"
                  :title="
                    (it.quantity || 0) >= (it.maxQty || Infinity)
                      ? 'Reached max available'
                      : 'increase'
                  "
                >
                  +
                </button>
              </div>

              <!-- price -->
              <div class="itbms-item-total-price w-28 text-right">
                <div class="text-sm text-gray-500">Price:</div>
                <div class="text-base font-semibold text-gray-900">
                  {{ fmt((it.price || 0) * (it.quantity || 0)) }}
                </div>
              </div>

              <!-- delete button -->
              <div class="itbms-item-delete w-16 text-right">
                <button
                  class="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                  @click="confirmDelete(it.id)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="cart.items.length === 0"
          class="text-center text-gray-500 py-10"
        >
          Your cart is empty.
        </div>
      </div>
    </div>
  </section>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-[#ffffff8f] bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="itbms-message bg-white rounded-lg p-6 shadow-lg max-w-sm w-full"
    >
      <h2 class="text-xl font-semibold mb-4 text-gray-800">
        Delete Confirmation
      </h2>
      <p class="mb-6 text-gray-800">
        Do you want to remove the sale item from the cart?
      </p>
      <div class="flex justify-end space-x-4">
        <button
          @click="deleteItem"
          class="itbms-confirm-button bg-[#5eb238] text-white px-4 py-2 rounded hover:bg-[#58914c] cursor-pointer"
        >
          Confirm
        </button>
        <button
          @click="showModal = false"
          class="itbms-cancel-button bg-[#cc3535] text-white px-4 py-2 rounded hover:bg-[#6d3e3e] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
