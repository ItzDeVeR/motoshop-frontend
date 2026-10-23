<template>
    <div class="SkeletonCard">
        <Skeleton style="margin: 0.7px 0px;" height="13rem" />
        <Skeleton style="margin: 10px;" height="1.5rem" />
        <Skeleton style="margin: 0px 10px;" height="1rem" />
        <Skeleton style="margin: 10px;" height="5rem" />
        <Skeleton style="margin: 10px 10px;" height="2rem" />
    </div>

</template>

<script>import Skeleton from 'primevue/skeleton';

export default {
    components: {
        Skeleton
    }
}
</script>

<style scoped>.SkeletonCard {
    width: 25rem;
    border-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    margin: 10px;
    border: 1px solid lightgray;
}
</style>
