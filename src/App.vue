<template>
  <v-app theme="light">

    <v-app-bar elevation="0" color="deep-purple accent-4" dark>

      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Price comparison</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-divider class="mx-4" vertical></v-divider>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-badge :content="0" color="red" offset-x="8" offset-y="8" class="mr-5">
        <v-btn icon>
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </v-badge>

    </v-app-bar>

    <v-main>
      <v-container>
        <Product></Product>
      </v-container>
    </v-main>
  </v-app>

</template>
<script>
import Product from './components/Product.vue';

export default {
  components: {
    Product
  }

}

</script>
<style> 


</style>
