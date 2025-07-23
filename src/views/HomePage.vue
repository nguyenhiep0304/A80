<template>
<!-- File: HomePage.vue -->
    <div>
        <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
        <div class="min-h-screen flex flex-col items justify-center bg-cover bg-center bg-no-repeat bg-fixed">
            <button @click="goToMap" class="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded font-semibold">GO TO MAP</button>
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
    button {
        position: absolute;
        bottom: 5rem;
        transform: translate(-50%, 50%);
        font-size: 1.2rem;
    }
</style>

