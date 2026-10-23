<template>
  <div v-if="this.isAdmin" class="flex flex-col bg-blue-500 h-screen p-4 gap-5">
    <div class="flex place-content-evenly bg-white rounded-xl p-5">
      <Button label="Пользователи" severity="info" @click="this.currentWindow = `Users`"/>
      <Button label="Товары" severity="info" @click="this.currentWindow = `Products`"/>
      <Button label="Заказы" severity="info" @click="this.currentWindow = `Orders`"/>
      <Button label="Личный кабинет" @click="$router.push('/me')"/>
    </div>

    <div class="flex-grow bg-white rounded-xl p-5">
      <Users v-if="this.currentWindow === `Users`"/>
      <Products v-else-if="this.currentWindow === `Products`"/>
      <Orders v-else-if="this.currentWindow === `Orders`"/>
    </div>
  </div>

  <div v-else class="flex justify-center items-center bg-blue-500 h-screen">
    <div class="flex flex-col items-center bg-white rounded-xl p-5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-50 text-red-500">
        <path fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"/>
      </svg>
      <p class="text-3xl">Ничего страшного, но</p>
      <h1 class="text-lg text-red-500 text-bold">{{ this.error }}</h1>
      <h1 class="text-lg">Свяжитесь с администратором.</h1>
      <Button label="Перейти в профиль" severity="info" class="m-5" @click="$router.push('/me')"></Button>
    </div>
  </div>
</template>

<script>import Button from 'primevue/button';
import Users from './Components/Users.vue';
import Products from './Components/Products.vue';
import Orders from './Components/Orders.vue';
import router from "../../../router.js";
import api from "@/api.js";

export default {
  components: {
    Button,
    Users,
    Products,
    Orders
  },

  created() {
    const token = localStorage.getItem('token');
    if (!token) router.push("/login");

    api.get("/admin", {
      headers: {Authorization: `Bearer ${token}`}
    })
        .then(response => {
          this.isAdmin = true;
        })
        .catch(error => this.error = error.response?.data?.message);
  },

  data() {
    return {
      isAdmin: false,
      error: null,
      currentWindow: "Users",
    }
  }
}
</script>
