<script>
import defaultImage from "@/assets/images/brands/default.png";

export default {
  name: "SaleItemCard",
  props: { item: { type: Object, required: true } },
  emits: ["add-to-cart"],
  data() {
    return { defaultImage };
  },
  computed: {
    coverSrc() {
      return this.item?.thumbnailUrl || this.item?.imageUrl || this.defaultImage;
    },
    ramStorageText() {
      const ram = this.item?.ramGb ?? "-";
      const storage = this.item?.storageGb ?? "-";
      return `${ram} / ${storage}GB`;
    },
    formattedPrice() {
      const n = Number(this.item?.price ?? 0);
      return `Baht ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    },
  },
  methods: {
    onAdd() { this.$emit("add-to-cart", this.item); },
  },
};
</script>

<template>
  <div
    class="itbms-row bg-white rounded-lg hover:shadow-md transition duration-200 w-[180px] sm:w-[200px]"
  >
    <router-link :to="`/sale-items/${item.id}`" class="block no-underline">
      <!-- รูป -->
      <div class="w-full h-[180px] grid place-items-center">
        <img
          :src="coverSrc"
          :alt="item.model || item.brandName || 'product'"
          class="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>

      <!-- ข้อความ -->
      <div class="px-3 pb-3 text-left">
        <h2 class="itbms-brand text-sm font-semibold text-gray-900 mb-0.5">
          {{ item.brandName || "-" }}
        </h2>
        <p class="itbms-model text-xs text-gray-700 leading-snug">
          {{ item.model || "-" }}
        </p>
        <p class="text-xs text-gray-500 leading-snug">
          <span class="itbms-ramGb">{{ item.ramGb || "-" }}</span>
          <span> / </span>
          <span class="itbms-storageGb">{{ item.storageGb || "-" }}</span>
          <span class="itbms-storageGb-unit">GB</span>
        </p>
        <p class="itbms-color text-xs text-gray-500 leading-snug mb-2">
          {{ item.color || "-" }}
        </p>

        <!-- ราคา + ปุ่ม -->
        <div class="mt-1 flex items-center justify-between">
          <p class="itbms-price text-sm font-semibold text-gray-900">
            <span class="itbms-price-unit">Baht</span>
            {{ Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
          </p>
          <button
            type="button"
            class="itbms-add-to-cart-button px-3 py-1 text-[11px] font-semibold rounded-full bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98] transition"
            @click.stop.prevent="onAdd"
          >
            Add to cart
          </button>
        </div>
      </div>
    </router-link>
  </div>
</template>
