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
                    <ProductCard :product="product" :index="i" />
                </v-col>
            </template>
        </v-row>

    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue';
import { BASE_URL_PRODUCTS } from "@/utils/constants.js"
import axios from 'axios';

export default {
    data() {
        return {
            products: []
        }
    },
    methods: {
        getProducts() {
            axios.get(`${BASE_URL_PRODUCTS}/products/`).then((response) => {
                this.products = response.data
            })

        }
    },
    mounted() {
        this.getProducts();
    },
    components: {
        ProductCard
    }
};
</script>