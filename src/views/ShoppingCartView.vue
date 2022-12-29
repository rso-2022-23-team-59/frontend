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
        getShoppingCart(shoppingCartId) {
            axios.get(`http://localhost:8082/v1/shopping-carts/${shoppingCartId}`).then((response) => {
                console.log(response.data.products);
                this.items = response.data.products;
            });
        },
        updateProductInShoppingCart(shoppingCartId, productId, quantity) {
            axios.put(`http://localhost:8082/v1/shopping-carts/${shoppingCartId}`, {
                productId: productId,
                quantity: quantity
            }).then((response) => {
                console.log(response.data.products);
                this.items = response.data.products;
            });
        },
        changeQuantity(itemId, newQuantity) {
            console.log("Set quantity for item with id " + itemId + " to " + newQuantity + " in cart with id " + this.shoppingCartId);
            if (this.shoppingCartId != null) {
                this.updateProductInShoppingCart(this.shoppingCartId, itemId, newQuantity);
            }
        },
        removeFromCart(itemId) {
            console.log("Remove item with id " + itemId + " from cart with id " + this.shoppingCartId);
            if (this.shoppingCartId != null) {
                this.updateProductInShoppingCart(this.shoppingCartId, itemId, 0);
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

                <div class="shop">

                    <div class="shop-information d-flex align-center">
                        <div class="image mr-5">
                            <v-img width="100" src="https://www.mimovrste.com/_nuxt/img/LogoSl10SI.ffbd456.732.svg" />
                        </div>
                        <div class="information ml-5">
                            <h4>Mimovrste.com</h4>
                            <p class="description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum impedit debitis vel corporis autem, molestiae voluptates iusto reprehenderit earum laboriosam quia eaque veniam, ratione eius repellat in exercitationem aperiam sunt.</p>
                        </div>
                    </div>

                    <v-table>
                        <tbody>
                            <tr v-for="item in items" :key="item.id">
                                <td>
                                    <div class="product-image">
                                        <v-img aspect-ratio="1" width="64" :src="item.image" contain />
                                    </div>
                                </td>
                                <td>{{ item.name }}</td>
                                <td>
                                    <v-text-field
                                        type="number"
                                        density="compact"
                                        variant="outlined"
                                        hide-details
                                        single-line
                                        class="quantity"
                                        v-bind:value="item.quantity"
                                        v-on:input="changeQuantity(item.productId, $event.target.value)"
                                    />
                                </td>
                                <td class="text-center price">12€</td>
                                <td>
                                    <v-btn variant="flat" @click="removeFromCart(item.productId)" icon>
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
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
    padding: 2rem;
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
    font-size: 1.2em;
}
</style>