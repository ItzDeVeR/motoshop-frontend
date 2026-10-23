<template>
    <Card style="width: 25rem; margin: 10px; overflow: hidden">
        <template #header>
            <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png" />
        </template>
        <template #title>{{ motoItem.title }}</template>
        <template #subtitle>{{ motoItem.subtitle }}</template>
        <template #content>
            <p class="m-0">
                {{ motoItem.content }}
            </p>
        </template>
        <template #footer>
            <div>
                <Button label="Order" style="width: 100%;" />
            </div>
        </template>
    </Card>
</template>

<script>import Card from 'primevue/card';
import Button from 'primevue/button';

export default {
    props: {
        motoItem: Object
    },

    components: {
        Card,
        Button
    }
}
</script>
