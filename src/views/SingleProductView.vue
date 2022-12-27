<template>
    <div>

        <!-- Product information -->
        <v-row class="mt-5">
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
                                <div class="price">{{ formatPrice(cheapestProduct.price) }} {{ cheapestProduct.currency }}</div>
                                <div>Najboljša cena</div>
                            </div>
                        </div>

                    </v-col>
                </v-row>

            </v-col>
        </v-row>

        <!-- Action buttons - add to cart and add to favourites list -->
        <v-row class="mb-5">
            <v-col offset="2" cols="8">
                <v-row>
                    <v-col cols="6"><v-btn variant="tonal" color="primary" append-icon="mdi-cart" block>Dodaj v
                            košarico</v-btn></v-col>
                    <v-col cols="6"><v-btn variant="tonal" color="primary" append-icon="mdi-heart" block>Dodaj med
                            priljubljene</v-btn></v-col>
                </v-row>
            </v-col>
        </v-row>

        <div class="mt-5 pt-5">
            
            <!-- Divider -->
            <div class="text-center d-flex justify-center align-center">
                <v-divider length="200" class="d-inline"></v-divider>
                <h3 class="mx-5 px-5">Cene izdelka</h3>
                <v-divider length="200" class="d-inline"></v-divider>
            </div>

            <!-- List of prices in different stores -->
            <v-row class="mt-5 mb-5">

                <v-col offset="3" cols="6">
                    <v-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Trgovina
                                    </th>
                                    <th class="text-left">
                                        Cena
                                    </th>
                                    <th class="text-left">
                                        Zadnja posodobitev
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in productPrices" :key="item.storeId">
                                    <td>{{ item.storeId }}</td>
                                    <td>{{ formatPrice(item.price) }} {{ item.currency }}</td>
                                    <td class="timestamp">{{ formatDate(item.timestamp) }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>

                </v-col>

            </v-row>
        </div>

    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue';
import axios from 'axios';
import moment from "moment/moment";
import { BASE_URL_PRODUCTS } from "@/utils/constants.js";
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

            var productsUrl = `${BASE_URL_PRODUCTS}/product-stores/${this.productId}/prices`;
            if (this.selectedCurrency != 'EUR') {
                productsUrl += `?currency=${this.selectedCurrency}`;
            }

            axios.get(productsUrl).then((response) => {
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
        },
        formatPrice(price) {
            return parseFloat(price).toFixed(2);
        },
        formatDate(date) {
            return moment(date).fromNow();
        }
    },
    watch: {
        // Every time the currency changes, update product prices.
        selectedCurrency(newCurrency, oldCurrency) {
            this.getProduct();
        }
    },
    mounted() {
        this.getProduct();
    },
    inject: ['selectedCurrency'],
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

.timestamp {
    font-size: 0.8em !important;
    color: grey;
}
</style>