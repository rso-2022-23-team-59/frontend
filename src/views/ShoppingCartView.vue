<script>
export default {
    data() {
        return {
            cart: {
                id: null,
                products: [],
                prices: [],
            },
            cartType: null,
        };
    },
    methods: {
        
        changeQuantity(itemId, newQuantity) {
            this.emitter.emit("update-cart-product", { cart: this.cartType, productId: itemId, quantity: newQuantity });
        },
        removeFromCart(itemId) {
            this.emitter.emit("update-cart-product", { cart: this.cartType, productId: itemId, quantity: 0 });
        },
        updateCurrentCart(cartType) {
            this.cartType = cartType;
            if (cartType == 'favorites') {
                Object.assign(this.cart, this.favorites);
            } else {
                Object.assign(this.cart, this.shoppingCart);
            }
        }

    },
    mounted() {
        this.updateCurrentCart(this.$route.query.cart);
        this.emitter.on("shopping-cart-changed", data => {
            this.updateCurrentCart(this.$route.query.cart);
        });
    },
    watch: {
        '$route'(newRoute, oldRoute) {
            this.updateCurrentCart(this.$route.query.cart);
        }
    },
    inject: ['shoppingCart', 'favorites'],
};
</script>

<template>
    <div class="mt-5 mb-5">

        <div class="text-center d-flex justify-center align-center">
            <v-divider length="200" class="d-inline"></v-divider>
            
            <!-- Display different title based on cart type -->
            <h2 v-if="cartType == 'favorites'" class="mx-5 px-5">Priljubljeni izdelki</h2>
            <h2 v-else class="mx-5 px-5">Izdelki v košarici</h2>
            
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
                        <tr v-for="item in cart.products" :key="item.id">
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
                        <tr v-if="cart.products == null || cart.products.length <= 0">
                            <td colspan="4">Nakupovalna košarica je prazna.</td>
                        </tr>
                    </tbody>
                </v-table>

            </v-col>
        </v-row>
    </div>

    <div class="mt-5 mb-5" v-if="cart.prices != null && cart.prices.length > 0">

        <div class="text-center d-flex justify-center align-center">
            <v-divider length="200" class="d-inline"></v-divider>
            <h3 class="mx-5 px-5">Cene izdelkov</h3>
            <v-divider length="200" class="d-inline"></v-divider>
        </div>

        <v-row class="mt-5">
            <v-col cols="10" offset="1">
                <div class="shop" v-for="entry in cart.prices" :key="entry.store.id">
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
                            <tr v-if="entry.prices == null || entry.prices.length <= 0">
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