<template>

  <div v-if="ordered" class="absolute top-[50%] left-[50%] transform translate-[-50%] text-center">
    <p class="text-6xl">Ваш заказ успешно оформлен</p>
    <p class="my-5 text-black/50">Отследить его можно в личном кабинете</p>
    <Button label="Перейти в личный кабинет" severity="success" @click="$router.push(`/me`)"/>
  </div>

  <div v-else class="flex my-5">
    <div v-show="showedBin" class="flex flex-col w-100">
      <h1 class="text-center font-bold text-2xl">Корзина</h1>

      <div v-show="currentOrders.length !== 0"
           class="grid grid-cols-2 grid-rows-2 m-2 p-4 gap-1 bg-blue-600 rounded-md">
        <p class="text-xl text-white font-bold">Кол-во товаров</p>
        <p class="text-xl text-white">{{ currentOrders.length }}</p>
        <p class="text-xl text-white font-bold">Общая сумма</p>
        <p class="text-xl text-green-300">{{ currentOrders.totalSum ? currentOrders.totalSum.toFixed(2) : 0 }} BYN</p>
        <Button label="Оформить заказ" severity="success" rounded class="col-span-2" @click="createOrder"/>
      </div>

      <div v-for="item in currentOrders"
           class="overflow-y-auto grid grid-rows-2 grid-cols-2 gap-x-5 border-2 border-blue-600 rounded-md shadow-sm p-3 m-3 text-xl">
        <p>{{ item.name }}</p>
        <p>{{ item.count }} шт.</p>
        <p class="text-black/50 text-base">{{ getCategory(item.category) }}</p>
        <p class="text-lime-600 text-base">{{ item.price.toFixed(2) }} BYN</p>
        <Button label="Удалить" severity="danger" class="col-span-2" @click="removePosition(item)"/>
      </div>
    </div>

    <DataTable class="flex-1" :value="products" tableStyle="min-width: 50rem" paginator :rows="10"
               :rowsPerPageOptions="[5, 10, 20, 50]">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Каталог товаров</span>
          <Button label="Перейти в личный кабинет" severity="success" @click="$router.push(`/me`)"/>
        </div>
      </template>
      <Column field="name" header="Наименование" sortable>
        <template #body="slotProps">

          <router-link :to="`/product/${slotProps.data.id}`" class="text-blue-600">{{
              slotProps.data.name
            }}
          </router-link>
        </template>
      </Column>
      <Column field="category" header="Категория" sortable>
        <template #body="slotProps">{{ getCategory(slotProps.data.category) }}</template>
      </Column>
      <Column field="price" header="Цена" sortable>
        <template #body="slotProps">{{ slotProps.data.price }} BYN</template>
      </Column>
      <Column header="Количество" sortable>
        <template #body="slotProps">
          <Tag :value="slotProps.data.stock" :severity="getSeverity(slotProps.data.stock)"/>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <div class="flex justify-center gap-x-2">
            <Button label="+" severity="success" @click="addItem(slotProps.data)" rounded/>
            <Button label="-" severity="danger" @click="removeItem(slotProps.data)" rounded/>

          </div>
        </template>
      </Column>

      <template #footer> Всего товаров {{ products ? products.length : 0 }} products.</template>
    </DataTable>
  </div>
</template>

<script>import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import router from "../../../router.js";
import api from "@/api.js";

export default {
  data() {
    return {
      products: null,
      showedBin: false,
      currentOrders: [],
      ordered: false
    }
  },

  components: {
    DataTable,
    Column,
    Tag,
    Button
  },

  created() {
    api.get("/getProducts")
        .then(response => this.products = response.data)
        .catch(err => console.error(err))
  },

  methods: {
    createOrder() {
      const token = localStorage.getItem('token');
      if (!token) return router.push("/login");

      api.post("/makeOrder", this.currentOrders, {
        headers: {Authorization: `Bearer ${token}`}
      })
          .catch(err => console.error(err));

      this.ordered = true;
    },
    addItem(item) {
      if (item.stock === 0) return;

      const {stock, ...rest} = item;

      const currentOrder = this.currentOrders.find(curItem => curItem.id === rest.id);
      if (!currentOrder) {
        rest.count = 1;
        this.currentOrders.push(rest);
      } else {
        currentOrder.count += 1;
        currentOrder.price += item.price;
      }

      const oldItem = this.products.find(curItem => curItem.id === rest.id);
      oldItem.stock--;

      this.currentOrders.totalSum = this.currentOrders.map(item => item.price).reduce((a, b) => a + b);
      this.showedBin = true;
    },
    removeItem(item) {
      const currentOrder = this.currentOrders.find(curItem => curItem.id === item.id);

      if (!currentOrder) return;

      currentOrder.count -= 1;
      currentOrder.price -= item.price;
      this.currentOrders.totalSum -= item.price;

      if (currentOrder.count === 0) {
        const index = this.currentOrders.findIndex(curItem => curItem.id === item.id);
        this.currentOrders.splice(index, 1);
      }

      const oldItem = this.products.find(curItem => curItem.id === item.id);
      oldItem.stock++;

      if (this.currentOrders.length === 0) this.showedBin = false;
    },
    removePosition(item) {
      const index = this.currentOrders.findIndex(curItem => curItem.id === item.id);
      this.currentOrders.splice(index, 1);
      this.currentOrders.totalSum -= item.price;
      if (this.currentOrders.length === 0) this.showedBin = false;
    },
    getSeverity(price) {
      switch (true) {
        case price > 10:
          return 'success';

        case price <= 10 && price >= 1:
          return 'warn';

        case price <= 0:
          return 'danger';

        default:
          return null;
      }
    },
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
