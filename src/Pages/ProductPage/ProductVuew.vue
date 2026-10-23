<template>
  <div class="flex justify-center items-center bg-blue-400 h-screen">
    <div v-if="this.error" class="flex flex-col items-center bg-white rounded-xl p-5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-50 text-red-500">
        <path fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"/>
      </svg>
      <p class="text-3xl">Ничего страшного, но</p>
      <h1 class="text-lg">{{ this.error }}</h1>
      <h1 class="text-lg">Свяжитесь с администратором.</h1>
      <Button label="Назад к каталогу продукции" severity="info" class="m-5" @click="$router.push('/catalog')"></Button>
    </div>

    <div v-else class="flex flex-col items-center bg-white rounded-xl p-5 w-md">
      <img :src="`/` + this.currentItem.category + `.svg`" class="w-50"/>
      <p class="text-2xl text-center">{{ this.currentItem.name }}</p>
      <p class="text-lg text-center">Категория: {{ getCategory(this.currentItem.category) }}</p>
      <p class="text-lg text-center">Текущая цена: {{ this.currentItem.price }} BYN</p>
      <p class="text-lgm text-center">В наличии: {{ this.currentItem.stock }}</p>
      <p class="text-2xl text-center"> {{ this.currentItem.description }} </p>
      <Button label="Назад к каталогу продукции" severity="info" class="m-5" @click="$router.push('/catalog')"></Button>
    </div>
  </div>
</template>

<script>import Button from 'primevue/button';
import api from "@/api.js";

export default {
  components: {Button},
  data() {
    return {
      currentItem: null,
      error: null,
    }
  },
  created() {
    api.get(`/getProduct/${this.$route.params.id}`).then((response) => {
      this.currentItem = response.data;
    }).catch((err) => this.error = err.response?.data?.message || 'Произошла ошибка при загрузке товара');
  },
  methods: {
    getCategory(category) {
      switch (category) {
        case 'accessories':
          return 'Аксессуары';
        case 'gloves':
          return 'Перчатки';
        case 'helmet':
          return 'Шлема';
        case 'boots':
          return 'Ботинки';
        case 'pants':
          return 'Штаны';
        case 'jacket':
          return 'Куртки';

        default:
          return null;
      }
    }
  }
}
</script>
