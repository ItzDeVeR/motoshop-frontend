<template>
    <div class="MainDiv">
        <a href="/catalog" class="CurrentCard" :key="n" v-for="n in allData">
            <p>{{ n.name }}</p>
            <img :src="n.imgsrc" />
        </a>
    </div>
</template>

<script>export default {
    data() {
        return {
            allData: [
                {
                    name: "Шлема",
                    imgsrc: "../../../../public/helmetLogo.png"
                },
                {
                    name: "Куртки",
                    imgsrc: "../../../../public/jacketLogo.png"
                },
                {
                    name: "Штаны",
                    imgsrc: "../../../../public/pantsLogo.png"
                },
                {
                    name: "Ботинки",
                    imgsrc: "../../../../public/bootsLogo.png"
                },
                {
                    name: "Перчатки",
                    imgsrc: "../../../../public/glovesLogo.png"
                },
                {
                    name: "Аксессуары",
                    imgsrc: "../../../../public/accessoriesLogo.png"
                },
            ]
        }
    }
}
</script>

<style scoped>.CurrentCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    text-decoration: none;
    color: #000;
    font-size: 3em;
    padding: 0px 100px;
}

.CurrentCard img {
    object-fit: cover;

    width: 14rem;
}

.CurrentCard:hover {
    background-color: #dbdbdb;
}

.MainDiv {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

}

@media (max-width: 1024px) {
    .CurrentCard {
        padding: 0;
    }
}
</style>
