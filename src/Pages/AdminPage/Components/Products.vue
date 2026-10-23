<template>
  <div class="flex gap-x-5 items-center">
    <Listbox v-model="selectedProduct" :options="allProducts" class="w-full md:w-56" scroll-height="470px"
             filter optionLabel="name" @change="onSelectProduct">
      <template #option="slotProps">
        <div>
          <p class="text-xl">{{ slotProps.option.name }}</p>
        </div>
      </template>
    </Listbox>

    <div class="grid grid-cols-2 flex-grow p-10 gap-1 text-2xl">
      <p>Наименование товара:</p>
      <InputText type="text" v-model="productName" :model-value="selectedProduct.name"/>

      <p>Категория:</p>
      <Select v-model="productCategory" :options="categoryList"
              placeholder="Выберите категорию товара"/>

      <p>Цена товара:</p>
      <InputNumber v-model="selectedProduct.price" mode="currency" currency="BYN" currencyDisplay="code" fluid/>

      <p>Количество на складе:</p>
      <InputNumber v-model="selectedProduct.stock" inputId="minmax-buttons" mode="decimal" showButtons :min="0"
                   :max="100" fluid/>

      <p>Описание товара:</p>
      <Textarea v-model="selectedProduct.description" rows="3" cols="30" maxlength="300" autoResize="false"/>

      <Message class="col-span-2" v-show="this.errServerMessage" severity="info">{{ errServerMessage }}</Message>

      <Button class="col-span-2" @click="createData">Добавить новый товар</Button>
      <Button class="col-span-2" severity="info" @click="saveData">Сохранить изменения</Button>
      <Button class="col-span-2" severity="danger" @click="deleteData">Удалить выбранный отвар</Button>
    </div>
  </div>
</template>

<script>import Listbox from 'primevue/listbox';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber';
import Message from 'primevue/message';
import router from "../../../../router.js";
import api from "@/api.js";

export default {
  components: {Listbox, Select, InputText, Textarea, InputNumber, Button, Message},

  created() {
    this.loadData()
  },

  data() {
    return {
      errServerMessage: null,
      allProducts: null,
      isProductSelected: false,
      selectedProduct: {
        name: "",
        category: "",
        price: 0,
        stock: 0,
        description: "",
      },
      productName: "",
      productCategory: "",
      categoryList: ["Аксессуары", "Обувь", "Перчатки", "Шлема", "Куртки", "Штаны"],
      categoryConverter: {
        enToRu: {
          accessories: "Аксессуары",
          boots: "Обувь",
          gloves: "Перчатки",
          helmet: "Шлема",
          jacket: "Куртки",
          pants: "Штаны"
        },

        ruToEn: {
          "Аксессуары": "accessories",
          "Обувь": "boots",
          "Перчатки": "gloves",
          "Шлема": "helmet",
          "Куртки": "jacket",
          "Штаны": "pants"
        }
      }
    }
  },

  methods: {
    loadData() {
      this.allProducts = null;
      this.selectedProduct = {
        name: "",
        category: "",
        price: 0,
        stock: 0,
        description: "",
      };
      this.productName = "";
      this.productCategory = "";

      api.get("/getProducts")
          .then((response) => this.allProducts = response.data)
          .catch(err => console.error(err.message))
    },
    async saveData() {
      this.errServerMessage = null;
      if (!this.isProductSelected) return this.errServerMessage = "Выберите товар";
      const token = localStorage.getItem('token');
      if (!token) await router.push("/login");

      await api.put("/updateProduct", {
        productID: this.selectedProduct.id,
        name: this.productName,
        category: this.categoryConverter.ruToEn[this.productCategory],
        price: this.selectedProduct.price,
        stock: this.selectedProduct.stock,
        description: this.selectedProduct.description,
      }, {headers: {Authorization: `Bearer ${token}`}})
          .then(response => {
            this.errServerMessage = `Успешно изменили ${response.data} товар`;
            this.loadData()
          })
          .catch(err => this.errServerMessage = err.response.data.message)
    },
    async createData() {
      const token = localStorage.getItem('token');
      if (!token) await router.push("/login");
      this.errServerMessage = null;

      if (this.productName.length < 3 || this.productCategory.length < 3)
        return this.errServerMessage = "Заполните поля правильно";

      await api.post("/createProduct", {
        name: this.productName,
        category: this.categoryConverter.ruToEn[this.productCategory],
        price: this.selectedProduct.price,
        stock: this.selectedProduct.stock,
        description: this.selectedProduct.description
      }, {headers: {Authorization: `Bearer ${token}`}})
          .then(response => {
            this.errServerMessage = `Успешно создали ${response.data} товар`;
            this.loadData();
          })
          .catch(err => this.errServerMessage = err.response.data.message)
    },
    async deleteData() {
      const token = localStorage.getItem('token');
      if (!token) await router.push("/login");

      this.errServerMessage = null;
      if (!this.isProductSelected) return this.errServerMessage = "Выберите товар";

      await api.delete("/deleteProduct", {
        params: {
          productID: this.selectedProduct.id,
        },
        headers: {Authorization: `Bearer ${token}`}
      })
          .then(response => {
            this.errServerMessage = `Успешно удалили ${response.data} товар`;
            this.loadData();
          })
          .catch(err => this.errServerMessage = err.response.data.message)
    },
    onSelectProduct() {
      this.productName = this.selectedProduct.name;
      this.productCategory = this.categoryConverter.enToRu[this.selectedProduct.category];
      if (this.productName) this.isProductSelected = true
      else this.isProductSelected = false
    },
  }
}
</script>
