const events = [
  {
    id: 1,
    title: "Art in the Park",
    category: "exhibition",
    date: "April 10, 2026",
    location: "Kongens Have, Copenhagen",
    description: "An outdoor art exhibition in the beautiful Kongens Have park.",
    price: "100 DKK",
    lat: 55.6867,
    lng: 12.5772
  },
  {
    id: 2,
    title: "Knitting Workshop",
    category: "workshop",
    date: "April 15, 2026",
    location: "Absalons Kirken, Copenhagen",
    description: "Learn to knit with friendly locals in a cosy church setting.",
    price: "Free",
    lat: 55.6717,
    lng: 12.5617
  },
  {
    id: 3,
    title: "Crochet a Teddy Bear",
    category: "workshop",
    date: "April 20, 2026",
    location: "Mokkariet, Copenhagen",
    description: "Crochet your own teddy bear and enjoy a free coffee!",
    price: "50 DKK + free coffee",
    lat: 55.6894,
    lng: 12.5590
  },
  {
    id: 4,
    title: "Craft Market Nørrebro",
    category: "market",
    date: "April 25, 2026",
    location: "Nørrebro, Copenhagen",
    description: "A vibrant market full of handmade crafts and local artisans.",
    price: "Free entry",
    lat: 55.6935,
    lng: 12.5530
  },
  {
    id: 5,
    title: "Photography Exhibition",
    category: "exhibition",
    date: "May 1, 2026",
    location: "Vesterbro, Copenhagen",
    description: "Local photographers showcase their work in this intimate exhibition.",
    price: "Free",
    lat: 55.6680,
    lng: 12.5490
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
        <div style="max-width:200px">
          <strong>${event.title}</strong><br>
          <span>${event.date}</span><br>
          <span>${event.location}</span><br><br>
          <a href="event.html?id=${event.id}" 
             style="background:#e9899b;color:white;padding:5px 10px;
                    border-radius:4px;text-decoration:none;">
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