import { createRouter, createWebHistory } from "vue-router";
import ProductCatalogGridView from "../views/ProductCatalogGridView.vue";
import SingleProductView from "../views/SingleProductView.vue";

const routes = [
  {
    path: "/",
    name: "landing_page",
    component: ProductCatalogGridView,
  },
  {
    path: "/product/:id",
    name: "product_detail",
    component: SingleProductView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
