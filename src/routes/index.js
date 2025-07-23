import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import MapPage from "../views/MapPage.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomePage
    },
    {
        path: "/map",
        name: "Map",
        component: MapPage
    }
];

const router = createRouter({
    history: createWebHistory('/A80/'),
    routes
});

export default router;
