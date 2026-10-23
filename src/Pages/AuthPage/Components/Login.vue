<template>
    <h1 class="text-5xl text-hubGray font-bold my-5">Авторизация</h1>
    <Form v-slot="$form" :initialValues :resolver="loginResolver" @submit="onFormSubmit" class="bg-black-500 w-full">
        <InputText name="username" type="text" placeholder="Логин" class="w-full" />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
            $form.username.error?.message }}</Message>
        <Password name="password" type="text" placeholder="Пароль" class="mt-5" :feedback="false" toggleMask fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message }}</Message>

        <Button type="submit" label="Войти" class="w-full mt-5" />
    </Form>

    <Message v-if="successMessage != ''" severity="success" class="w-full flex justify-center mt-3">{{
        successMessage }}</Message>

    <Message v-if="errServerMessage != ''" severity="error" class="w-full flex justify-center mt-3">{{
        errServerMessage }}</Message>
</template>

<script>import { Form } from '@primevue/forms';
import api from "@/api.js";
import { Button, InputText, Password, Message } from 'primevue';
import router from '../../../../router';

export default {
    components: {
        InputText,
        Button,
        Password,
        Message,
        Form
    },

    mounted() {
        if (this.$route.query.success) {
            this.successMessage = "Данные успешно изменены"
        }
    },

    data() {
        return {
            initialValues: {
                username: '',
                password: '',
            },
            errServerMessage: '',
            successMessage: ''
        }
    },

    methods: {
        loginResolver({ values }) {
            const errors = { username: [], password: [] };

            if (!values.username) {
                errors.username.push({ type: 'required', message: 'Введите логин' });
            }

            if (!values.password) {
                errors.password.push({ type: 'required', message: 'Введите пароль' });
            }

            return {
                values,
                errors
            };
        },

        onFormSubmit(e) {
            this.successMessage = '';
            if (e.valid) {
                api.post("/login", { login: e.values.username, password: e.values.password })
                    .then(response => {
                        localStorage.setItem('token', response.data);
                        this.errServerMessage = '';
                        router.push("/me");
                    })
                    .catch(error => {
                        if (error.response.status === 401)
                            this.errServerMessage = error.response.data
                        else console.error("Real error:", error);
                    });
            }
        }
    }
}
</script>
