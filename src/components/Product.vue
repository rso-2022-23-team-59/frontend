<template>
    <div>
        <h1>HI</h1>
        <p v-for="product in products">
            {{product}}
        </p>
        
    </div>
  </template>
  
  <script>
import axios from 'axios';

  export default {
    props: {
      msg: String,
    },
    data() {
        return {
            products: []
        }
    },
    methods:{
        getProducts() {
            axios.get("http://127.0.0.1:8080/v1/products").then( (response) => {

                this.products = response.data
            } )

        }
    },
    mounted() {
        this.getProducts();
    }
  };
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  