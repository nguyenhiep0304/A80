<template>
    <div class="top-nav">
        <div class="nav-logo">
            <img src="../assets/images/logoA80.png" alt="" class="logo">
        </div>
        <div class="nav-bar">
            <div class="mode-buttons">
            <button
                v-for="mode in displayModes"
                :key="mode.value"
                :class="{ active: displayMode === mode.value }"
                @click="selectMode(mode.value)"
            >
                {{ mode.label }}
            </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    displayModes: Array,
    displayMode: String,
})

const emit = defineEmits(['update:displayMode'])

function selectMode(value) {
    emit('update:displayMode', value)
}
</script>

<style scoped>
.top-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3.2rem;
    z-index: 1000;

    
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    padding: 6px 12px;

    display: flex;
    
    /* display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 16px; */

    /* overflow-x: auto; */

}

.nav-logo {
    width: 15%;
    display: flex;
    align-items: center;
}

.logo {
    position: absolute;
    top: 0.6rem;
    left: 1rem;
    width: 3rem;
    height: auto;
    z-index: 1001;
}

.nav-bar {
    width: 70%;
    overflow-x: auto;  
    -webkit-overflow-scrolling: touch;
    /* display: flex;
    justify-content: center; */
}


.mode-buttons {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    white-space: nowrap;
    justify-content: center;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding: 6px;
    min-width: max-content;
}

.mode-buttons::-webkit-scrollbar {
    display: none !important;
}

.mode-buttons button {
    background-color: #ff0000;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: 400;
    font-size: 14px;
    word-spacing: 0.2rem;
    text-transform: uppercase;
    flex-shrink: 0;
    white-space: nowrap;
    min-width: 6rem;
}

.mode-buttons button.active {
    background-color: #af634c;
    color: white;
}

.mode-buttons button:hover {
    background-color: #b48383;
}

.leaflet-control-attribution {
    display: none !important;
}

@media screen and (min-width: 319px) and (max-width: 345px) {
    .nav-logo {
        width: 15%;
        margin-right: 10%;
    }
    .logo{
        position: absolute;
        left: 1rem;
    }
    .nav-bar {
        width: 50%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .mode-buttons {
        margin-left: 2%;
    }
}

@media screen and (min-width: 359px) and (max-width: 380px) {
    .nav-logo {
        width: 15%;
        margin-right: 10%;
    }
    .logo{
        position: absolute;
        left: 1rem;
    }
    .nav-bar {
        width: 60%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .mode-buttons {
        width: 50%;
        margin-left: 5%;
    } 
}

@media screen and (min-width: 381px) and (max-width: 600px) {
    .nav-logo {
        width: 15%;
        margin-right: 10%;
    }
    .logo{
        position: absolute;
        left: 1rem;
    }
    .nav-bar {
        width: 55%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .mode-buttons {
        width: 50%;
        margin-left: 2%;
    } 
}

@media screen and (min-width: 700px) {
    .nav-logo {
        width: 8%;
        margin-right: 10%;
    }
    .mode-buttons {
        margin-left: 2%;
    }
}
</style>