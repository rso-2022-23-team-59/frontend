<template>
    <v-app theme="light">
    <v-app-bar>
      <v-spacer></v-spacer>


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
