<template>

  <Header
    :displayModes="displayModes"
    :displayMode="displayMode"
    @update:displayMode="(val) => displayMode = val"
  />

  <div id="map" style="height: 100vh" @click.self="hideControlBar">
    <div :class="['menu-control', { expanded: showControlBar }]">
      
      <!-- Nôi dung thông tin -->
      <transition name="fade">
        <div v-if="showControlBar" class="control-content">
          
          <!-- Thông tin hiển thị -->
          <div class="info-box">
            <p v-if="displayMode === 'none'">Chưa chọn chế độ hiển thị.</p>
            <div v-else-if="displayMode === 'toilets' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <table v-if="descriptionTableRows.length" class="description-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên địa điểm</th>
                    <th>Địa chỉ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in descriptionTableRows" :key="index">
                    <td>{{ row.number }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.address }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else-if="displayMode === 'routes' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
            </div>
            <div v-else-if="displayMode === 'events' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
            </div>
            <div v-else-if="displayMode === 'leds' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
            </div>
            <div v-else-if="displayMode === 'phaos' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
            </div>

            <p v-else-if="displayMode === 'toilets'">Đang hiển thị nhà vệ sinh công cộng.</p>
            <p v-else-if="displayMode === 'routes'">Đang hiển thị tuyến đường sự kiện.</p>
            <p v-else-if="displayMode === 'events'">Đang hiển thị địa điểm sự kiện.</p>
            <p v-else-if="displayMode === 'leds'">Đang hiển thị bảng led sự kiện.</p>
            <p v-else-if="displayMode === 'phaos'">Đang hiển thị địa điểm bắn pháo hoa.</p>
          </div>
          
        </div>
      </transition>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Header from '../components/Header.vue'
import 'leaflet-rotatedmarker'

import toiletData from '../assets/data/toilets'
import eventData from '../assets/data/events'
import ledData from '../assets/data/leds'
import routeData from '../assets/data/routes'
import phaoData from '../assets/data/phaos'


const displayModes = [
  { label: 'Sự kiện', value: 'events' },

  //{ label: 'Tuyến đường', value: 'routes' },

  { label: 'Pháo hoa', value: 'phaos' },

  //{ label: 'Led', value: 'leds' },

  { label: 'Nhà vệ sinh', value: 'toilets' },

  {label: 'Trạm Y tê', value: 'ytes'}
]


const map = ref(null)
const displayMode = ref('')
const showControlBar = ref(false)
const selectedName = ref('')
const selectedDescription = ref('')
// const showEvents = ref(false)

const toiletLayer = ref(null)
const eventLayer = ref(null)
const ledLayer = ref(null)
const phaoLayer = ref(null)
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
  iconAnchor: [16, 16],
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

const iconTapKet = L.icon({
  iconUrl: new URL('../assets/images/colordot.svg', import.meta.url).href,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -32]
})

const iconXuatPhat = L.icon({
  iconUrl: new URL('../assets/images/colordot_green.svg', import.meta.url).href,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -32]
})

const iconKhanDai = L.icon({
  iconUrl: new URL('../assets/images/khandai.svg', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -32]
})

const importantPoints = [
  { name: 'Cung thể thao Quần Ngựa', lat: 21.040457403537033, lng: 105.81447654890036, icon: iconQuanNgua },
  { name: 'Lăng Chủ tịch Hồ Chí Minh', lat: 21.03695097823098, lng: 105.83467757910672, icon: iconLangBac },
  { name: 'Nhà hát Lớn Hà Nội', lat:21.024483794503695, lng: 105.85765305967625, icon: iconNhaHatLon },
  { name: 'Công viên Thống Nhất', lat: 21.014706895670013, lng: 105.84400146999552, icon: iconThongNhat },
  { name: 'Cung thể thao Quần Ngựa', lat:21.04048592433416, lng: 105.81586602736573, icon: iconTapKet },
  { name: 'Công viên Thống Nhất', lat: 21.01726037172459, lng: 105.84504257602896, icon: iconTapKet },
  { name: 'Nhà hát Lớn Hà Nội', lat: 21.024282457567335, lng: 105.85726973768058, icon: iconTapKet },
  { name: 'Bo Quoc Phong', lat: 21.035639552104428, lng: 105.84119256591276, icon: iconTapKet },
  { name: 'My Dinh', lat: 21.020498371758954, lng: 105.76611054339655, icon: iconTapKet },
  { name: 'Yen Phu', lat: 21.05065442276042, lng: 105.83994491121301, icon: iconXuatPhat },
  { name: 'Quan Thanh', lat: 21.042791677122025, lng: 105.84015553085231, icon: iconXuatPhat },
  { name: 'Phan Dinh Phung', lat: 21.04098432786458, lng: 105.84005647224379, icon: iconXuatPhat },
  { name: 'Hoang Hoa Tham', lat: 21.04174771084369, lng: 105.83128881475909, icon: iconXuatPhat },
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
//Icon event
const eventIcon = L.icon({
  iconUrl: new URL('../assets/images/sankhau.svg', import.meta.url).href,
  iconSize: [48, 48],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})
//Icon Led monitor
const ledIcon = L.icon({
  iconUrl: new URL('../assets/images/ledmonitor.svg', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})
//Icon Phao hoa
const phaoIcon = L.icon({
  iconUrl: new URL('../assets/images/phaohoa.svg', import.meta.url).href,
  iconSize: [48, 48],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// 🟨 Chặn sự kiện scroll trong vùng .control-content để không ảnh hưởng bản đồ
function stopWheelPropagation(event) {
  event.stopPropagation()
  event.preventDefault()
}

onMounted(() => {
  const controlContentEl = document.querySelector('.control-content')
  if (controlContentEl) {
    controlContentEl.addEventListener('wheel', (event) => {
      event.preventDefault()
      event.stopPropagation()
    }, { passive: false })
  }
  const el = document.querySelector('control-content')
  if (el) {
    L.DomEvent.disableScrollPropagation(el)
    L.DomEvent.disableClickPropagation(el)
  }

  // Thiết lập bản đồ
  const bounds = L.latLngBounds([
    [20.995, 105.78],
    [21.08, 105.91],
  ])

  const mapInstance = L.map('map', {
    //maxBounds: bounds,
    //maxBoundsViscosity: 0.1,
    attributionControl: false, 
    zoomControl: false,
  }).setView([21.037042159870733, 105.8358108494083], 16)

  map.value = mapInstance

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 17,
    minZoom: 12,
  }).addTo(mapInstance)

  mapInstance.on('moveend', () => {
    if (!bounds.contains(mapInstance.getCenter())) {
      mapInstance.panInsideBounds(bounds, { animate: true })
    }
  })

  // Vung bao Ba Dinh
  const baDinhArea = L.polygon([
    [21.038847491898615, 105.83708248153141],
    [21.03544523706299, 105.83635061394801],
    [21.035911702634333, 105.83408056705824],
    [21.039171322058184, 105.8350981719592]
  ], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0,
  }).addTo(mapInstance)

  L.marker([21.037127409547015, 105.83467594057245], { icon: iconLangBac }).addTo(mapInstance)
  L.marker([21.036174272004658, 105.83469100735387], { icon: iconKhanDai, rotationAngle: 100, rotationOrigin: 'center' }).addTo(mapInstance)
  L.marker([21.037276045230037, 105.83492293194801], { icon: iconKhanDai, rotationAngle: 100, rotationOrigin: 'center' }).addTo(mapInstance)

  //Add Toilets
  toiletLayer.value = L.layerGroup(
    toiletData.map((item) => {
      const marker = L.marker([item.lat, item.lng], { icon: toiletIcon })
      marker.on('click', () => {
        selectedName.value = item.name
        selectedDescription.value = item.description
        showControlBar.value = true
      })
      return marker
    })
  )
  //Add events
  eventLayer.value = L.layerGroup(
    eventData.map((item) => {
      const marker = L.marker([item.lat, item.lng], { icon: eventIcon })
      marker.on('click', () => {
        selectedName.value = item.name
        selectedDescription.value = item.description.replace(/; \s*/g, '<br>')
        showControlBar.value = true
      })
      return marker
    })
  )
  //Add led
  ledLayer.value = L.layerGroup(
    ledData.map((item) => {
      const marker = L.marker([item.lat, item.lng], { icon: ledIcon })
      marker.on('click', () => {
        selectedName.value = item.name
        selectedDescription.value = item.description.replace(/, \s*/g, '<br>')
        showControlBar.value = true
      })
      return marker
    })
  )
  //Add Phao hoa
  phaoLayer.value = L.layerGroup(
    phaoData.map((item) => {
      const marker = L.marker([item.lat, item.lng], { icon: phaoIcon })
      marker.on('click', () => {
        selectedName.value = item.name
        selectedDescription.value = item.description.replace(/; \s*/g, '<br>')
        showControlBar.value = true
      })
      return marker
    })
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

//Chia bang dia diem nha ve sinh cong cong
const descriptionTableRows = computed(() => {
  if (!selectedDescription.value) return []
  const regex = /(\d+)\.([^:]+):\s*([^,]+)(?:,|$)/g
  const matches = [...selectedDescription.value.matchAll(regex)]

  return matches.map(match => ({
    number: match[1].trim(),
    name: match[2].trim(),
    address: match[3].trim()
  }))
})


watch(displayMode, (mode) => {
  const mapInstance = map.value
  selectedName.value = ''
  selectedDescription.value = ''
  if (!mapInstance) return

  ;[toiletLayer.value, eventLayer.value, routeLayer.value, ledLayer.value, phaoLayer.value].forEach((layer) => {
    if (layer && mapInstance.hasLayer(layer)) {
      mapInstance.removeLayer(layer)
    }
  })

  if (mode === 'toilets' && toiletLayer.value) {
    toiletLayer.value.addTo(mapInstance)
  } else if (mode === 'events' && eventLayer.value) {
    eventLayer.value.addTo(mapInstance)
  } else if (mode === 'routes' && routeLayer.value) {
    routeLayer.value.addTo(mapInstance)
  } else if (mode === 'leds' && ledLayer.value) {
    ledLayer.value.addTo(mapInstance)
  } else if (mode === 'phaos' && phaoLayer.value) {
    phaoLayer.value.addTo(mapInstance)
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
