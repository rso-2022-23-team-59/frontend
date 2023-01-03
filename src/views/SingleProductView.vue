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
                                <div class="price">{{ formatPrice(cheapestProduct.price) }} {{ cheapestProduct.currency
}}</div>
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
                    <v-col cols="6">
                        <v-btn
                            variant="tonal"
                            color="primary"
                            append-icon="mdi-cart"
                            @click="addToCart"
                            block
                        >
                                Dodaj v košarico
                        </v-btn>
                    </v-col>
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
                                <tr v-for="item in latestPrices" :key="item.storeId">
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


        <div class="mt-5 pt-5" v-if="allPrices">

            <!-- Divider -->
            <div class="text-center d-flex justify-center align-center">
                <v-divider length="200" class="d-inline"></v-divider>
                <h3 class="mx-5 px-5">Zgodovina cen</h3>
                <v-divider length="200" class="d-inline"></v-divider>
            </div>

            <!-- Chart of prices in different stores -->
            <v-row class="mt-5 mb-5">
                <v-col offset="3" cols="6">
                    <apexchart width="100%" type="line" :options="chartOptions" :series="series"></apexchart>
                </v-col>
            </v-row>
        </div>
        <v-row class="mb-5">
            <v-col offset="2" cols="8">
                <v-row>
                    <v-col cols="12">
                        <v-card>
                            <v-card-title>
                            <span v-if="notificationExists" class="text-h5">Obvestilo nastavljeno</span>
                            <span v-else class="text-h5">Obvesti me o spremembah cene</span>

                            </v-card-title>

                            <v-card-text>
                            <v-container>
                                <v-row>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                    v-model="editedItem.thresholdPrice"
                                    label="Spodnja meja cene"
                                    :disabled="notificationExists"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                    v-model="editedItem.email"
                                    label="Email"
                                    :disabled="notificationExists"

                                    ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="addNotification"
                            >
                                Dodaj obvestilo
                            </v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-col>

                </v-row>
            </v-col>
        </v-row>

    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue';
import axios from 'axios';
import moment from "moment/moment";
import { BASE_URL_CART, BASE_URL_PRODUCTS, BASE_URL_NOTIF } from "@/utils/constants.js";

export default {
    data() {
        return {
            productId: this.$route.params.id,
            product: null,
            latestPrices: null,
            cheapestProduct: null,
            allPrices: null,
            chartOptions: {
                stroke: {
                    curve: 'stepline',
                },
                xaxis: {
                    type: 'datetime'
                },
                markers: {
                    size: 6,
                }
            },
            series: [],
            editedItem: {},
        }
    },
    computed:{
        notificationExists(){
            return this.editedItem && this.editedItem.id
        }
    },  
    methods: {

        updateAll() {
            this.getProductInformation();
            this.updatePrices();
        },

        updatePrices() {
            this.getLatestPrices();
            this.getAllPrices();
        },

        getProductInformation() {
            axios.get(`${BASE_URL_PRODUCTS}/products/${this.productId}`).then((response) => {
                this.product = response.data;
            });
        },

        getLatestPrices() {
            var productsUrl = `${BASE_URL_PRODUCTS}/product-stores/${this.productId}/prices`;
            if (this.selectedCurrency != 'EUR') {
                productsUrl += `?currency=${this.selectedCurrency}`;
            }

            axios.get(productsUrl).then((response) => {
                this.latestPrices = response.data;
                this.cheapestProduct = this.computeLowestPrice();
            });
        },

        getAllPrices() {
            let productsUrl = (this.selectedCurrency == 'EUR')
                ? `${BASE_URL_PRODUCTS}/product-stores/?filter=product.id:EQ:${this.productId}`
                : `${BASE_URL_PRODUCTS}/product-stores/?currency=${this.selectedCurrency}&filter=product.id:EQ:${this.productId}`;

            axios.get(productsUrl).then((response) => {
                this.allPrices = response.data;
                this.series = this.computeChartData(response.data);
            });
        },

        computeChartData(productPrices) {
            let series = {};

            let lastTimestamp = null;

            for (let i = 0; i < productPrices.length; i++) {
                let productPrice = productPrices[i];
                if (!series.hasOwnProperty(productPrice.storeId)) {
                    series[productPrice.storeId] = {
                        name: `Store ${productPrice.storeId}`,
                        data: []
                    };
                }

                let unixTimestamp = moment(productPrice.timestamp).valueOf();
                lastTimestamp = Math.max(lastTimestamp, unixTimestamp);

                series[productPrice.storeId].data.push({
                    x: unixTimestamp,
                    y: productPrice.price
                });
            }

            if (lastTimestamp != null) {
                for (const [key, value] of Object.entries(series)) {
                    if (value.data.length <= 0) continue;
                    let lastItem = value.data[value.data.length - 1];
                    value.data.push({
                        x: lastTimestamp,
                        y: lastItem.y,
                    });
                }
            }
            

            return Object.values(series);
        },

        addNotification(){
            let item = Object.assign({}, this.editedItem)
            item["productId"] = this.productId
            item["lastPrice"] = 0
            axios.post(`${BASE_URL_NOTIF}/notifications/`, item).then((response) => {
                this.editedItem = response.data
            })
        },
        getExistingNotification(){
            axios.get(`${BASE_URL_NOTIF}/notifications/?filter=productId:EQ:${this.productId}`).then((response) => {
                this.editedItem = response.data[0]
            }).catch((e)=>{})
        },
        computeLowestPrice() {
            if (this.latestPrices == null) return null;
            if (this.latestPrices.length <= 0) return null;
            let cheapestProduct = this.latestPrices[0];
            for (let i = 1; i < this.latestPrices.length; i++) {
                if (this.latestPrices[i].price < cheapestProduct.price) {
                    cheapestProduct = this.latestPrices[i];
                }
            }
            return cheapestProduct;
        },

        formatPrice(price) {
            return parseFloat(price).toFixed(2);
        },

        formatDate(date) {
            return moment(date).fromNow();
        },

        addToCart() {
            // Emit an event, that the [App] component will catch and insert
            // this item into the shopping cart.
            this.emitter.emit("add-to-cart", this.productId);
        },

        isInCart() {
            if (this.shoppingCart.products != null) {
                for (let i = 0; i < this.shoppingCart.products.length; i++) {
                    let product = this.shoppingCart.products[i];
                    if (product.id === this.productId) return true;
                }
            }
            return false;
        }

    },

    watch: {
        selectedCurrency(newCurrency, oldCurrency) {
            // Every time the currency changes, update prices. We don't need to
            // update product information, since it doesn't have any pricing
            // info.
            this.updatePrices();
        },
    },

    mounted() {
        // Load all product information from backend.
        this.updateAll();
        this.getExistingNotification();
    },
    inject: ['selectedCurrency', 'shoppingCart'],
    components: { ProductCard }
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