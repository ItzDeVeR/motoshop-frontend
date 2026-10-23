<style scoped>.allCards{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
</style>

<template>
    <h1>Карточки</h1>
    <div class="allCards">
        <SkeletonCard v-if="motoData == null" v-for="n in 6" />
        <OneCard v-else :motoItem="motoData[n]" :key="n" v-for="n in 6" />
    </div>

    <button @click="Unload">Unload</button>
</template>

<script>import OneCard from './OneCard.vue';
import SkeletonCard from './SkeletonCard.vue';
import axios from 'axios';

export default {
    data() {
        return {
            motoData: null
        }
    },

    async mounted() {
        this.loadProducts();
    },

    methods: {
        Unload() {
            this.motoData = null;
        },
        async loadProducts() {
            await axios.get("http://localhost:3000/getProducts").then((res) => this.motoData = res.data)
        }
    },

    components: {
        OneCard,
        SkeletonCard
    }
}
</script>
