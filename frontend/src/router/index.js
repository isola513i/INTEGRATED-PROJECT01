import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";

import LandingPageView from "@/views/home/LandingPageView.vue";
import ProductDetailView from "@/views/product/ProductDetailView.vue";
import NotFoundView from "@/views/error/NotFoundView.vue";
import Error500View from "@/views/error/Error500View.vue";
import ProductListView from "@/views/product/ProductListView.vue";
import ManageBrandView from "@/views/brand/ManageBrandView.vue";
import AddEditBrandView from "@/views/brand/AddEditBrandView.vue";
import ProductGalleryView from "@/views/product/ProductGalleryView.vue";
import AddEditItemView from "@/views/saleItem/AddEditItemView.vue";
import RegisterUser from "@/views/RegisterAccount/RegisterUser.vue";
import VerifyEmail from "@/views/RegisterAccount/VerifyEmail.vue";
import SignInUser from "@/views/RegisterAccount/SignInUser.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import ProfileEdit from "@/views/profile/ProfileEdit.vue";
import ShoppingCart from "@/views/cart/ShoppingCart.vue";
import { useCartStore } from "@/store/useCartStore";
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
		meta: { requiresAuth: true, roles: ["SELLER"] },
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
	{
		path: "/registers",
		name: "register",
		component: RegisterUser,
	},
	{
		path: "/signin",
		name: "signin",
		component: SignInUser,
	},
	{
		path: "/verify-email",
		name: "VerifyEmail",
		component: VerifyEmail,
	},
	{
		path: "/profile",
		name: "ProfileView",
		component: ProfileView,
		meta: { requiresAuth: true },
	},
	{
		path: "/profile/edit",
		name: "ProfileEditView",
		component: ProfileEdit,
		meta: { requiresAuth: true },
	},
	{
		path: "/cart",
		name: "Cart",
		component: ShoppingCart,
	},
];

const router = createRouter({
	history: createWebHistory("/ssi4/"),
	routes,
});

router.beforeEach(async (to, from, next) => {
	const auth = useAuthStore();
	const cart = useCartStore();
	auth.fectchCheckUser;
	if (to.meta.requiresAuth) {
		if (!auth.isAuthenticated) {
			return next({ name: "signin" });
		}

		try {
			if (to.meta.roles && !to.meta.roles.includes(auth.user.userType)) {
				return next({ name: "SaleItemsV2" });
			}
		} catch (e) {
			console.error("Token invalid or expired", e);
			return next({ name: "Landing" });
		}
	}

	next();
});

export default router;
