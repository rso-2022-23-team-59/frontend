<template>
  <v-app theme="light">

    <v-app-bar elevation="0" color="deep-purple accent-4" dark>

      <v-app-bar-nav-icon icon="mdi-arrow-left" @click="$router.back()"/>
      <v-toolbar-title>Price comparison</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-divider class="mx-4" vertical></v-divider>

      <div class="text-center">

        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn prepend-icon="mdi-cash" v-bind="props">
              {{ selectedCurrency }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(currency, index) in currencies"
              :key="index"
              :value="index"
              @click="selectedCurrency = currency"  
            >
              <v-list-item-title>{{ currency }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-divider class="mx-4" vertical></v-divider>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-badge :content="0" color="red" offset-x="8" offset-y="8" class="mr-5">
        <v-btn @click="$router.push({ name: 'shopping_cart' })" icon>
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </v-badge>

    </v-app-bar>

    <v-main class="gray-background pb-5">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>

</template>

<script>
import axios from 'axios';
import { computed } from 'vue'

export default {
  data() {
    return {
      selectedCurrency: "EUR",
      currencies: ["EUR"],
      shoppingCartId: null,
    };
  },
  methods: {
    loadCurrencies() {
      const options = {
        method: 'GET',
        url: 'https://currency-exchange.p.rapidapi.com/listquotes',
        headers: {
          'X-RapidAPI-Key': 'ca6ab8fbc2mshd8441de3eb09c6cp1d3122jsnfb158a4954a9',
          'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
      };

      axios.request(options).then((response) => {
        this.currencies = response.data;
      });
    },
    getSelectedCurrency() {
      return this.selectedCurrency;
    },
    createShoppingCart() {
      axios.post(`http://localhost:8082/v1/shopping-carts/create`).then((response) => {
          this.shoppingCartId = response.data.id;
      });
    },
  },
  mounted() {
    this.loadCurrencies();

    // If shopping cart has not been loaded yet, create a new one now.
    if (this.shoppingCartId == null) {
      this.createShoppingCart();
    }
  },
  provide() {
    return {
      selectedCurrency: computed(() => this.selectedCurrency),
      shoppingCartId: computed(() => this.shoppingCartId),
    }
  }
}
</script>

<style>
.gray-background {
  background-color: #f2f2f2;
}
</style>