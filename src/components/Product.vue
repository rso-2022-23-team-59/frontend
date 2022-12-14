<template>
    <div>

        <div class="text-center mb-5 d-flex justify-center align-center">
            <v-divider length="200" class="d-inline"></v-divider>
            <h2 class="mx-5 px-5">Latest products</h2>
            <v-divider length="200" class="d-inline"></v-divider>
        </div>

        <v-row>
            <template v-for="(product, i) in products" :key="i">
                <v-col class="d-flex child-flex" cols="3">
                    <v-hover v-slot="{ isHovering, props }">
                        <v-card
                            class="product"
                            :elevation="isHovering ? 8 : 0"
                            :class="{ 'on-hover': isHovering }"
                            v-bind="props"
                        >
                                <v-img :src="product.image" aspect-ratio="1" class="grey lighten-2 mb-2" />
                                <div>{{ product.name }}</div>
                        </v-card>
                    </v-hover>
                </v-col>
            </template>
        </v-row>

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
    methods: {
        getProducts() {
            axios.get("http://127.0.0.1:8080/v1/products").then((response) => {

                this.products = response.data
            })

        }
    },
    mounted() {
        this.getProducts();
    }
};
</script>

<style scoped>
.product {
    background-color: white;
    border-radius: 0.5rem;
    padding: 2em;
}
</style>
  