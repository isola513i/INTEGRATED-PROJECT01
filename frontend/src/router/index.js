import { createRouter, createWebHistory } from "vue-router";
import ProductGalleryView from "@/views/ProductGalleryView.vue";
import LandingPageView from "@/views/LandingPageView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import Error500View from "@/views/Error500View.vue";

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
