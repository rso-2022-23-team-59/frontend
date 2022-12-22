<template>
    <v-hover  v-slot="{ isHovering, props }">
        <router-link :to="{ name: 'product_detail', params: { id: product.id }}">
            <v-card class="product" :elevation="isHovering ? 8 : 0" :class="{ 'on-hover': isHovering }" v-bind="props">
                <v-img :src="product.image" aspect-ratio="1" class="grey lighten-2 mb-2" />
                <div>{{ product.name }}</div>
            </v-card>
        </router-link>

    </v-hover>
</template>

<script>
export default {
    props: ['product', 'index'],
}
</script>

<style scoped>
.product {
    background-color: white;
    border-radius: 0.5rem;
    padding: 2em;
}
</style>
