const descriptions = {
  'Language Café': { description: 'A cosy language exchange event for students. Help with sound and hosting.', price: 'Free', category: 'sound' },
  'Jazz Festival': { description: 'Annual student jazz festival at Studenterhuset. Sound engineers and lighting crew needed.', price: 'Free', category: 'sound' },
  'DJ Nights': { description: 'Regular DJ nights at Studenterhuset. Shadow a DJ or help with sound setup.', price: 'Free entry', category: 'dj' },
  'Karaoke Night': { description: 'Weekly karaoke night for students. Sound and lighting crew needed.', price: 'Free', category: 'sound' },
  'Concerts': { description: 'Live concerts at Studenterhuset. Sound engineers and stage crew needed.', price: 'Free', category: 'sound' },
  'Drag Bingo': { description: 'Fun drag bingo nights. Lighting crew and photographers welcome.', price: 'Free', category: 'lighting' },
  'KU Festival': { description: 'The annual KU student festival. Photographers and video crew needed.', price: 'Free', category: 'photography' },
  'Swing Dance': { description: 'Tuesday swing dance nights. Sound setup crew needed.', price: 'Free', category: 'sound' },
  'Studiefest 2025': { description: 'The big annual student party. Stage crew and lighting needed.', price: 'Free', category: 'stage' },
  'Halloween': { description: 'Halloween party at Studenterhuset. Lighting and decoration crew needed.', price: 'Free', category: 'lighting' },
  'Futurists': { description: 'Future thinking events for students. Photography and video crew welcome.', price: 'Free', category: 'video' },
  'Community Kitchen': { description: 'Community kitchen events. Help with setup and hosting.', price: 'Free', category: 'stage' },
  'Quiz Night': { description: 'Weekly quiz nights. Sound and hosting crew needed.', price: 'Free', category: 'sound' },
  'Welcome to CPH': { description: 'Welcome events for new students. All crew roles needed.', price: 'Free', category: 'stage' }
}

function initEventPage() {
  const params = new URLSearchParams(window.location.search)
  const id = parseInt(params.get('id'))
  console.log('Looking for event id:', id)

  let event = events.find(e => e.id === id)

  if (event) {
    showEvent(event)
  } else {
    Promise.all([
      fetch('http://localhost:3000/events').then(r => r.json()),
      fetch('http://localhost:3000/kune').then(r => r.json())
    ]).then(([byStudents, kune]) => {
      const all = [...byStudents, ...kune]
      event = all.find(e => e.id === id)
if (event) {
  if (!event.title.startsWith('KUNE')) {
    const extra = descriptions[event.title]
    if (extra) {
      event.description = extra.description
      event.price = extra.price
      event.category = extra.category
    }
  }
  showEvent(event)
}
    })
  }
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