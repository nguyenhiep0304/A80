<template>
    <div class="top-nav">

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
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    max-width: 80vw;
    z-index: 1000;
    border-radius: 0.75rem;

    /* Nền mờ + gradient */
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    display: flex;
    align-items: center;
    padding: 0 1rem;

    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

/* Chrome, Edge, Safari */
.top-nav::-webkit-scrollbar {
    height: 6px; /* Thanh cuộn ngang */
}

.top-nav::-webkit-scrollbar-track {
    background: transparent;
}

.top-nav::-webkit-scrollbar-thumb {
    background: #888; /* Màu thanh cuộn */
    border-radius: 3px;
}

.top-nav::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/*
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
*/

.mobile-only {
    display: none;
}

.desktop-only {
    display: flex;
}

.nav-bar {
    width: max-content;
    padding: 0.1rem;
}

.nav-bar .desktop-only {
    display: flex;
    justify-content: flex-start;
    width: max-content;
    padding-left: 10%;
}


.mode-buttons {
    display: flex;
    gap: 10px;
    padding: 6px 0;
    overflow-x: auto;
    white-space: nowrap;
    min-width: max-content;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.mode-buttons::-webkit-scrollbar {
    display: none !important;
}

.mode-buttons button {
    background: #b11e22;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 14px;
    word-spacing: 0.2rem;
    flex-shrink: 0;
    white-space: nowrap;
    text-transform: uppercase;
    min-width: 6rem;
}

.mode-buttons button.active {
    background: #c54f53;
    transform: scale(1.05);
    color: white;
}

.mode-buttons button:hover {
    opacity: 0.85;
    transform: translateY(-1px);
}

.menu-button {
    display: none;
    border: none;
    background: none;
    max-width: 100px;
    color: white;
    background: #b11e22;
    font-size: 1rem;
    font-weight: 400;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s ease;

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
    }

    .top-nav {
        width: 100vw;
        position: fixed;
        bottom: 0;
        top: auto;
        padding: 0.5rem;
    }

    .mobile-only {
        display: flex;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.95);;
        position: absolute;
        bottom: 4rem;
        margin-left: 0.6rem;
        padding: 0.4rem;
        left: 0;
        width: 50%;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        gap: 6px;
        z-index: 1001;
    }

    .mobile-only button {
        border: none;
        color: white;
        height: 2rem;
        padding: 0.4rem;
        line-height: 1.4rem;
        align-content: center;
        border-radius: 0.4rem;
        background: #b11e22;
    }

    .mobile-only button.active {
        background: #c54f53;
        transform: scale(1.05);
        color: white;
    }

    .mobile-only button:hover {
        opacity: 0.85;
        transform: translateY(-1px);
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