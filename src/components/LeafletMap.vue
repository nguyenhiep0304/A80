<template>

  <Header
    :displayModes="displayModes"
    :displayMode="displayMode"
    @update:displayMode="(val) => displayMode = val"
  />

  <div id="map" style="height: 100vh" @click.self="hideControlBar">
    <img src="../assets/images/hanoi logo.png" alt="logo" class="map-logo">
    <div :class="['menu-control', { expanded: showControlBar }]">

      <!-- Nôi dung thông tin -->
      <transition name="fade">
        <div v-if="showControlBar" class="control-content">
          
          <!-- Thông tin hiển thị -->
          <div class="info-box">
            <p v-if="displayMode === 'none'">Chưa chọn chế độ hiển thị.</p>

            <div v-else-if="displayMode === 'toilets' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <table v-if="toiletDescriptionTableRows.length" class="description-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên địa điểm</th>
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

            <!-- <div v-else-if="displayMode === 'routes'">
              <h3 style="margin: 0;">Danh sách tuyến đường</h3>
              <ul class="route-list">
                <li
                  v-for="route in routes"
                  :key="route.id"
                  :class="{ active: selectedRouteId === route.id }"
                  @click="showOnlyRoute(route.id)"
                  style="cursor: pointer; padding: 4px 0;"
                >
                  {{ route.name }}
                </li>
              </ul>

              <div v-if="selectedName">
                <h4 style="margin: 8px 0 0;">{{ selectedName }}</h4>
                <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
              </div>
              <p v-else>Chọn một tuyến để xem chi tiết.</p>
            </div> -->

            <div v-else-if="displayMode === 'camxes' && selectedName">
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
              <p style="margin: 4px 0 0;" v-html="selectedLocation"></p>
              <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
            </div>
            
            <div v-else-if="displayMode === 'ytes' && selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <table v-if="yteDescriptionTableRows.length" class="description-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>Địa chỉ</th>
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
            <p v-else-if="displayMode === 'events'">Đang hiển thị địa điểm sự kiện.</p>
            <!-- <p v-else-if="displayMode === 'routes'">Đang hiển thị tuyến đường sự kiện.</p> -->
            <p v-else-if="displayMode === 'phaos'">Đang hiển thị địa điểm bắn pháo hoa.</p>
            <p v-else-if="displayMode === 'leds'">Đang hiển thị bảng led sự kiện.</p>
            <p v-else-if="displayMode === 'ytes'">Đang hiển thị địa điểm hỗ trợ y tế.</p>
            <p v-else-if="displayMode === 'toilets'">Đang hiển thị nhà vệ sinh công cộng.</p>

            <div v-else-if="selectedName">
              <h3 style="margin: 0;">{{ selectedName }}</h3>
              <p style="margin: 4px 0 0;" v-html="selectedDescription"></p>
            </div>
          </div>
          
        </div>
      </transition>
    </div>

    <!-- Danh sách tuyến đường -->
    <div 
      v-if="displayMode === 'routes'" 
      class="routes-list"
      :class="{ open: isRouteListOpen }"
      @mouseenter="map.scrollWheelZoom.disable()"
      @mouseleave="map.scrollWheelZoom.enable()"
    >
      <div class="routes-header" @click="isRouteListOpen = !isRouteListOpen">
        Danh sách tuyến đường
        <span style="float: right; cursor: pointer;">
          {{ isRouteListOpen ? '▼' : '▲' }}
        </span>
      </div>

      <!-- Ghi chú màu -->
      <div v-show="isRouteListOpen" class="routes-legend">
        <div><span class="legend-dot" style="background-color: #00b050;"></span> Tuyến đường tiến vào</div>
        <div><span class="legend-dot" style="background-color: #ff0000;"></span> Tuyến đường rút</div>
      </div>

      <ul v-show="isRouteListOpen">
        <li
          v-for="route in routeData"
          :key="route.id"
          @click="showOnlyRoute(route.id)"
          style="cursor: pointer;"
        >
          {{ route.name }}
        </li>
      </ul>  

      <button 
        class="showAll" 
        v-show="isRouteListOpen"
        @click="showAllRoutes"
      >
        Hiển thị tất cả
      </button>
    </div>
    <!-- button mobile -->
    <div class="leaflet-top leaflet-right">
      <div class="leaflet-control custom-dropdown">

      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-rotatedmarker'
import Header from '../components/Header.vue'

import toiletData from '../assets/data/toilets'
import eventData from '../assets/data/events'
import ledData from '../assets/data/leds'
import routeData from '../assets/data/routes'
import camData from '../assets/data/camxes'
import phaoData from '../assets/data/phaos'
import yteData from '../assets/data/ytes'
import doxeData from '../assets/data/doxes'

const displayModes = [
  { label: 'Sự kiện biểu diễn', value: 'events' },

  { label: 'Tuyến đường diễu binh', value: 'routes' },

  { label: 'Tuyến đường cấm xe', value: 'camxes' },

  { label: 'Điểm bắn pháo hoa', value: 'phaos' },

  { label: 'Điểm xem tốt nhất', value: 'leds' },

  { label: 'Điểm hỗ trợ y tế', value: 'ytes' },

  // { label: 'Điểm đỗ xe', value: 'doxes' },
  

  { label: 'Điểm vệ sinh công cộng', value: 'toilets' },

]

/* ---------- state chính ---------- */

const map = ref(null)
const displayMode = ref('')
const showControlBar = ref(false)
const selectedName = ref('')
const selectedDescription = ref('')
const selectedLocation = ref('')
const selectedRouteId = ref(null)
/* Mobile UI state */
const isMobile = ref(false)
const isRouteListOpen = ref(true) // mobile: vào 'routes' sẽ mở danh sách

/* ---------- layers ---------- */

const toiletLayer = ref(null)
const eventLayer = ref(null)
const ledLayer = ref(null)
const phaoLayer = ref(null)
const yteLayer = ref(null)
const doxeLayer = ref(null) // Layer cho điểm đỗ xe
const camLayer = ref(L.layerGroup()) // Layer cho tuyến đường cấm xe
const routeLayer = ref(L.layerGroup())//Layer cho tuyen duong dieu binh
// Tạo layer chứa điểm đầu và cuối
const startEndLayer = ref(L.layerGroup())

/* ---------- icons & data quan trọng ---------- */

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

const importantPoints = [
  { name: 'Cung thể thao Quần Ngựa', lat: 21.040457403537033, lng: 105.81447654890036, icon: iconQuanNgua },
  { name: 'Sân vận động Quốc gia Mỹ Đình', lat: 21.020693773632996, lng: 105.76389794557704, icon: iconQuanNgua },
  { name: 'Sân vận động Hàng Đẫy', lat: 21.02998137499817, lng: 105.83293464453926, icon: iconQuanNgua },
  { name: 'Lăng Chủ tịch Hồ Chí Minh', lat: 21.037127409547015, lng: 105.83467594057245, icon: iconLangBac },
  { name: 'Nhà hát Lớn Hà Nội', lat:21.024483794503695, lng: 105.85765305967625, icon: iconNhaHatLon },
  { name: 'Công viên Thống Nhất', lat: 21.014706895670013, lng: 105.84400146999552, icon: iconThongNhat },
  { name: 'Công Viên Bách Thảo', lat: 21.040434538547547, lng: 105.8308594450715, icon: iconThongNhat },

  { name: 'Điểm tập kết Cung thể thao Quần Ngựa', lat:21.04045445844579, lng:  105.81615992750083, icon: iconTapKet },
  { name: 'Điểm tập kết Công viên Thống Nhất', lat: 21.017185064858552, lng: 105.8443765749404, icon: iconTapKet },
  { name: 'Điểm tập kết Nhà hát Lớn Hà Nội', lat: 21.02443620543749, lng: 105.85693453870182, icon: iconTapKet },
  { name: 'Điểm tập kết Bộ Quốc Phòng', lat: 21.03413319200617, lng: 105.84115579463645, icon: iconTapKet },
  { name: 'Điểm tập kết Mỹ Đình', lat: 21.020450972440678, lng: 105.76604855878989, icon: iconTapKet },
  { name: 'Điểm tập kết Mỹ Đình', lat: 21.020697778355945, lng: 105.7666721915543, icon: iconTapKet },
  { name: 'Điểm tập kết Bách Thảo', lat: 21.038301886769077, lng: 105.83102128051381, icon: iconTapKet },
  { name: 'Điểm tập kết Sân vận động Hàng Đẫy', lat: 21.030078087336555, lng: 105.83230789220258, icon: iconTapKet },
  { name: 'Điểm tập kết Sân vận động Hàng Đẫy', lat: 21.029711271941636, lng: 105.83366829492047, icon: iconTapKet },
  { name: 'Điểm xuất phát Quán Thánh', lat: 21.04025451657421, lng: 105.84712118686237, icon: iconXuatPhat },
  { name: 'Điểm xuất phát Thanh Niên', lat: 21.05019459142148, lng: 105.8392539785411, icon: iconXuatPhat },
  { name: 'Điểm xuất phát Hoàng Hoa Thám', lat: 21.0419015365539, lng: 105.83366705846367, icon: iconXuatPhat },
  { name: 'Điểm xuất phát Phan Đình Phùng', lat: 21.039963782333963, lng: 105.84712628916525, icon: iconXuatPhat },
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
  iconUrl: new URL('../assets/images/ledmonitor.png', import.meta.url).href,
  iconSize: [48, 48],
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
//Icon Y te
const yteIcon = L.icon({
  iconUrl: new URL('../assets/images/benhvien.svg', import.meta.url).href,
  iconSize: [24, 24],
  iconAnchor: [16, 16],
  popupAnchor: [0, -32]
})
//Icon Do xe
const doxeIcon = L.icon({
  iconUrl: new URL('../assets/images/parking.png', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

/* ---------- helpers ---------- */

function drawAllRoutes() {
  routeLayer.value.clearLayers() // Xóa các tuyến đường hiện tại
  routeData.forEach(route => {
    route.paths.forEach(segment => {
      const polyline = L.polyline(segment.path, {
        color: segment.color,
        weight: 5,
        opacity: 0.8
      })
      polyline.on('click', () => {
        selectedName.value = route.name
        selectedDescription.value = route.description
        showControlBar.value = true
      })
      routeLayer.value.addLayer(polyline)
    })
  })
  routeLayer.value.addTo(map.value) // Thêm tất cả tuyến đường vào bản đồ
}

//Chi hien thi 1 tuyen duong
function showOnlyRoute(routeId) {
  routeLayer.value.clearLayers() // Xóa các tuyến đường hiện tại
  const route = routeData.find(r => r.id === routeId)
  if (route) {
    route.paths.forEach(segment => {
      const polyline = L.polyline(segment.path, {
        color: segment.color,
        weight: 5,
        opacity: 0.8
      })
      polyline.on('click', () => {
        selectedName.value = route.name
        selectedDescription.value = route.description
        showControlBar.value = true
      })
      routeLayer.value.addLayer(polyline)
    })
    showRouteStartEnd(route)
    // handleRouteClick(route.id)
    selectedName.value = route.name
    selectedDescription.value = route.description
  }
}

function showImportantPoints() {
  importantPoints.forEach((point) => {
    const marker = L.marker([point.lat, point.lng], {
      icon: point.icon,
      title: point.name,
    })

    marker.on('click', () => {
      selectedName.value = point.name
      selectedDescription.value = point.description || ''
      showControlBar.value = true
    })

    routeLayer.value.addLayer(marker)
  })
}

//Hien tat ca tuyen duong
function showAllRoutes() {
  clearRouteAndMarkers()
  routeLayer.value.clearLayers() // Xóa các tuyến đường hiện tại
  drawAllRoutes()
  showImportantPoints()
  selectedName.value = ''
  selectedDescription.value = ''
}

// Hàm đặt ngoài onMounted
function showRouteStartEnd(route) {
  startEndLayer.value.clearLayers()
  if (!route || !route.paths || route.paths.length === 0) return

  const firstSegment = route.paths[0].path
  const lastSegment = route.paths[route.paths.length - 1].path

  // Điểm xuất phát
  L.marker(firstSegment[0], { icon: iconXuatPhat }).addTo(startEndLayer.value)
  // Điểm tập kết
  L.marker(lastSegment[lastSegment.length - 1], { icon: iconTapKet }).addTo(startEndLayer.value)
}

// Xóa hết tuyến đường + điểm đầu–cuối
function clearRouteAndMarkers() {
  routeLayer.value.clearLayers()
  startEndLayer.value.clearLayers()
}

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

  // Thiết lập bản đồ
  const bounds = L.latLngBounds([
    [20.8, 105.7],
    [21.2, 106.0],
  ])

  const mapInstance = L.map('map', {
    // maxBounds: bounds,
    // maxBoundsViscosity: 0.0, // Cản không cho ra ngoài, nhưng không bật lại
    attributionControl: false, 
    zoomControl: false,
    maxZoom: 17,
    minZoom: 12,
  }).setView([21.037042159870733, 105.8358108494083], 16)

  map.value = mapInstance

  // Thêm layer vào map
  startEndLayer.value.addTo(mapInstance)
  routeLayer.value.addTo(mapInstance)

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
    fillOpacity: 0.2,
  }).addTo(mapInstance)

  baDinhArea.on('click', () => {
    selectedName.value = 'Khu vực quảng trường Ba Đình'
    const rawDescription = 'Thời gian: 6h30 02/09/2025. ; Ý nghĩa chương trình: Lễ diễu binh, diễu hành kỷ niệm 80 năm Cách mạng tháng Tám thành công và Quốc khánh nước Cộng hòa xã hội chủ nghĩa Việt Nam sẽ diễn ra vào sáng ngày 2 tháng 9 năm 2025.'

    const formattedDescription = rawDescription
    .replace(/Thời gian:/g, '<strong>Thời gian:</strong>')
    .replace(/Ý nghĩa chương trình:/g, '<strong>Ý nghĩa chương trình:</strong>')
    .replace(/; ?/g, '<br>')  // thay dấu phẩy (và khoảng trắng) bằng xuống dòng

    selectedDescription.value = formattedDescription
    showControlBar.value = true
  })

  L.marker([21.037127409547015, 105.83467594057245], { icon: iconLangBac }).addTo(mapInstance)

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
        selectedDescription.value = item.description
        .replace(/Địa điểm:/g, '<strong>Địa điểm:</strong>')
        .replace(/Thời gian:/g, '<strong>Thời gian:</strong>')
        .replace(/Ý nghĩa chương trình:/g, '<strong>Ý nghĩa chương trình:</strong>')
        .replace(/; \s*/g, '<br>')
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
        selectedLocation.value = item.location
        selectedDescription.value = item.description.replace(/; \s*/g, '<br>')
        showControlBar.value = true
      })
      return marker
    })
  )
  //Add diem ho tro y te
  yteLayer.value = L.layerGroup(
    yteData.map((item) => {
      const marker = L.marker([item.lat, item.lng], { icon: yteIcon})
      marker.on('click', () => {
        selectedName.value = item.name
        selectedDescription.value = item.description
        showControlBar.value = true
      })
      return marker
    })
  )
  //Add do xe
  doxeLayer.value = L.layerGroup(
    doxeData.map((item) => {
      const marker = L.marker([item.lat, item.lng], { icon: doxeIcon })
      marker.on('click', () => {
        selectedName.value = item.name
        selectedDescription.value = item.description
        showControlBar.value = true
      })
      return marker
    })
  )
  //Add cam routes
  camData.forEach(c => {
  // Nếu có nhiều đoạn (paths)
  if (c.paths && Array.isArray(c.paths)) {
    c.paths.forEach(segment => {
      const polyline = L.polyline(segment.path, {
        color: segment.color || c.color || "red",
        weight: 5,
        opacity: 0.8
      })

      polyline.on("click", () => {
        selectedName.value = c.name
        selectedDescription.value = c.description.replace(/; \s*/g, '<br>')
        showControlBar.value = true
      })

      camLayer.value.addLayer(polyline)
    })
  } 
  // Nếu chỉ có 1 đoạn (path)
  else if (c.path && Array.isArray(c.path)) {
    const polyline = L.polyline(c.path, {
      color: c.color || "red",
      weight: 5,
      opacity: 0.8
    })

    polyline.on("click", () => {
      selectedName.value = c.name
      selectedDescription.value = c.description.replace(/; \s*/g, '<br>')
      showControlBar.value = true
    })

    camLayer.value.addLayer(polyline)
  }
})


  //ADD routes update
  routeData.forEach(route => {
    route.paths.forEach(segment => {
      const polyline = L.polyline(segment.path, {
        color: segment.color,
        weight: 5,
        opacity: 0.8
      })

      polyline.on('click', () => {
        selectedName.value = route.name
        selectedDescription.value = route.description
        showControlBar.value = true
      })

      routeLayer.value.addLayer(polyline)
    })
  })  

  importantPoints.forEach((point) => {
    const marker = L.marker([point.lat, point.lng], {
      icon: point.icon,
      title: point.name,
    })

    marker.on('click', () => {
      selectedName.value = point.name,
        selectedDescription.value = point.description || ''
      showControlBar.value = true
    })

    routeLayer.value.addLayer(marker)

  })

})

//Chia bang dia diem nha ve sinh cong cong
const toiletDescriptionTableRows = computed(() => {
  if (!selectedDescription.value) return []
  const regex = /(\d+)\.([^:]+):\s*([^,]+)(?:,|$)/g
  const matches = [...selectedDescription.value.matchAll(regex)]

  return matches.map(match => ({
    number: match[1].trim(),
    name: match[2].trim(),
    address: match[3].trim()
  }))
})
//Chia bang dia diem ho tro y te
const yteDescriptionTableRows = computed(() => {
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
  
    // mapInstance.setView([21.037042159870733, 105.8358108494083], 16)
    // Chỉ định view và zoom theo chế độ
  if (mode === 'phaos' || mode === 'events') {
    mapInstance.setView([21.037042159870733, 105.8358108494083], 13) // zoom = 13
  } else {
    mapInstance.setView([21.037042159870733, 105.8358108494083], 16) // các chế độ khác zoom = 16
  }

  ;[toiletLayer.value, eventLayer.value, routeLayer.value, camLayer.value, ledLayer.value, phaoLayer.value, yteLayer.value, doxeLayer.value].forEach((layer) => {
    if (layer && mapInstance.hasLayer(layer)) {
      mapInstance.removeLayer(layer)
    }
  })

  // 🟡 Chặn truy cập "Tuyến đường diễu binh" trước ngày 20/8/2025
  // if (mode === 'routes') {
  //   const now = new Date()
  //   const releaseDate = new Date(2025, 7, 20) // tháng 8 là 7 trong JS
  //   if (now < releaseDate) {
  //     selectedName.value = 'Tuyến đường diễu binh'
  //     selectedDescription.value = 'Thông tin tuyến đường đang được cập nhật'
  //     showControlBar.value = true
  //     return
  //   }
  //   routeLayer.value.addTo(mapInstance)
  // } 

  clearRouteAndMarkers() // Xóa hết tuyến đường và điểm đầu–cuối

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
  } else if (mode === 'ytes' && yteLayer.value) {
    yteLayer.value.addTo(mapInstance)
  } else if (mode === 'camxes' && camLayer.value) {
    camLayer.value.addTo(mapInstance)
  } else if (mode === 'doxes' && doxeLayer.value) {
    doxeLayer.value.addTo(mapInstance)
  } 
})
</script>

<style scoped>

.map-logo {
  position: absolute;
  top: 10px;      /* cách viền trên */
  left: 10px;     /* cách viền trái */
  width: 60px;    /* kích thước ảnh */
  height: auto;
  z-index: 1000;  /* nổi trên bản đồ */
  pointer-events: none; /* để click xuyên qua ảnh */
}

.menu-control {
  position: absolute;
  top: 1rem;
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

.routes-list {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  min-width: 240px;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  font-family: Arial, sans-serif;
  z-index: 1000;
  border: 1px solid rgba(0,0,0,0.1);
}

.routes-list.open {
  transform: translateY(0rem);
}

.routes-header {
  padding: 12px;
  background: linear-gradient(135deg, #007bff, #00b4ff);
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
}

.routes-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 260px;
  overflow-y: auto;
  overflow-x: hidden;
}

.routes-list li {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #221313;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  transition: background 0.2s ease, transform 0.1s ease;
}

.routes-list li:hover {
  background: #f5faff;
  transform: translateX(4px);
}

.routes-list li:active {
  background: #e0f0ff;
}

.routes-legend {
  padding: 0.5rem 0.8rem;
  font-size: 0.9rem;
  color: #333;
}

.legend-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  margin-right: 6px;
  vertical-align: middle;
}

@media screen and (max-width: 768px) {
  .routes-list{
    /* position: relative; */
    max-width: 240px;
    bottom: 4rem;
    right: 0;
    margin: 0;
    width: 100%;
    transform: translateY(0);
  }

  .routes-list.mobile-hidden {
    transform: translateY(-100%);
  }

  .routes-header {
    padding: 8px;
    text-align: center;
  }

  .toggle-btn {
    padding: 6px 12px;
    background: #333;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }

  .toggle-btn:hover {
    background: #555;
  }

  .routes-list ul {
    text-align: center; /* Căn giữa tên tuyến đường */
  }
}
</style>
