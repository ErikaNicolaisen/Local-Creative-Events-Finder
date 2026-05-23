const events = [
  { id: 10, title: 'Distortion X – Stage Setup', category: 'stage', date: 'June 3, 2026', location: 'Rådhuspladsen, Copenhagen', description: 'Help build and prepare the main stage at Rådhuspladsen before Distortion X opens. Great hands-on experience with professional stage construction. 16:00–00:00.', price: 'Free festival pass', lat: 55.6765, lng: 12.5690 },
  { id: 11, title: 'Distortion X – Lighting Crew', category: 'lighting', date: 'June 3, 2026', location: 'Rådhuspladsen, Copenhagen', description: 'Work alongside the lighting team at Distortion X. Help rig, focus and operate festival lights. Perfect if you want experience with professional lighting setups. 16:00–00:00.', price: 'Free festival pass', lat: 55.6757, lng: 12.5675 },
  { id: 12, title: 'Distortion – Street Party Stage Crew', category: 'stage', date: 'June 4, 2026', location: 'Vesterbro, Copenhagen', description: 'Set up and manage the street stage at the free Vesterbro Street Party. Good entry-level experience with live event production. 16:00–22:00.', price: 'Free festival pass', lat: 55.6675, lng: 12.5480 },
  { id: 13, title: 'Distortion X – Sound Assistant', category: 'sound', date: 'June 4, 2026', location: 'Vesterbro, Copenhagen', description: 'Assist the sound engineers at Distortion X Vesterbro. Help with cable runs, monitor setup and basic sound checks. Great way to learn live sound. 16:00–23:00.', price: 'Free festival pass', lat: 55.6692, lng: 12.5502 },
  { id: 14, title: 'Distortion – Havnefest Light & Sound', category: 'lighting', date: 'June 5, 2026', location: 'Copenhagen Harbour, Copenhagen', description: 'Support the technical team at the free Havnefest harbour party. Work with both lighting and sound in a unique outdoor waterfront setting. 16:00–22:00.', price: 'Free festival pass', lat: 55.6802, lng: 12.5945 },
  { id: 15, title: 'Distortion Ø – Photo & Video Crew', category: 'photography', date: 'June 5, 2026', location: 'Refshaleøen, Copenhagen', description: 'Document Distortion Ø as part of the official media crew. Shoot stills and video of one of Scandinavia\'s biggest electronic music events. 18:00–04:00.', price: 'Free festival pass', lat: 55.6941, lng: 12.6195 },
  { id: 16, title: 'Distortion Ø – Stage Manager Assistant', category: 'stage', date: 'June 5, 2026', location: 'Refshaleøen, Copenhagen', description: 'Support the stage manager at Distortion Ø. Help coordinate artist changeovers, backline and stage flow. Great experience for anyone interested in event production. 18:00–04:00.', price: 'Free festival pass', lat: 55.6928, lng: 12.6178 },
  { id: 17, title: 'Distortion Ø – Sound Crew', category: 'sound', date: 'June 6, 2026', location: 'Refshaleøen, Copenhagen', description: 'Work with the sound team at Distortion Ø on Saturday night. Help with stage sound, monitors and DJ setup. 18:00–06:00.', price: 'Free festival pass', lat: 55.6944, lng: 12.6182 },
  { id: 18, title: 'Distortion Ø – Lighting Operator', category: 'lighting', date: 'June 6, 2026', location: 'Refshaleøen, Copenhagen', description: 'Operate festival lights alongside professional lighting designers at Distortion Ø. Hands-on experience with moving heads, strobes and LED rigs. 18:00–06:00.', price: 'Free festival pass', lat: 55.6925, lng: 12.6200 },
  { id: 19, title: 'Distortion – Afterparty Stage Crew', category: 'stage', date: 'June 7, 2026', location: 'Refshaleøen, Copenhagen', description: 'Help run the free Sunday afterparty stage. Good opportunity to see how a festival wraps up and learn about breakdown and load-out. 06:00–18:00.', price: 'Free festival pass', lat: 55.6937, lng: 12.6170 }
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
  markers.forEach(m => m.setMap(null))
  markers = []

  events
    .filter(e => (activeCategory === 'all' || e.category === activeCategory) && e.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .forEach(event => {
      const marker = new google.maps.Marker({
        position: { lat: event.lat, lng: event.lng },
        map,
        title: event.title
      })

      const link = event.link || 'event.html?id=' + event.id
      const target = event.link ? '_blank' : '_self'

      const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width:500px;font-family:Arial,sans-serif;">
          <strong style="color:#c0566a;">${event.title}</strong><br>
          <span style="color:#888;">📅 ${event.date}</span><br>
          <span style="color:#888;">📍 ${event.location}</span><br>
          <span style="color:#888;">🎛 ${event.category}</span><br><br>
          <a href="${link}" target="${target}" style="background:#e9899b;color:white;padding:5px 10px;border-radius:4px;text-decoration:none;font-size:0.85rem;">
            See more
          </a>
        </div>
      `
    })

      marker.addListener('click', () => infoWindow.open(map, marker))
      markers.push(marker)
    })
}

function setupSearch() {
  document.getElementById('search-input').addEventListener('input', e => {
    searchTerm = e.target.value
    renderMarkers()
  })
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filter-btn')
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      activeCategory = btn.dataset.category
      renderMarkers()
    })
  })
}

async function loadScrapedEvents() {
  try {
    const [kuneRes, aliceRes] = await Promise.all([
      fetch('http://localhost:3000/kune'),
      fetch('http://localhost:3000/alice')
    ])

    const kune = await kuneRes.json()
    const alice = await aliceRes.json()

    kune.forEach(e => { delete e.link; events.push(e) })
    alice.forEach(e => events.push(e))

    renderMarkers()
  } catch (err) {
    console.error('Could not load events:', err)
  }
}