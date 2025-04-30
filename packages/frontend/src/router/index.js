
import { createRouter, createWebHistory} from "vue-router"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path:'/',
            name :'home',
            component: () => import('@/view/Home.vue')
        },
        {
            path:'/sale-items',
            name :'sale-items',
            component: () => import('@/view/Shop.vue')
        }
    ]
}) 
export default router