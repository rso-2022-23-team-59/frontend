<template>
  <div>


      <div class="text-center mb-5 d-flex justify-center align-center">
          <v-divider length="200" class="d-inline"></v-divider>
          <h2 class="mx-5 px-5">Product {{ $route.params.id }}</h2>
          <v-divider length="200" class="d-inline"></v-divider>
      </div>

      <v-row>
        <v-col offset="2" cols="8" class="product-display">

          <v-row v-if="product">
            <v-col cols="4">
              <v-img :src="product.image" aspect-ratio="1" class="grey lighten-2 mb-2" />
            </v-col>
            <v-col cols="8">

              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>

              <div v-if="cheapestProduct" class="best-offer-container">
                <div class="best-offer">
                  <div class="price">{{ cheapestProduct.price }} €</div>
                  <div>Najboljša cena</div>
                </div>
              </div>
              
            </v-col>
          </v-row>
          
        </v-col>
      </v-row>

      <v-row class="mt-5">
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
          cheapestProduct: null,
      }
  },
  methods: {
      getProduct() {
          
          axios.get(`${BASE_URL_PRODUCTS}/products/${this.productId}`).then((response) => {
              this.product = response.data;
          })

          axios.get(`${BASE_URL_PRODUCTS}/product-stores/?filter=product.id:EQ:${this.productId}`).then((response) => {
              this.productPrices = response.data;
              this.cheapestProduct = this.lowestPriceStore();
          })

      },
      lowestPriceStore() {
        if (this.productPrices == null) return null;
        if (this.productPrices.length <= 0) return null;
        let cheapestProduct = this.productPrices[0];
        for (let i = 1; i < this.productPrices.length; i++) {
          if (this.productPrices[i].price < cheapestProduct.price) {
            cheapestProduct = this.productPrices[i];
          }
        }
        return cheapestProduct;
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

<style scoped>
.product-display {
  background-color: white;
  padding: 3rem 1.5rem;
  margin: 1rem;
}
.best-offer-container {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.best-offer {
  font-size: 0.7rem;
  text-transform: uppercase;
}
.best-offer .price {
  font-size: 1.7rem;
  font-weight: bold;
}
</style>