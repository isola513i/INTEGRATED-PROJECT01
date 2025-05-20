import { createRouter, createWebHistory } from "vue-router";
import ProductGalleryView from "@/views/product/ProductGalleryView.vue";
import LandingPageView from "@/views/home/LandingPageView.vue";
import ProductDetailView from "@/views/product/ProductDetailView.vue";
import NotFoundView from "@/views/error/NotFoundView.vue";
import Error500View from "@/views/error/Error500View.vue";
import AddSaleItem from "@/views/saleItem/AddSaleItemView.vue";
import EditSaleItemView from "@/views/saleItem/EditSaleItemView.vue";
import ProductListView from "@/views/product/ProductListView.vue";
import ManageBrandView from "@/views/ิbrand/ManageBrandView.vue";
import AddBrandView from "@/views/ิbrand/AddBrandView.vue";
import EditBrandView from "@/views/ิbrand/EditBrandView.vue";
import ProductGalleryViewV2 from "@/views/product/ProductGalleryViewV2.vue";

const routes = [
	{
		path: "/",
		name: "Landing",
		component: LandingPageView,
	},
	{
		path: "/sale-items",
		name: "SaleItems",
		component: ProductGalleryView,
	},
	{
		path: "/v2/sale-items",
		name: "SaleItemsV2",
		component: ProductGalleryViewV2,
	},
	{
		path: "/sale-items/:id",
		name: "SaleItems-Detail",
		component: ProductDetailView,
	},
	{
		path: "/sale-items/add",
		name: "Add-SaleItem",
		component: AddSaleItem,
	},
	{
		path: "/sale-items/:id/edit",
		name: "Edit-SaleItem",
		component: EditSaleItemView,
	},
	{
		path: "/sale-items/list",
		name: "ProductListView",
		component: ProductListView,
	},
	{
		path: "/brands",
		name: "MangeBrandView",
		component: ManageBrandView,
	},
	{
		path: "/brands/add",
		name: "AddBrandView",
		component: AddBrandView,
	},
	{
		path: "/brands/:brandId/edit",
		name: "EditBrandView",
		component: EditBrandView,
	},
	{
		path: "/not-found",
		name: "NotFound",
		component: NotFoundView,
	},
	{
		path: "/server-error",
		name: "ServerError",
		component: Error500View,
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: "/not-found",
	},
];

const router = createRouter({
	history: createWebHistory("/ssi4/"),
	routes,
});

export default router;
