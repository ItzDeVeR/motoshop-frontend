<template>
  <div class="flex gap-x-5 items-center">
    <div>
      <Listbox v-model="selectedOrder" :options="allOrders" class="w-full md:w-56" scroll-height="530px"
               @change="getOrderData(selectedOrder)">
        <template #option="slotProps">
          <div class="text-center">
            <p class="text-xl text-blue-500">Заказ №{{ slotProps.option.id }}</p>
            <p :class="`${slotProps.option.status === 'pending' ? 'text-amber-500' :
                                    slotProps.option.status === 'paid' ? 'text-green-500' : 'text-violet-500'}`">
              Статус
              заказа: {{ statusExchanger(slotProps.option.status) }}</p>
          </div>
        </template>
      </Listbox>
    </div>

    <div v-if="this.errServerMessage" class="flex-grow flex flex-col items-center bg-white rounded-xl p-5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-50 text-red-500">
        <path fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"/>
      </svg>
      <p class="text-3xl">Ничего страшного, но</p>
      <h1 class="text-2xl text-red-500">{{ this.errServerMessage }}</h1>
      <h1 class="text-lg">Свяжитесь с администратором.</h1>
      <Button class="col-span-2 mt-5" severity="danger" @click="deleteOrder">Удалить заказ</Button>
    </div>

    <h1 v-else-if="!this.selectedOrder" class="text-6xl flex-grow text-center text-red-500">Выберите сначала заказ</h1>

    <div v-else class="grid grid-cols-2 flex-grow p-10 gap-2 text-2xl">
      <p>Номер заказа: </p>
      <p>№ {{ this.selectedOrder.id }}</p>

      <p>Статус заказа: </p>
      <p>{{ statusExchanger(this.selectedOrder.status) }}</p>

      <p>Заказ создан: </p>
      <p>{{ this.selectedOrder.created_at }}</p>

      <p>Пользователь: </p>
      <p>{{ selectedUser?.firstname }}</p>

      <p>Итоговая сумма: </p>
      <p>{{ this.totalPrice.toFixed(2) }} BYN</p>

      <Listbox :options="ordersInfo" class="col-span-2" listStyle="max-height:150px">
        <template #option="slotProps">
          <div class="flex items-center gap-x-5">
            <div class="text-black">{{ slotProps.option.name }}</div>
            <div class="text-red-600">x{{ slotProps.option.quantity }}</div>
            <div class="text-green-600">{{ slotProps.option.price_at_purchase.toFixed(2) }} BYN</div>
          </div>
        </template>
      </Listbox>

      <Button v-show="this.selectedOrder.status !== 'delivered'" class="col-span-2" @click="updateOrder">Изменить статус</Button>
      <Button class="col-span-2" severity="danger" @click="deleteOrder">Удалить заказ</Button>
    </div>

  </div>
</template>

<script>import Listbox from 'primevue/listbox';
import Button from 'primevue/button';
import router from "../../../../router.js";
import api from "@/api.js";

export default {
  components: {Listbox, Button},

  data() {
    return {
      allOrders: null,
      selectedOrder: null,
      selectedUser: null,
      ordersInfo: null,
      errServerMessage: null,
      totalPrice: 0
    }
  },

  created() {
    this.loadData();
  },

  methods: {
    async loadData() {
      const token = localStorage.getItem('token');
      if (!token) await router.push("/login");

      this.allOrders = null;
      this.selectedOrder = null;
      this.errServerMessage = null;

      await api.get('/getAllOrders', {headers: {Authorization: `Bearer ${token}`}})
          .then(response => this.allOrders = response.data)
          .catch(err => console.error(err.message));
    },
    async updateOrder() {
      const token = localStorage.getItem('token');
      if (!token) await router.push("/login");

      await api.patch('/changeOrderStatus', {
        orderID: this.selectedOrder.id,
        newStatus: this.statusNextUpdater(this.selectedOrder.status)
      }, {
        headers: {Authorization: `Bearer ${token}`}
      })
          .then(()=> this.loadData())
          .catch(err => this.errServerMessage = err.response.data.message)
    },
    async deleteOrder() {
      const token = localStorage.getItem('token');
      if (!token) await router.push("/login");

      await api.delete("/deleteOrder", {
        headers: {Authorization: `Bearer ${token}`},
        params: {orderID: this.selectedOrder.id}
      }).then(() => this.loadData())
          .catch(err => this.errServerMessage = err.response.data.message)
    },
    async getOrderData(order) {
      const token = localStorage.getItem('token');
      if (!token) await router.push("/login");

      if (!order) return;
      this.errServerMessage = null;

      await api.get(`/getUserByID`, {
        params: {currentUserID: order.user_id},
        headers: {Authorization: `Bearer ${token}`}
      })
          .then(response => this.selectedUser = response.data)
          .catch(err => this.errServerMessage = err.response.data.message)

      await api.get(`/getOrderInfo`, {
        params: {currentOrder: order.id},
        headers: {Authorization: `Bearer ${token}`}
      })
          .then(response => {
            this.totalPrice = 0;
            response.data.map(item => this.totalPrice += item.price_at_purchase);
            this.ordersInfo = response.data
          })
          .catch(err => this.errServerMessage = err.response.data.message)
      ;
    },
    statusExchanger(status) {
      switch (status) {
        case "pending":
          return "Ожидание"
        case "paid":
          return "Оплачено"
        case "shipped":
          return "Отправлено"
        case "delivered":
          return "Доставлено"
      }
    },
    statusNextUpdater(status) {
      switch (status) {
        case "pending":
          return "paid"
        case "paid":
          return "shipped"
        case "shipped":
          return "delivered"
        default:
            return null
      }
    }
  }
}
</script>
