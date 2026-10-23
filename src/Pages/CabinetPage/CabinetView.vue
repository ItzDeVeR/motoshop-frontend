<template>
  <div class="flex flex-col w-screen h-screen bg-slate-950">
    <div class="flex flex-row h-20 content-between items-center justify-between p-5 border-b-1 border-stone-50">
      <div class="text-white flex items-center">
        <i class="pi pi-prime mr-2" style="font-size: 2.5rem"></i>
        <p class="text-2xl my-auto text-center">Пользователь: {{ currentFirstname }}</p>
      </div>
      <div class="flex">
        <p @click="catalogClick" class="text-white text-2xl mx-3 cursor-pointer">Каталог</p>
        <p @click="logoutClick" class="text-white text-2xl cursor-pointer">Выход</p>
      </div>
    </div>

    <div class="flex flex-grow m-5 gap-5">
      <div
          class="basis-1/3 flex flex-col text-white text-4xl p-5 bg-slate-800 border-1 shadow-xl border-slate-500 rounded-md">
        <h1 class="text-center font-bold">Заказы</h1>
        <div class="max-h-[calc(100vh-200px)] flex-1 min-h-0 overflow-y-auto">

          <Tree v-if="this.nodes.length !== 0" :value="nodes" @nodeExpand="onNodeExpand" class="w-full h-full"
                scrollHeight="flex" style="--p-tree-background: Transparent; --p-tree-node-color: #fff;">
            <template #default="slotProps">
              <div class="grid grid-cols-3 gap-5 text-lg">
                <p>{{ slotProps.node.label }}</p>
                <p :class="`text-base ${slotProps.node.status === 'pending' ? 'text-amber-500' :
                                    slotProps.node.status === 'paid' ? 'text-green-500' : 'text-violet-500'}`">{{
                    statusExchanger(slotProps.node.status)
                  }}</p>
                <p class="text-lime-500">{{ slotProps.node.price }} BYN</p>
                <button v-show="slotProps.node.status === `pending`" @click="payOrder(slotProps.node.key)"
                        class="col-span-3 text-center border border-green-500 bg-slate-800 rounded-sm cursor-pointer hover:bg-slate-950">
                  Оплатить заказ
                </button>
              </div>
            </template>
            <template #orderProducts="slotProps">
              <div class="text-lg flex gap-5">
                <p class="text-stone-50/70">{{ slotProps.node.label }} ({{ slotProps.node.quantity }} шт.)</p>
                <p class="text-stone-50/70">=></p>
                <p class="text-lime-500/70">{{ slotProps.node.price }} BYN</p>
              </div>
            </template>
          </Tree>
          <h1 v-else class="overflow-hidden text-center">Вы ничего ещё не
            заказали :с</h1>

        </div>

      </div>
      <div
          class="basis-2/3 flex-5fr text-white text-4xl p-5 bg-slate-800 border shadow-xl border-slate-500 rounded-md">
        <h1 class="text-center font-bold">Данные аккаунта</h1>

        <div class="grid grid-cols-[auto_1fr] gap-5 my-5">
          <div class="col-start-1">
            <p class="flex-none">Имя:&nbsp;</p>
            <p class="flex-none mt-2">Логин:&nbsp;</p>
            <p class="flex-none mt-3">Новый пароль:&nbsp;</p>
            <p class="flex-none mt-4">Адрес доставки:&nbsp;</p>
          </div>
          <div class="col-start-2">
            <input class="text-xl w-full border rounded-sm p-2" v-model="firstname"/>
            <input class="text-xl w-full border rounded-sm p-2" v-model="login"/>
            <input class="text-xl w-full border rounded-sm p-2" type="password" v-model="newPassword"/>
            <input class="text-xl w-full border rounded-sm p-2" v-model="adress"/>
          </div>
        </div>

        <Message v-if="errServerMessage != ''" severity="error" class="w-full flex justify-center mt-3">{{
            errServerMessage
          }}
        </Message>

        <button @click="changeData"
                class="border border-green-500 bg-slate-800 w-full mt-2 rounded-sm text-2xl p-2 cursor-pointer hover:bg-slate-950">
          Сохранить
          данные аккаунта
        </button>

        <button v-show="role === 'admin'"
                class="border border-rose-500 bg-slate-800 w-full mt-2 rounded-sm text-2xl p-2 cursor-pointer hover:bg-rose-950"
                @click="$router.push('/admin')">
          Панель
          администратора
        </button>
      </div>
    </div>
  </div>
</template>

<script>import router from '../../../router';
import {Message} from 'primevue';
import Tree from 'primevue/tree';
import api from "@/api.js";

export default {
  data() {
    return {
      currentFirstname: "",
      firstname: "",
      login: "",
      newPassword: "",
      role: "user",
      adress: "",
      errServerMessage: "",
      nodes: []
    }
  },

  components: {

    Message,
    Tree
  },

  created() {
    const token = localStorage.getItem('token');
    if (!token) router.push("/login");

    api.get("/me", {
      headers: {Authorization: `Bearer ${token}`}
    })
        .then(response => {
          this.firstname = response.data.firstname;
          this.login = response.data.login;
          this.role = response.data.role;
          this.adress = response.data.adress === null ? "" : response.data.adress;
          this.currentFirstname = this.firstname;
        })
        .catch(error => router.push("/login"));

    this.updateData();
  },

  methods: {
    logoutClick() {
      localStorage.removeItem('token');
      router.push("/login");
    },
    updateData() {
      const token = localStorage.getItem('token');
      if (!token) router.push("/login");
      this.nodes = [];
      api.get("/getOrders", {
        headers: {Authorization: `Bearer ${token}`}
      })
          .then(response => {
            response.data.map(item => this.nodes.push({
              key: item.id,
              label: `Заказ №${item.id}`,
              status: item.status,
              price: item.price_at_purchase.toFixed(2),
              children: [{label: "Получение..."}]
            }))
          }).catch(error => this.nodes = []);
    },
    catalogClick() {
      router.push("/catalog");
    },
    payOrder(orderID) {
      const token = localStorage.getItem('token');
      if (!token) router.push("/login");
      api.post("/updateOrderStatus", {orderID}, {headers: {Authorization: `Bearer ${token}`}})
          .then(() => this.updateData())
          .catch(error => this.errServerMessage = error.response.data.message);
    },
    changeData() {
      const token = localStorage.getItem('token');
      if (!token) router.push("/login");

      api.post("/changeUserData", {
        newLogin: this.login,
        newFirstname: this.firstname,
        newPassword: this.newPassword,
        newAdress: this.adress
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then(response => {
        this.errServerMessage = "";
        localStorage.removeItem('token');
        router.push({path: "/login", query: {success: true}});
      }).catch(error => {
        if (error.response.status === 401 || error.response.status === 400)
          this.errServerMessage = error.response.data.message;
        else console.error("Real error:", error);
      });
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
    onNodeExpand(node) {
      const token = localStorage.getItem('token');
      if (!token) router.push("/login");

      api.get(`/getProductsByOrder/${node.key}`, {
        headers: {Authorization: `Bearer ${token}`}
      })
          .then(response => {
            const currentNodeChildren = this.nodes.find(item => item.key === node.key).children = [];
            response.data.map(item => currentNodeChildren.push({
              key: item.id,
              label: item.name,
              price: item.price_at_purchase.toFixed(2),
              quantity: item.quantity,
              type: 'orderProducts'
            }));
          }).catch(error => this.nodes = []);
    }
  }
}
</script>
