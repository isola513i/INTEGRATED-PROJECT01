import { createRouter, createWebHistory } from "vue-router";
import LandingPageView from "@/views/home/LandingPageView.vue";
import ProductDetailView from "@/views/product/ProductDetailView.vue";
import NotFoundView from "@/views/error/NotFoundView.vue";
import Error500View from "@/views/error/Error500View.vue";
import ProductListView from "@/views/product/ProductListView.vue";
import ManageBrandView from "@/views/brand/ManageBrandView.vue";
import AddEditBrandView from "@/views/brand/AddEditBrandView.vue";
import ProductGalleryView from "@/views/product/ProductGalleryView.vue";
import AddEditItemView from "@/views/saleItem/AddEditItemView.vue";
import addFileTest from "@/components/form/addFileTest.vue";
const routes = [
	{
		path: "/",
		name: "Landing",
		component: LandingPageView,
	},
	{
		path: "/sale-items",
		name: "SaleItemsV2",
		component: ProductGalleryView,
	},
	{
		path: "/sale-items/:id",
		name: "SaleItems-Detail",
		component: ProductDetailView,
	},
	{
		path: "/sale-items/add",
		name: "Add-SaleItem",
		component: AddEditItemView,
	},
	{
		path: "/sale-items/:id/edit",
		name: "Edit-SaleItem",
		component: AddEditItemView,
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
		component: AddEditBrandView,
	},
	{
		path: "/brands/:brandId/edit",
		name: "EditBrandView",
		component: AddEditBrandView,
	},
	{
		path: "/test",
		name: "addFileTest",
		component: addFileTest,
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
