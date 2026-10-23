<template>
  <div class="flex gap-x-5 items-center">
    <div>
      <Listbox v-model="selectedUser" :options="allUsers" optionLabel="login" class=" w-full md:w-56"
               scroll-height="530px"/>
    </div>

    <div class="grid grid-cols-2 h-fit gap-5 text-4xl flex-grow p-10">
      <h1 class="text-right">Имя:</h1>
      <InputText type="text" :value="selectedUser?.firstname"
                 @input="selectedUser && (selectedUser.firstname = $event.target.value)"/>

      <h1 class="text-right">Логин:</h1>
      <p>{{ selectedUser?.login }}</p>

      <h1 class="text-right">Новый пароль:</h1>
      <Password v-model="newPassword" :feedback="false" toggleMask fluid/>

      <h1 class="text-right">Адрес:</h1>
      <InputText type="text" :value="selectedUser?.adress"
                 @input="selectedUser && (selectedUser.adress = $event.target.value)"/>

      <h1 class="text-right">Права:</h1>
      <Select :options="roles" optionLabel="name" placeholder="Выберите роль пользователя"
              class="text-base" @update:modelValue="item => this.newRole = item"
              :model-value="roleSelector(selectedUser?.role)"/>

      <Message v-if="errServerMessage != null" severity="error" class="col-span-2 flex justify-center mt-3">{{
          errServerMessage
        }}
      </Message>

      <Button label="Сохранить данные" severity="success" class="col-span-2" @click="updateUserClick"/>
      <Button label="Удалить пользователя" severity="danger" class="col-span-2" @click="deleteUserClick"/>
    </div>
  </div>
</template>

<script>import Listbox from 'primevue/listbox';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import router from "../../../../router.js";
import api from "@/api.js";

export default {
  components: {Listbox, InputText, Password, Select, Button, Message},

  created() {
    this.updateData();
  },

  methods: {
    updateData() {
      const token = localStorage.getItem('token');
      if (!token) router.push("/login");

      api.get("/getUsers", {headers: {Authorization: `Bearer ${token}`}})
          .then(response => {
            this.allUsers = response.data;
          })
          .catch(err => console.log(err));
    },

    updateUserClick() {
      const token = localStorage.getItem('token');
      if (!token) router.push("/login");

      if (!this.selectedUser || !this.newPassword || !this.newRole) {
        return this.errServerMessage = "Заполните поля корректно";
      }

      api.get("/me", {
        headers: {Authorization: `Bearer ${token}`}
      })
          .then(response => {
            this.currentAdminUser = response.data.login;
          })
          .catch(error => router.push("/login"));

      api.post("/changeUserDataAdmin", {
        currentUserID: this.selectedUser.id,
        newFirstname: this.selectedUser.firstname,
        newLogin: this.selectedUser.login,
        newPassword: this.newPassword,
        newAdress: this.selectedUser.adress,
        newRole: this.newRole.name === "Администратор" ? "admin" : "user"
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then((response) => {
        this.errServerMessage = "";
        if (this.currentAdminUser === this.selectedUser.login) {
          localStorage.removeItem('token');
          return router.push({path: "/login", query: {success: true}});
        }

        this.errServerMessage = "Данные успешно изменены"
        this.selectedUser = null;
        this.newPassword = null;
      }).catch(error => this.errServerMessage = error.response.data.message);
    },

    deleteUserClick() {
      const token = localStorage.getItem('token');
      if (!token) router.push("/login");

      if (!this.selectedUser) {
        this.tryToDelete = false;
        return this.errServerMessage = "Выберите пользователя";
      }

      if (!this.tryToDelete) {
        this.errServerMessage = "Нажмите ещё раз для подтверждения";
        return this.tryToDelete = true;
      }

      api.post("/delUser", {deleteUserID: this.selectedUser?.id}, {headers: {"Authorization": `Bearer ${token}`}})
          .then(response => {
            this.tryToDelete = false;
            this.errServerMessage = response.data.message;
            this.updateData();
            this.selectedUser = null;
          })
          .catch(error => this.errServerMessage = error.response.data.message);
    },

    roleSelector(item) {
      switch (item) {
        case "admin": {
          return this.newRole = {name: 'Администратор'}
        }
        case "user": {
          return this.newRole = {name: 'Пользователь'}
        }
        default:
          return null
      }
    }
  },

  data() {
    return {
      errServerMessage: null,
      newPassword: null,
      newRole: null,
      selectedUser: null,
      allUsers: null,
      currentAdminUser: null,
      roles: [{name: 'Администратор'}, {name: 'Пользователь'}],
      tryToDelete: false,
    }
  }
}
</script>
