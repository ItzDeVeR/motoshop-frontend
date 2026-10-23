<script>import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import ProductCard from './Components/ProductCard.vue';
import Carousel from 'primevue/carousel';
import router from '../../../router';

export default {
    components: {
        Toolbar,
        Button,
        ProductCard,
        Carousel
    },
    data() {
        return {
            logos: ["DaineseLogo", "AirohLogo", "rurocLogo",
                "StylMartinLogo", "seventyDegreesLogo", "AxxisLogo"],
        }
    },
    methods: {
        authClick() {
            router.push("/login");
        }
    }
}
</script>

<template>
    <div class="mainDiv">
        <div class="ToolbarDiv">
            <div class="flex justify-between items-center"
                style="color: #fff; border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
                <div class="flex">
                    <i class="pi pi-prime" style="font-size: 2.5rem"></i>
                    <p style="font-size: 2rem; font-weight: bold; margin-left: 15px;">MOTOSHOP</p>
                </div>

                <div>
                    <Button label="Авторизация" @click="authClick" severity="secondary"
                        style="font-size: 1.5rem; margin-right: 10px;" />
                </div>
            </div>
        </div>

        <div class="FooterDiv">
            <p class="Title">Там, где живет свобода</p>
            <i class="pi pi-angle-double-down" style="font-size: 3rem; color: #fff;"></i>
        </div>
    </div>

    <p style="font-size: 3em; font-weight: bold; text-align: center; margin: 20px;">Каталог продукции</p>
    <div>
        <ProductCard />
    </div>

    <div>
        <p style="font-size: 3em; font-weight: bold; text-align: center; margin: 20px;">Наши бренды</p>
        <div class="logosDiv">
            <img v-for="item in logos" :src='"../../../public/" + item + ".png"' alt="photo" />
        </div>
    </div>

    <div class="footerTopDiv">
        <p class="SubscribeText">Подписаться на рассылку</p>
        <p class="footerTopText">Подпишитесь на нашу рассылку, чтобы первыми узнавать о последних тенденциях, новых
            поступлениях и эксклюзивных предложениях.<br>Вы можете отписаться в любое время.</p>
        <div class="EmailDiv">
            <input placeholder="Введите ваш email">
            <button>Подписаться</button>
        </div>
    </div>

    <div class="footerBottomDiv">
        <div class="Links">
            <a href="/">Политика конфиденциальности</a>
            <a href="/">Условия и положения</a>
            <a href="/">Вакансии</a>
        </div>
        <img src="../../../public/logos2.png" />
        <p>MOTOSHOP<br>© 2025 Все права защищены.</p>
    </div>

</template>

<style scoped>.mainDiv {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background:
        linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 100%), url('../../public/background.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;

}

.ToolbarDiv {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    border-radius: 50px;
    border: 1px solid #919191;
    margin: 10px 20px;

    position: sticky;
    top: 20px;

}

.FooterDiv {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    padding-bottom: 20px;
}

.Title {
    color: #ff2e2e;
    font-size: 4em;
    text-align: center;
}

.logosDiv {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center
}

.logosDiv img {
    width: 14em;
    margin: 14px;
}

.EmailDiv {
    display: flex;
    justify-content: center;
    padding: 50px;

}

.EmailDiv input {
    font-size: 20px;
    color: #000;
    border: 1px solid red;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;
    margin: 0px 40px;
}

.EmailDiv button {
    font-size: 20px;
    border-radius: 5px;
    background-color: red;
    color: #000;
    padding: 0px 20px;
    border: 0px;
    cursor: pointer;
}

.SubscribeText {
    font-size: 32px;
    font-weight: bold;
    margin: 40px auto;
    text-align: center;
}

.footerTopText {
    text-align: center;
    margin: 0 auto;
    margin-left: auto;
}

.footerTopDiv {
    display: flex;
    flex-direction: column;
    background: url("../../public/footer-top.jpg") center;
}

.footerTopDiv p {
    color: #000;
}

.footerBottomDiv {
    display: flex;
    background-color: #1A1A1A;
    justify-content: space-around;
    align-items: center;
    padding: 50px;
}

.footerBottomDiv p {
    color: #fff;
}

.footerBottomDiv img {
    width: 40vh;
    height: auto;
    margin: 20px 0;
}

.Links {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.Links a {
    text-decoration: none;
    color: #fff;
}

@media (max-width: 1024px) {
    .EmailDiv {
        flex-direction: column;
    }

    .EmailDiv button {
        margin-top: 10px;
        padding: 10px 0px;
    }

    .EmailDiv input {
        margin: 0px;
    }

    .footerBottomDiv {
        flex-direction: column;
    }

    .logosDiv :nth-child(2n) {
        display: none;
    }
}
</style>
