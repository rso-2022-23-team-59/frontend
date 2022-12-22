<template>
  <div>


      <div class="text-center mb-5 d-flex justify-center align-center">
          <v-divider length="200" class="d-inline"></v-divider>
          <h2 class="mx-5 px-5">Product {{ $route.params.id }}</h2>
          <v-divider length="200" class="d-inline"></v-divider>
      </div>

      <v-row>
        <v-col  offset="3" cols="6">

          <ProductCard  v-if="product" :product="product" :index="product.id" />
        </v-col>
      </v-row>
      <v-row>
        <v-col offset="3" cols="6">
          <v-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Store id
                  </th>
                  <th class="text-left">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in productPrices"
                  :key="item.storeId"
                >
                  <td>{{ item.storeId }}</td>
                  <td>{{ item.price }}</td>
                </tr>
              </tbody>
            </template>
          </v-table>

        </v-col>
          
      </v-row>

  </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue';
import axios from 'axios';
import { BASE_URL_PRODUCTS } from "@/utils/constants.js"
export default {
  data() {
      return {
          productId: this.$route.params.id,
          product: null,
          productPrices: null,
      }
  },
  methods: {
      getProduct() {
          
          axios.get(`${BASE_URL_PRODUCTS}/products/${this.productId}`).then((response) => {
              this.product = response.data
          })

          axios.get(`${BASE_URL_PRODUCTS}/product-stores/?filter=product.id:EQ:${this.productId}`).then((response) => {
              this.productPrices = response.data
          })

      }
  },
  mounted() {
      this.getProduct();
  },
  components: {
      ProductCard
  }
};
</script>