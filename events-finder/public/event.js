function initEventPage() {
  const params = new URLSearchParams(window.location.search)
  const id = parseInt(params.get('id'))

  let event = events.find(e => e.id === id)

  if (event) {
    showEvent(event)
    return
  }

  Promise.all([
    fetch('http://localhost:3000/kune').then(r => r.json()),
    fetch('http://localhost:3000/alice').then(r => r.json())
  ]).then(([kune, alice]) => {
    event = [...kune, ...alice].find(e => e.id === id)
    if (event) showEvent(event)
  })
}

function showEvent(event) {
  document.title = event.title + ' – StageUp CPH'
  document.getElementById('event-title').textContent = event.title
  document.getElementById('event-date').textContent = '📅 ' + event.date
  document.getElementById('event-location').textContent = '📍 ' + event.location
  document.getElementById('event-price').textContent = '🎟 ' + event.price
  document.getElementById('event-category').textContent = '🎛 ' + event.category
  document.getElementById('event-description').textContent = event.description

  const map = new google.maps.Map(document.getElementById('event-map'), {
    center: { lat: event.lat, lng: event.lng },
    zoom: 15
  })

  new google.maps.Marker({
    position: { lat: event.lat, lng: event.lng },
    map: map,
    title: event.title
  })
}