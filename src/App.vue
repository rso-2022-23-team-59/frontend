<template>
  <v-app theme="light">

    <v-app-bar elevation="0" color="deep-purple accent-4" dark>

      <v-app-bar-nav-icon icon="mdi-arrow-left" @click="$router.back()" />
      <v-toolbar-title>Price comparison</v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="text-center">

        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn prepend-icon="mdi-cash" v-bind="props">
              {{ selectedCurrency }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(currency, index) in currencies" :key="index" :value="index"
              @click="selectedCurrency = currency">
              <v-list-item-title>{{ currency }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-divider class="mx-4" vertical></v-divider>

      <v-badge :content="favorites.products.length" color="red" offset-x="8" offset-y="8" class="mr-5">
        <v-btn @click="$router.push({ name: 'shopping_cart', query: { cart: 'favorites' } })" icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-badge>

      <v-badge :content="shoppingCart.products.length" color="red" offset-x="8" offset-y="8" class="mr-5">
        <v-btn @click="$router.push({ name: 'shopping_cart', query: { cart: 'shopping-cart' } })" icon>
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </v-badge>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>

        <v-menu activator="parent">
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index" :value="index">
              <router-link :to="item.toUrl">

                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </router-link>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

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
import { BASE_URL_CART } from '@/utils/constants';

export default {
  data() {
    return {

      // Global currency information provided to all children of App object
      selectedCurrency: "EUR",
      currencies: ["EUR"],

      // Globally available shopping cart data.
      shoppingCart: {
        id: null,
        products: [],
        prices: null,
      },
      favorites: {
        id: null,
        products: [],
        prices: null,
      },

      items: [
        { title: 'Uredi trgovine', toUrl: { name: 'manageStores' } },
        { title: 'Uredi obvestila', toUrl: { name: 'manageNotifications' } },
      ],
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

    createShoppingCart(shoppingCartType) {
      axios.post(`${BASE_URL_CART}/shopping-carts/create`).then((response) => {
        this.updateCartId(shoppingCartType, response.data);
      });
    },
    getShoppingCart(shoppingCartType) {
      let cart = this.getShoppingCartByType(shoppingCartType);
      axios.get(`${BASE_URL_CART}/shopping-carts/${cart.id}`).then((response) => {
        this.updateCartProducts(shoppingCartType, response.data);
        this.getShoppingCartPrices(shoppingCartType);
      });
    },
    updateProductInShoppingCart(shoppingCartType, productId, quantity) {
      let cart = this.getShoppingCartByType(shoppingCartType);
      axios.put(`${BASE_URL_CART}/shopping-carts/${cart.id}`, {
        productId: productId,
        quantity: quantity
      }).then((response) => {
        this.updateCartProducts(shoppingCartType, response.data);
        this.getShoppingCartPrices(shoppingCartType);
      });
    },
    getShoppingCartPrices(shoppingCartType) {
      let cart = this.getShoppingCartByType(shoppingCartType);
      axios.get(`${BASE_URL_CART}/shopping-carts/${cart.id}/prices`)
        .then((response) => {
          this.updateCartPrices(shoppingCartType, response.data);
        });
    },

    updateCartProducts(cartType, data) {
      if (cartType == 'favorites') {
        this.favorites.products = data.products;
      } else {
        this.shoppingCart.products = data.products;
      }
      this.emitter.emit("shopping-cart-changed");
    },

    updateCartId(cartType, data) {
      if (cartType == 'favorites') {
        this.favorites.id = data.id;
      } else {
        this.shoppingCart.id = data.id;
      }
      this.emitter.emit("shopping-cart-changed");
    },

    updateCartPrices(cartType, data) {
      if (cartType == 'favorites') {
        this.favorites.prices = data;
      } else {
        this.shoppingCart.prices = data;
      }
      this.emitter.emit("shopping-cart-changed");
    },

    getShoppingCartByType(cartType) {
      if (cartType == 'favorites') {
        return this.favorites;
      } else {
        return this.shoppingCart;
      }
    },

  },

  mounted() {
    this.emitter.on("update-cart-product", data => {
      this.updateProductInShoppingCart(data.cart, data.productId, data.quantity);
    });

    this.loadCurrencies();

    // If shopping cart has not been loaded yet, create a new one now.
    if (this.shoppingCart.id == null) {
      this.createShoppingCart('shopping-cart');
    }
    if (this.favorites.id == null) {
      setTimeout(function () {
        this.createShoppingCart('favorites');
      }.bind(this), 1000);
    }
  },
  provide() {
    return {
      selectedCurrency: computed(() => this.selectedCurrency),
      shoppingCart: computed(() => this.shoppingCart),
      favorites: computed(() => this.favorites),
    }
  }
}
</script>

<style>
.gray-background {
  background-color: #f2f2f2;
}
</style>