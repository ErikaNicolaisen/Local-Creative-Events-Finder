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
  },
  {
    id: 2,
    title: "Distortion X – Vesterbro",
    category: "sound",
    date: "June 4, 2026",
    location: "Jernbanebyen, Vesterbro, Copenhagen",
    description: "Sound assistant needed for Distortion X Vesterbro at the new Jernbanebyen venue. Work alongside professional sound engineers.",
    price: "Free entry + dinner",
    lat: 55.6697,
    lng: 12.5478
  },
  {
    id: 3,
    title: "Distortion Ø – Photography",
    category: "photography",
    date: "June 5, 2026",
    location: "Refshaleøen, Copenhagen",
    description: "Photograph the legendary Distortion Ø rave at Refshaleøen. Add incredible festival shots to your portfolio.",
    price: "Free festival pass",
    lat: 55.6934,
    lng: 12.6187
  },
  {
    id: 4,
    title: "Distortion Ø – Video Operator",
    category: "video",
    date: "June 6, 2026",
    location: "Refshaleøen, Copenhagen",
    description: "Operate video screens and live cameras at Distortion Ø finale night. Work with Peggy Gou and more on stage.",
    price: "Free festival pass + backstage",
    lat: 55.6920,
    lng: 12.6200
  },
  {
    id: 5,
    title: "Roskilde Festival – Stage Setup",
    category: "stage",
    date: "June 28, 2026",
    location: "Roskilde Festival, Roskilde",
    description: "Help build and tear down stages at Denmark's biggest festival. Physical work but incredible behind the scenes experience.",
    price: "Free festival pass",
    lat: 55.6441,
    lng: 12.0831
  },
  {
    id: 6,
    title: "Vega Live – Sound Assistant",
    category: "sound",
    date: "May 30, 2026",
    location: "Vega, Vesterbro, Copenhagen",
    description: "Assist the sound engineer at one of Copenhagen's most iconic venues. Learn live mixing on the job.",
    price: "Free entry + dinner",
    lat: 55.6697,
    lng: 12.5478
  },
  {
    id: 7,
    title: "Culture Box – DJ Shadow",
    category: "dj",
    date: "June 15, 2026",
    location: "Culture Box, Copenhagen",
    description: "Shadow a professional DJ for a full night at Culture Box. Learn the technical and creative side of DJing.",
    price: "Free entry",
    lat: 55.6784,
    lng: 12.5912
  },
  {
    id: 8,
    title: "CPH Opera – Video Operator",
    category: "video",
    date: "June 20, 2026",
    location: "Copenhagen Opera House",
    description: "Operate video screens and live feed cameras at the Opera House. Unique experience in a world class venue.",
    price: "Free ticket + backstage access",
    lat: 55.6783,
    lng: 12.5996
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
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#f1c1c1" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] }
]
  })
  renderMarkers()
  setupSearch()
  setupFilters()
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
        <div style="max-width:200px; font-family: Arial, sans-serif;">
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