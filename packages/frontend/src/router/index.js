import { createRouter, createWebHistory } from 'vue-router';
import ProductGalleryView from '@/views/ProductGalleryView.vue';
import LandingPageView from '@/views/LandingPageView.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPageView,
  },
  {
    path: '/sale-items',
    name: 'SaleItems',
    component: ProductGalleryView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
