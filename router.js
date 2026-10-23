import {createRouter, createWebHistory} from 'vue-router'

import HomeView from './src/Pages/MainPage/HomeView.vue'
import AuthView from './src/Pages/AuthPage/AuthView.vue'
import CabinetView from '@/Pages/CabinetPage/CabinetView.vue'
import CatalogView from '@/Pages/Catalog/CatalogView.vue'
import ProductView from '@/Pages/ProductPage/ProductVuew.vue'
import AdminView from '@/Pages/AdminPage/AdminView.vue'

const routes = [
    {path: '/', component: HomeView},
    {path: '/login', component: AuthView},
    {path: '/me', component: CabinetView},
    {path: '/catalog', component: CatalogView},
    {path: '/product/:id', component: ProductView},
    {path: '/admin', component: AdminView},
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
