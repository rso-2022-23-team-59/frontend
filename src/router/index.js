import { createRouter, createWebHistory } from "vue-router";
import ProductCatalogGridView from "../views/ProductCatalogGridView.vue";
import SingleProductView from "../views/SingleProductView.vue";
import ShoppingCartView from "../views/ShoppingCartView.vue";
import ManageStores from "../views/ManageStores.vue";
import ManageNotifications from "../views/ManageNotifications.vue";

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
  {
    path: "/stores/",
    name: "manageStores",
    component: ManageStores,
  },
  {
    path: "/notifications/",
    name: "manageNotifications",
    component: ManageNotifications,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
