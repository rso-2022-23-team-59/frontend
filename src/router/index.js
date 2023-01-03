import { createRouter, createWebHistory } from "vue-router";
import ProductCatalogGridView from "../views/ProductCatalogGridView.vue";
import SingleProductView from "../views/SingleProductView.vue";
import ManageStores from "../views/ManageStores.vue";

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
    path: "/stores/",
    name: "manageStores",
    component: ManageStores,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
