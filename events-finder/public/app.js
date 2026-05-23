const events = [
  {
    id: 1,
    title: "Distortion X – Rådhuspladsen",
    category: "lighting",
    date: "June 3, 2026",
    location: "Rådhuspladsen, Copenhagen",
    description: "Help with stage lighting at Distortion X opening night on Copenhagen's iconic City Hall Square. Massive crowd, unforgettable experience.",
    price: "Free festival pass",
    lat: 55.6761,
    lng: 12.5683
  }
]

let activeCategory = 'all'
let searchTerm = ''
let map
let markers = []

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 55.6761, lng: 12.5683 },
    zoom: 13,
styles: [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#ee9841" }] },
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },
  { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#f5f0eb" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#f30909" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#007bff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#f91212" }] },
  { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#ffe0e0" }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ec2121" }] },
  { featureType: "park", elementType: "geometry.fill", stylers: [{ color: "#daede9" }] },
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#f4d3d3" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] }
]
  })
  renderMarkers()
  setupSearch()
  setupFilters()
  loadScrapedEvents()
}

function renderMarkers() {
  markers.forEach(marker => marker.setMap(null))
  markers = []

  const filtered = events.filter(event => {
    const matchesCategory = activeCategory === 'all' || event.category === activeCategory
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  filtered.forEach(event => {
    const marker = new google.maps.Marker({
      position: { lat: event.lat, lng: event.lng },
      map: map,
      title: event.title
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width:500px; font-family: Arial, sans-serif;">
          <strong style="color:#c0566a;">${event.title}</strong><br>
          <span style="color:#888;">📅 ${event.date}</span><br>
          <span style="color:#888;">📍 ${event.location}</span><br><br>
          <a href="event.html?id=${event.id}" 
             style="background:#e9899b;color:white;padding:5px 10px;
                    border-radius:4px;text-decoration:none;font-size:0.85rem;">
            See more
          </a>
        </div>
      `
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    markers.push(marker)
  })
}

function setupSearch() {
  const input = document.getElementById('search-input')
  input.addEventListener('input', (e) => {
    searchTerm = e.target.value
    renderMarkers()
  })
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filter-btn')
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'))
      button.classList.add('active')
      activeCategory = button.dataset.category
      renderMarkers()
    })
  })
}

  async function loadScrapedEvents() {
  try {
    const response = await fetch('http://localhost:3000/events')
    const scraped = await response.json()
    scraped.forEach(event => events.push(event))
    renderMarkers()
  } catch (err) {
    console.error('Could not load scraped events:', err)
  }
}