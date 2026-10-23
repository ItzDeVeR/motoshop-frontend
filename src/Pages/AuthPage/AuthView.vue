<script>import Login from './Components/Login.vue';
import { Button } from 'primevue';
import Register from './Components/Register.vue';

export default {
    data() {
        return {
            currentComponent: 'login'
        }
    },

    components: {
        Login,
        Button,
        Register
    },

    methods: {
        viewChanger() {
            if (this.currentComponent === 'login') this.currentComponent = 'register'
            else this.currentComponent = 'login'
        }
    }
}
</script>

<template>
    <div class="h-screen flex items-center justify-center bg-hubGray">
        <div class="flex flex-col items-center justify-center bg-white shadow-2xl rounded-xl px-10 py-5">
            <Login v-if="currentComponent == 'login'" />
            <Register v-else />

            <Button :label="currentComponent === 'login' ? 'Регистрация' : 'Авторизация'" @click="viewChanger" class="w-full my-3" />
            <Button label="Главная" severity="contrast" @click="this.$router.push('/')" class="w-full" />
        </div>
    </div>
</template>
