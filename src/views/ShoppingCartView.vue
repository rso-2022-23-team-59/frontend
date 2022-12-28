<script>
import axios from 'axios';
import { BASE_URL_PRODUCTS } from "@/utils/constants.js"

export default {
    data() {
        return {
            items: []
        };
    },
    methods: {
        getProducts() {
            axios.get(`${BASE_URL_PRODUCTS}/products/`).then((response) => {
                console.log(response.data);
                this.items = response.data;
            })

        },
    },
    mounted() {
        this.getProducts();
    },
};
</script>

<template>
    <div class="mt-5 mb-5">

        <div class="text-center d-flex justify-center align-center">
            <v-divider length="200" class="d-inline"></v-divider>
            <h3 class="mx-5 px-5">Izbrani produkti</h3>
            <v-divider length="200" class="d-inline"></v-divider>
        </div>

        <v-row class="mt-5">
            <v-col cols="8" offset="2">

                <v-list lines="two">
                    <v-list-item v-for="item in items" :key="item.id" :title="item.name" :subtitle="item.description"
                        :prepend-avatar="item.image">

                        <template v-slot:append>
                            <div class="ml-5">
                                PRICE
                            </div>
                        </template>
                    </v-list-item>
                </v-list>

            </v-col>
        </v-row>

    </div>
</template>