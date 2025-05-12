import { createRouter, createWebHistory } from "vue-router";
import ProductGalleryView from "@/views/ProductGalleryView.vue";
import LandingPageView from "@/views/LandingPageView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import Error500View from "@/views/Error500View.vue";
import AddSaleItem from "@/views/AddSaleItemView.vue";
import EditSaleItemView from "@/views/EditSaleItemView.vue";

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
    path: "/sale-items/:slug",
    name: "SaleItems-Detail",
    component: ProductDetailView,
  },
  {
    path: "/sale-items/add",
    name: "Add-SaleItem",
    component: AddSaleItem,
  },
  {
    path: "/sale-items/edit/:slug",
    name: "Edit-SaleItem",
    component: EditSaleItemView,
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
  history: createWebHistory(),
  routes,
});

export default router;
