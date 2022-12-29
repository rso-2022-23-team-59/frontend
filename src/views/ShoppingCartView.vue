<script>
import axios from 'axios';

export default {
    data() {
        return {
            items: [],
            prices: null,
        };
    },
    methods: {
        getShoppingCart(shoppingCartId) {
            axios.get(`http://localhost:8082/v1/shopping-carts/${shoppingCartId}`).then((response) => {
                this.items = response.data.products;
                this.loadShoppingCartPrices();
            });
        },
        updateProductInShoppingCart(shoppingCartId, productId, quantity) {
            axios.put(`http://localhost:8082/v1/shopping-carts/${shoppingCartId}`, {
                productId: productId,
                quantity: quantity
            }).then((response) => {
                this.items = response.data.products;
                this.loadShoppingCartPrices();
            });
        },
        getShoppingCartPrices(shoppingCartId) {
            axios.get(`http://localhost:8082/v1/shopping-carts/${shoppingCartId}/prices`)
                .then((response) => {
                    this.prices = response.data;
                    this.loadShoppingCartPrices();
                });
        },
        changeQuantity(itemId, newQuantity) {
            if (this.shoppingCartId != null) {
                this.updateProductInShoppingCart(this.shoppingCartId, itemId, newQuantity);
            }
        },
        removeFromCart(itemId) {
            if (this.shoppingCartId != null) {
                this.updateProductInShoppingCart(this.shoppingCartId, itemId, 0);
            }
        },
        loadShoppingCartPrices() {
            if (this.shoppingCartId != null) {
                this.getShoppingCartPrices(this.shoppingCartId);
            }
        },
        loadShoppingCartData() {
            if (this.shoppingCartId != null) {
                this.getShoppingCart(this.shoppingCartId);
            }
        },
    },
    watch: {
        shoppingCartId(newId, oldId) {
            // Reload shopping cart data
            this.loadShoppingCartData();
        }
    },
    mounted() {
        this.loadShoppingCartData();
    },
    inject: ['shoppingCartId'],
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
            <v-col cols="10" offset="1">

                <v-table>
                    <thead>
                        <tr>
                            <th>Slika</th>
                            <th>Produkt</th>
                            <th>Količina</th>
                            <th><!-- Remove from cart button --></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td>
                                <div class="product-image">
                                    <v-img aspect-ratio="1" width="64" :src="item.image" contain />
                                </div>
                            </td>
                            <td>{{ item.name }}</td>
                            <td>
                                <v-text-field type="number" density="compact" variant="outlined" hide-details
                                    single-line class="quantity" v-bind:value="item.quantity"
                                    v-on:input="changeQuantity(item.productId, $event.target.value)" />
                            </td>
                            <td>
                                <v-btn variant="flat" @click="removeFromCart(item.productId)" icon>
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        <tr v-if="items == null || items.length <= 0">
                            <td colspan="4">Nakupovalna košarica je prazna.</td>
                        </tr>
                    </tbody>
                </v-table>

            </v-col>
        </v-row>
    </div>

    <div class="mt-5 mb-5" v-if="prices">

        <div class="text-center d-flex justify-center align-center">
            <v-divider length="200" class="d-inline"></v-divider>
            <h3 class="mx-5 px-5">Cena košarice</h3>
            <v-divider length="200" class="d-inline"></v-divider>
        </div>

        <v-row class="mt-5">
            <v-col cols="10" offset="1">
                <div class="shop" v-for="entry in prices" :key="entry.store.id">
                    <div class="shop-information d-flex align-center">
                        <div class="image mr-5">
                            <v-img width="100" :src="entry.store.image" />
                        </div>
                        <div class="information ml-5">
                            <h4>{{ entry.store.name }}</h4>
                            <p class="description">{{ entry.store.description }}</p>
                        </div>
                    </div>
                    <v-table>
                        <tbody>
                            <tr v-for="item in entry.prices" :key="item.product.id">
                                <td>
                                    <div class="product-image">
                                        <v-img aspect-ratio="1" width="64" :src="item.product.image" contain />
                                    </div>
                                </td>
                                <td>{{ item.product.name }}</td>
                                <td class="price">
                                    {{ item.quantity }} x {{ item.price }} {{ item.currency }} = {{ item.totalPrice }} {{ item.currency }}
                                </td>
                            </tr>
                            <tr v-if="items == null || items.length <= 0">
                                <td colspan="4">Nakupovalna košarica je prazna.</td>
                            </tr>
                            <tr v-else>
                                <td colspan="2"></td>
                                <td class="price">
                                    {{ entry.totalPrice }} {{ entry.currency }}
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-col>
        </v-row>

    </div>

</template>

<style scoped>
.shop {
    margin-bottom: 2rem;
}

.shop-information {
    background-color: white;
    padding: 2rem;
    border-bottom: 1px solid #e0e0e0;
}

.shop-information .description {
    color: #797979;
    font-size: 0.9em;
}

.product-image {
    padding: 0.5rem;
}

.quantity {
    width: 100px;
}

.price {
    font-weight: bold;
    font-size: 1.4em;
}
</style>