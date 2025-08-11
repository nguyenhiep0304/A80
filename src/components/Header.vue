<template>
    <div class="top-nav">

        <div class="nav-logo">
            <img src="../assets/images/logoA80.png" alt="" class="logo">
        </div>

        <!-- Button menu hien thi khi mobile -->
        <button class="menu-button" @click="isMenuOpen = !isMenuOpen">☰</button>

        <div class="nav-bar desktop-only">
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

        <!-- Menu xo xuong cho mobile -->
        <div v-if="isMenuOpen" class="dropdown-menu mobile-only">
            <button
                v-for="mode in displayModes"
                :key="mode.value"
                :class="{active: displayMode === mode.value}"
                @click="selectMode(mode.value)"
            >
                {{ mode.label }}
            </button>
        </div>

    </div>
</template>

<script setup>
import {ref} from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    displayModes: Array,
    displayMode: String,
})

const emit = defineEmits(['update:displayMode', 'menuToggle'])

const isMenuOpen = ref(false)

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
    emit('menuToggle', isMenuOpen.value)
}

function selectMode(value) {
    emit('update:displayMode', value)
    isMenuOpen.value = false // close menu
    emit('menuToggle', false)
}
</script>

<style scoped>
.top-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4rem;
    z-index: 1000;

    
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: space-between;
    
    /* display: flex;
    flex-wrap: wrap;
    gap: 16px; */

    /* overflow-x: auto; */

}

.nav-logo {
    position: relative;
    width: 5%;
    height: 3.8rem;
}

.logo {
    position: absolute;
    top: 0.6rem;
    left: 1rem;
    width: 3rem;
    z-index: 1001;
}

.mobile-only {
    display: none;
}

.desktop-only {
    display: flex;
}

.menu-button {
    display: none;
    max-width: 100px;
    color: white;
    background-color: #ff0000;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 400;
    text-align: center;
    transition: background-color 0.3s;

}

.menu-button:hover {
    background-color: #9c3636;
}

.nav-bar {
    width: 80%;
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
    padding: 0.3rem;
    border-radius: 0.3rem;
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

@media screen and (max-width: 768px) {
    .desktop-only {
        display: none;
    }

    .menu-button {
        display: block ;
        margin-left: 1rem;
    }

    .nav-logo {
        display: none;
    }

    .mobile-only {
        display: flex;
        flex-direction: column;
        background: white;
        position: absolute;
        top: 4rem;
        padding: 0.4rem;
        left: 0;
        width: 50%;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        z-index: 999;
    }

    .mobile-only button {
        border: none;
        height: 2rem;
        padding: 0.2rem;
        text-align: left;
        line-height: 1.4rem;
        align-content: center;
        border-radius: 4px;
        margin-bottom: 4px;
        color: white;
        background-color: #ff0000;
    }

    .mobile-only button.active {
        background-color: #af634c;
    }
}

/* @media screen and (min-width: 319px) and (max-width: 345px) {
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
        width: 50%;
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
        width: 50%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .mode-buttons {
        width: 50%;
        margin-left: 2%;
    } 
} */

/* @media screen and (min-width: 700px) {
    .nav-logo {
        width: 8%;
        margin-right: 10%;
    }
    .mode-buttons {
        margin-left: 2%;
    }
} */
</style>