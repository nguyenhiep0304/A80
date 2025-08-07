<template>
    <div class="info-box">
        <!-- Trường hợp chưa chọn gì -->
        <p v-if="displayMode === 'none'">Chưa chọn chế độ hiển thị.</p>
    
        <!-- Nhà vệ sinh công cộng -->
        <div v-else-if="displayMode === 'toilets' && selectedName">
            <h3>{{ selectedName }}</h3>
            <table v-if="toiletDescriptionTableRows.length" class="description-table">
            <thead>
                <tr>
                <th>STT</th>
                <th>Địa điểm</th>
                <th>Địa chỉ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in toiletDescriptionTableRows" :key="index">
                <td>{{ row.number }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.address }}</td>
                </tr>
            </tbody>
            </table>
        </div>
    
        <!-- Trạm y tế -->
        <div v-else-if="displayMode === 'medical' && selectedName">
            <h3>{{ selectedName }}</h3>
            <table v-if="yteDescriptionTableRows.length" class="description-table">
            <thead>
                <tr>
                <th>STT</th>
                <th>Chương trình</th>
                <th>Thời gian</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in yteDescriptionTableRows" :key="index">
                <td>{{ row.number }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.address }}</td>
                </tr>
            </tbody>
            </table>
        </div>
        <p v-else-if="displayMode === 'toilets'">Đang hiển thị nhà vệ sinh công cộng.</p>
        <p v-else-if="displayMode === 'routes'">Đang hiển thị tuyến đường sự kiện.</p>
        <p v-else-if="displayMode === 'events'">Đang hiển thị địa điểm sự kiện.</p>
        <p v-else-if="displayMode === 'leds'">Đang hiển thị màn hình led sự kiện.</p>
        <p v-else-if="displayMode === 'phaos'">Đang hiển thị địa điểm bắn pháo hoa.</p>
        <p v-else-if="displayMode === 'ytes'">Đang hiển thị địa điểm hỗ trợ y tế.</p>
    
        <!-- Các chế độ khác: hiện raw HTML -->
        <div v-else-if="selectedDescription">
            <h3>{{ selectedName }}</h3>
            <div v-html="selectedDescription" class="description-html"></div>
        </div>
    </div>

</template>


<script setup>
import { onMounted } from 'vue'
    
    defineProps({
        displayMode: String,
        selectedName: String,
        selectedDescription: String,
        toiletDescriptionTableRows: {
        type: Array,
        default: () => []
        },
        yteDescriptionTableRows: {
        type: Array,
        default: () => []
        }
    })

    onMounted(() => {
        const infoBox = document.querySelector('.info-box')
        if (infoBox) {
            // Ngăn sự kiện cuộn từ phần tử này truyền lên bản đồ
            L.DomEvent.disableScrollPropagation(infoBox)
        }

        const menuControl = document.querySelector('.menu-control')
        if (menuControl) {
            L.DomEvent.disableScrollPropagation(menuControl)
        }
    })
</script>
    
<style scoped>
    .menu-control {
        position: absolute;
        top: 4.6rem;
        right: 0.5rem;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(6px);
        padding: 12px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: 10px;
        transition: min-width 0.3s ease;
        overflow: hidden;
    }

    .menu-control.expanded {
        height: auto;
        min-width: 240px;
        max-width: 360px;
    }

    .menu-button {

        max-width: 100px;
        color: white;
        background-color: #3498db;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        text-align: center;
        transition: background-color 0.3s;

    }

    .menu-button:hover {
        background-color: #2980b9;
    }

    .control-content {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 0.95rem;
        max-height: 400px;
        overflow-y: auto;
        box-sizing: border-box;
    }

    select {
        padding: 8px;
        font-size: 1rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        background-color: #fff;
    }

    .info-box {
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        color: #333;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
        overflow-y: auto;
        height: auto;
    
    }

    .info-box p{
        text-align: left;
        padding: 0.5rem;
    }

    .description-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 6px;
        font-size: 14px;
    }

    .description-table th,
    .description-table td {
        border: 1px solid #ddd;
        padding: 6px 8px;
        text-align: left;
        vertical-align: top;
    }

    .description-table thead {
        background-color: #f0f0f0;
        font-weight: bold;
    }


    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>  