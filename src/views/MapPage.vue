<template>
<!-- File: MapPage.vue -->
    <div class="map-fullscreen">
        <LeafletMap />
    </div>
</template>

<script setup>
import LeafletMap from '../components/LeafletMap.vue';
</script>

<style scoped>
.map-fullscreen {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
</style>
