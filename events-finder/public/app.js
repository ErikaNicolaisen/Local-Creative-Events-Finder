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

function getLiked() {
  return JSON.parse(localStorage.getItem('likedEvents') || '[]')
}

function toggleLike(event) {
  const liked = getLiked()
  const idx = liked.findIndex(e => e.id === event.id)
  if (idx === -1) {
    liked.push(event)
  } else {
    liked.splice(idx, 1)
  }
  localStorage.setItem('likedEvents', JSON.stringify(liked))
  renderSidebar()
}
window.toggleLike = toggleLike

function isLiked(id) {
  return getLiked().some(e => e.id === id)
}
window.isLiked = isLiked

function removeLiked(id) {
  const liked = getLiked().filter(e => e.id !== id)
  localStorage.setItem('likedEvents', JSON.stringify(liked))
  renderSidebar()
}
window.removeLiked = removeLiked

function isLiked(id) {
  return getLiked().some(e => e.id === id)
}

function deleteUserEvent(id) {
  const userEvents = JSON.parse(localStorage.getItem('userEvents') || '[]')
  const filtered = userEvents.filter(e => e.id !== id)
  localStorage.setItem('userEvents', JSON.stringify(filtered))
  const idx = events.findIndex(e => e.id === id)
  if (idx !== -1) events.splice(idx, 1)
  renderMarkers()
  renderSidebar()
}
window.deleteUserEvent = deleteUserEvent

function renderSidebar() {
  const liked = getLiked()
  const container = document.getElementById('liked-list')
  if (!container) return
  container.innerHTML = ''
  if (liked.length === 0) {
    container.innerHTML = '<p style="color:#aaa;font-size:0.85rem;">No liked events yet</p>'
  } else {
    liked.forEach(e => {
      const div = document.createElement('div')
      div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;'
      div.innerHTML = `
        <a href="event.html?id=${e.id}" style="color:#c0566a;text-decoration:none;font-size:0.85rem;">${e.title}</a>
        <button onclick="removeLiked(${e.id})" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:0.8rem;">✕</button>
      `
      container.appendChild(div)
    })
  }

  const userEvents = JSON.parse(localStorage.getItem('userEvents') || '[]')
  const userContainer = document.getElementById('user-events-list')
  if (!userContainer) return
  userContainer.innerHTML = ''
  if (userEvents.length === 0) {
    userContainer.innerHTML = '<p style="color:#aaa;font-size:0.85rem;">No posted events yet</p>'
  } else {
    userEvents.forEach(e => {
      const div = document.createElement('div')
      div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;'
      div.innerHTML = `
        <span style="color:#c0566a;font-size:0.85rem;">${e.title}</span>
        <button onclick="deleteUserEvent(${e.id})" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:0.8rem;">✕</button>
      `
      userContainer.appendChild(div)
    })
  }
}

function initMap() {
  const params = new URLSearchParams(window.location.search)
  const cat = params.get('category')
  if (cat) {
    activeCategory = cat
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active')
      if (btn.dataset.category === cat) btn.classList.add('active')
    })
  }

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 55.6900, lng: 12.5900 },
    zoom: 13,
    mapTypeControl: false,
    styles: [
      { featureType: "all", elementType: "geometry", stylers: [{ color: "#f5cdcd" }] },
      { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },
      { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#f5f0eb" }] },
      { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#c3f2f6" }] },
      { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#f9ac9c" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#f5bef9" }] },
      { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#ffe0e0" }] },
      { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#e46666" }] },
      { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#f09f93" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] },
      { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
    ]
  })

  renderMarkers()
  renderSidebar()
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
      const liked = isLiked(event.id)

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="max-width:500px;font-family:Arial,sans-serif;">
            <strong style="color:#c0566a;">${event.title}</strong><br>
            <span style="color:#888;">📅 ${event.date}</span><br>
            <span style="color:#888;">📍 ${event.location}</span><br>
            <span style="color:#888;">🎛 ${event.category}</span><br><br>
            <a href="${link}" target="${target}" style="background:#e9899b;color:white;padding:5px 10px;border-radius:4px;text-decoration:none;font-size:0.85rem;">See more</a>
            <button id="like-btn-${event.id}" onclick="toggleLike(${JSON.stringify(event).replace(/"/g, '&quot;')}); document.getElementById('like-btn-${event.id}').textContent=isLiked(${event.id})?'❤️':'♡'" style="background:none;border:2px solid #e9899b;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:0.9rem;margin-left:8px;">${liked ? '❤️' : '♡'}</button>
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
    const [kuneRes, aliceRes, cphdoxRes, basementRes, kulturRes, timerRes] = await Promise.all([
      fetch('http://localhost:3000/kune'),
      fetch('http://localhost:3000/alice'),
      fetch('http://localhost:3000/cphdox'),
      fetch('http://localhost:3000/basement'),
      fetch('http://localhost:3000/kulturensfrivillige'),
      fetch('http://localhost:3000/48timer')
    ])

    const kune = await kuneRes.json()
    const alice = await aliceRes.json()
    const cphdox = await cphdoxRes.json()
    const basement = await basementRes.json()
    const kultur = await kulturRes.json()
    const timer = await timerRes.json()

    kune.forEach(e => { delete e.link; events.push(e) })
    alice.forEach(e => events.push(e))
    cphdox.forEach(e => events.push(e))
    basement.forEach(e => events.push(e))
    kultur.forEach(e => events.push(e))
    timer.forEach(e => events.push(e))

    const userEvents = JSON.parse(localStorage.getItem('userEvents') || '[]')
    userEvents.forEach(e => events.push(e))

    renderMarkers()
    renderSidebar()
  } catch (err) {
    console.error('Could not load events:', err)
  }
}