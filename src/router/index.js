import { createRouter, createWebHistory } from "vue-router";
import ProductCatalogGridView from "../views/ProductCatalogGridView.vue";
import SingleProductView from "../views/SingleProductView.vue";
import ShoppingCartView from "../views/ShoppingCartView.vue";

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
  {
    path: "/shopping-cart",
    name: "shopping_cart",
    component: ShoppingCartView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
