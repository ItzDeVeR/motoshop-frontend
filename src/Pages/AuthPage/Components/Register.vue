<template>
    <h1 class="text-5xl text-hubGray font-bold my-5">Регистрация</h1>
    <Form v-slot="$form" :initialValues :resolver="loginResolver" @submit="onFormSubmit" class="bg-black-500 w-2xs">
        <InputText name="firstname" type="text" placeholder="Имя" class="w-full" />
        <Message v-if="$form.firstname?.invalid" severity="error" size="small" variant="simple">{{
            $form.firstname.error?.message }}</Message>

        <InputText name="username" type="text" placeholder="Логин" class="w-full mt-3" />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
            $form.username.error?.message }}</Message>

        <Password name="password" type="text" placeholder="Пароль" class="mt-3" :feedback="false" toggleMask fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message }}</Message>

        <Password name="repeatpassword" type="text" placeholder="Повторите пароль" class="mt-3" :feedback="false"
            toggleMask fluid />
        <Message v-if="$form.repeatpassword?.invalid" severity="error" size="small" variant="simple">{{
            $form.repeatpassword.error?.message }}</Message>

        <Button type="submit" label="Зарегистрироваться" class="w-full mt-3" />
    </Form>

    <Message v-if="errServerMessage != ''" severity="error" class="w-full flex justify-center mt-3 w-xs text-center">{{
        errServerMessage }}</Message>
    <Message v-if="goodMessage != ''" severity="success" class="w-full flex justify-center mt-3">{{
        goodMessage }}</Message>

</template>

<script>import { Form } from '@primevue/forms';
import axios from 'axios';
import { Button, InputText, Password, Message } from 'primevue';
import api from "@/api.js";

export default {
    components: {
        InputText,
        Button,
        Password,
        Message,
        Form
    },

    data() {
        return {
            initialValues: {
                username: '',
                password: '',
                repeatpassword: ''
            },
            errServerMessage: '',
            goodMessage: ''
        }
    },
    methods: {
        loginResolver({ values }) {
            const errors = { firstname: [], username: [], password: [], repeatpassword: [] };

            if (!values.firstname) {
                errors.firstname.push({ type: 'required', message: 'Введите имя' });
            }

            if (!values.username) {
                errors.username.push({ type: 'required', message: 'Введите логин' });
            }

            if (!values.password) {
                errors.password.push({ type: 'required', message: 'Введите пароль' });
            }

            if (values.password !== values.repeatpassword) {
                errors.repeatpassword.push({ type: 'required', message: 'Повторите введеный пароль' });
            }

            return {
                values,
                errors
            };
        },

        onFormSubmit(e) {
            if (e.valid) {
                api.post("/register", { firstname: e.values.firstname, login: e.values.username, password: e.values.password })
                    .then(response => {
                        this.errServerMessage = '';
                        this.goodMessage = response.data;
                        e.reset();
                    })
                    .catch(error => {
                        if (error.response.status === 401 || error.response.status === 400)
                            this.errServerMessage = error.response.data
                        else console.error("Real error:", error);
                    });
            }
        }
    }
}
</script>
