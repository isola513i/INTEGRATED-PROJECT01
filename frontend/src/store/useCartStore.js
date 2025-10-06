// src/store/useCartStore.js
import { defineStore } from "pinia";

function normalizeId(v) {
	// กันเคส id เป็น number บ้าง string บ้าง
	return String(v ?? "");
}

export const useCartStore = defineStore("cart", {
	state: () => ({
		items: JSON.parse(localStorage.getItem("cart")) || [],
	}),

	getters: {
		count: (s) => s.items.reduce((sum, i) => sum + (i.quantity || 0), 0),

		selectedtotal: (s) =>
			s.items
				.filter((i) => i.selected)
				.reduce(
					(sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0),
					0
				),

		selectedCount: (s) =>
			s.items
				.filter((i) => i.selected)
				.reduce((sum, i) => sum + (i.quantity || 0), 0),

		// 👍 ตัวช่วย: ดึงเฉพาะรายการที่ถูกเลือก
		selectedItems: (s) => s.items.filter((i) => i.selected === true),
	},

	actions: {
		load() {
			const saved = localStorage.getItem("cart");
			this.items = saved ? JSON.parse(saved) : [];
			// migration เบาๆ: เติมค่าเริ่มต้นถ้ายังไม่มี
			this.items.forEach((it) => {
				if (typeof it.maxQty !== "number") it.maxQty = 999999;
				if (typeof it.selected !== "boolean") it.selected = true;
				it.quantity = Math.max(1, Number(it.quantity || 1));
			});
			this.save();
		},

		save() {
			localStorage.setItem("cart", JSON.stringify(this.items));
		},

		// ✅ helper: อ่าน "สต็อกสูงสุด" จาก object สินค้า
		_extractMaxQty(raw) {
			const stock =
				raw?.quantity ?? raw?.stock ?? raw?.available ?? raw?.availableQuantity;
			const n = Number(stock);
			return Number.isFinite(n) && n >= 1 ? n : 999999;
		},

		add(item, quantity = 1) {
			const addN = Math.max(1, Number(quantity ?? item?.qty ?? 1) || 1);

			const id = normalizeId(item.id);
			const found = this.items.find((i) => normalizeId(i.id) === id);

			const maxQty = this._extractMaxQty(item);

			const product = {
				id: item.id,
				model: item.model,
				brandName: item.brandName,
				description: item.description,
				price: item.price,
				storageGb: item.storageGb,
				color: item.color,
				seller: item.seller,
				thumbnailUrl: item.thumbnailUrl,
				imageUrl: item.imageUrl,
				maxQty, // เก็บสต็อกสูงสุดไว้ในตะกร้า
			};

			if (!found) {
				const clamped = Math.min(addN, product.maxQty);
				this.items.push({
					...product,
					quantity: clamped, // ไม่เกินสต็อก
					selected: true,
				});
			} else {
				// backfill maxQty ถ้ายังไม่มี (ของเก่า)
				found.maxQty = typeof found.maxQty === "number" ? found.maxQty : maxQty;
				const next = Math.min((found.quantity || 0) + addN, found.maxQty);
				found.quantity = next;
			}

			this.save();
		},

		toggleSelect(id) {
			const found = this.items.find(
				(i) => normalizeId(i.id) === normalizeId(id)
			);
			if (found) {
				found.selected = !found.selected;
				this.save();
			}
		},

		inc(id, amount = 1) {
			const found = this.items.find(
				(i) => normalizeId(i.id) === normalizeId(id)
			);
			if (found) {
				const max = Number(found.maxQty ?? 999999);
				const addN = Math.max(1, Number(amount) || 1);
				found.quantity = Math.min(max, (Number(found.quantity) || 1) + addN);
				this.save();
			}
		},

		dec(id, amount = 1) {
			const found = this.items.find(
				(i) => normalizeId(i.id) === normalizeId(id)
			);
			if (found) {
				const decN = Math.max(1, Number(amount) || 1);
				found.quantity = Math.max(1, (Number(found.quantity) || 1) - decN);
				this.save();
			}
		},

		setQty(id, qty) {
			const found = this.items.find(
				(i) => normalizeId(i.id) === normalizeId(id)
			);
			if (found) {
				const max = Number(found.maxQty ?? 999999);
				const v = Number(qty);
				const clamped = Math.min(max, Math.max(1, Number.isFinite(v) ? v : 1));
				found.quantity = clamped;
				this.save();
			}
		},

		remove(id) {
			this.items = this.items.filter(
				(i) => normalizeId(i.id) !== normalizeId(id)
			);
			this.save();
		},

		// 🆕 ลบทีละหลายชิ้น (รับ array ของ id หรือรับ predicate function)
		removeMany(idsOrPredicate) {
			if (Array.isArray(idsOrPredicate)) {
				const set = new Set(idsOrPredicate.map(normalizeId));
				this.items = this.items.filter((i) => !set.has(normalizeId(i.id)));
			} else if (typeof idsOrPredicate === "function") {
				this.items = this.items.filter((i) => !idsOrPredicate(i));
			}
			this.save();
		},

		// 🆕 ลบเฉพาะที่ถูกเลือก
		clearSelected() {
			this.removeMany((i) => i.selected === true);
		},

		clear() {
			this.items = [];
			this.save();
		},
	},
});
