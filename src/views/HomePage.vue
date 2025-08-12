<template>
<!-- File: HomePage.vue -->
    <div id="map">
        <div class="min-h-screen flex flex-col items justify-center bg-cover bg-center bg-no-repeat bg-fixed">
            <button @click="goToMap" class="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded font-semibold main-button">BẮT ĐẦU KHÁM PHÁ</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

    function goToMap() {
        router.push('/map');
    }
</script>

<style scoped>

    #map{
        height: 100vh;
        width: 100vw;
        background-image: url('../assets/images/bandoUIBG.jpg'); /* Đường dẫn ảnh */
        background-size: cover;    /* Bao phủ toàn bộ */
        background-position: center center; /* Canh giữa */
        background-repeat: no-repeat;
    }

    .main-button{
        position: absolute;
        bottom: 3rem;
        transform: translate(-50%, 50%);
        font-size: 1.2rem;
        color:white;
        background: #b11e22;
        white-space: nowrap;
    }

    @media screen and (max-width: 380px) {
        .guide-container img {
            bottom: -1rem;
            transform: scale(50%) !important;
        }
        .main-button {
            bottom: 3rem;
        }
    }
    @media screen and (min-width: 700px) {
        .guide-container img {
            transform: scale(65%);
            bottom: 3rem;
        }
    }
</style>

