<template>
  <div id="map" style="height: 100vh" @click.self="hideControlBar">
    <div :class="['menu-control', { expanded: showControlBar }]">
      <button class="menu-button" @click.stop="toggleControlBar">☰ Menu</button>

      <transition name="fade">
        <div v-if="showControlBar" class="control-content">
          <label for="displayMode">Chế độ hiển thị:</label>
          <select id="displayMode" v-model="displayMode">
            <option value="none">Không hiển thị</option>
            <option value="toilets">Nhà vệ sinh</option>
            <option value="routes">Tuyến đường</option>
            <option value="stations">Khán đài</option>
          </select>

          <!-- Thông tin hiển thị -->
          <div class="info-box">
            <p v-if="displayMode === 'none'">Chưa chọn chế độ hiển thị.</p>
            <div v-else-if="displayMode === 'toilets' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
            </div>
            <div v-else-if="displayMode === 'routes' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
            </div>
            <p v-else-if="displayMode === 'routes'">Đang hiển thị tuyến đường sự kiện.</p>
            <p v-else-if="displayMode === 'stations'">Đang hiển thị vị trí các khán đài.</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import toiletData from '../assets/data/toilets'
import stationData from '../assets/data/stations'
import routeData from '../assets/data/routes'


const map = ref(null)
const displayMode = ref('none')
const showControlBar = ref(false)
const selectedName = ref('')
const selectedDescription = ref('')

const toiletLayer = ref(null)
const stationLayer = ref(null)
const routeLayer = ref(L.layerGroup())

const iconQuanNgua = L.icon({
  iconUrl: new URL('../assets/images/sanvandong.svg', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

const iconLangBac = L.icon({
  iconUrl: new URL('../assets/images/langbac.svg', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

const iconNhaHatLon = L.icon({
  iconUrl: new URL('../assets/images/nhahatlon.svg', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

const iconThongNhat = L.icon({
  iconUrl: new URL('../assets/images/congvienthongnhat.svg', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

const importantPoints = [
  { name: 'Quần Ngựa', lat: 21.040457403537033, lng: 105.81447654890036, icon: iconQuanNgua },
  { name: 'Lăng Bác', lat: 21.037127409547015, lng: 105.83467594057245, icon: iconLangBac },
  { name: 'Nhà hát lớn', lat:21.024483794503695, lng: 105.85765305967625, icon: iconNhaHatLon },
  { name: 'Công viên Thống Nhất', lat: 21.014706895670013, lng: 105.84400146999552, icon: iconThongNhat },
]


const toggleControlBar = () => {
  showControlBar.value = !showControlBar.value
}

const hideControlBar = () => {
  showControlBar.value = false
}


//Icon wc
const toiletIcon = L.icon({
  iconUrl: new URL('../assets/images/wc icon.svg', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

// 🟨 Chặn sự kiện scroll trong vùng .control-content để không ảnh hưởng bản đồ
let controlContentEl = null

function stopWheelPropagation(event) {
  event.stopPropagation()
  event.preventDefault()
}

onMounted(() => {
  controlContentEl = document.querySelector('.control-content')
  if (controlContentEl) {
    controlContentEl.addEventListener('wheel', stopWheelPropagation, { passive: false })
  }

  // Thiết lập bản đồ
  const bounds = L.latLngBounds([
    [20.995, 105.78],
    [21.08, 105.91],
  ])

  const mapInstance = L.map('map', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
  }).setView([21.037042159870733, 105.8358108494083], 16)

  map.value = mapInstance

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    minZoom: 12,
  }).addTo(mapInstance)

  mapInstance.on('moveend', () => {
    if (!bounds.contains(mapInstance.getCenter())) {
      mapInstance.panInsideBounds(bounds, { animate: true })
    }
  })
  //Add Toilets
  toiletLayer.value = L.layerGroup(
    toiletData.map((item) => {
      const marker = L.marker([item.lat, item.lng], { icon: toiletIcon })
      marker.on('click', () => {
        selectedName.value = item.name
        selectedDescription.value = item.description.replace(/,\s*/g, '<br>')
        showControlBar.value = true
      })
      return marker
    })
  )
  //Add stations
  stationLayer.value = L.layerGroup(
    stationData.map((item) => L.marker([item.lat, item.lng]).bindPopup(`<h3>${item.name}</h3><p>${item.description}</p>`))
  )
  //Add routes
  routeData.forEach(route => {
    const polyline = L.polyline(route.path, {
      color: route.color,
      weight: 5,
      opacity: 0.8
    })
    polyline.on('click', () => {
      selectedName.value = route.name,
        selectedDescription.value = route.description.replace(/,\s*/g, '<br>')
      showControlBar.value = true
    })
    routeLayer.value.addLayer(polyline)
  })
  importantPoints.forEach((point) => {
    const marker = L.marker([point.lat, point.lng], {
      icon: point.icon,
      title: point.name,
    }).bindPopup(`<strong>${point.name}</strong>`)
    routeLayer.value.addLayer(marker)
  })

})

watch(displayMode, (mode) => {
  const mapInstance = map.value
  selectedName.value = ''
  selectedDescription.value = ''
  if (!mapInstance) return

  ;[toiletLayer.value, stationLayer.value, routeLayer.value].forEach((layer) => {
    if (layer && mapInstance.hasLayer(layer)) {
      mapInstance.removeLayer(layer)
    }
  })

  if (mode === 'toilets' && toiletLayer.value) {
    toiletLayer.value.addTo(mapInstance)
  } else if (mode === 'stations' && stationLayer.value) {
    stationLayer.value.addTo(mapInstance)
  } else if (mode === 'routes' && routeLayer.value) {
    routeLayer.value.addTo(mapInstance)
  }
})
</script>

<style scoped>
.menu-control {
  position: absolute;
  top: 20px;
  right: 20px;
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
  min-width: 70px;
  transition: min-width 0.3s ease;
  overflow: hidden;
}

.menu-control.expanded {
  min-width: 360px;
  max-width: 360px;
}

.menu-button {
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
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
  max-height: 500px;
  
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
