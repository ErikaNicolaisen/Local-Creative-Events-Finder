function initEventPage() {
  const params = new URLSearchParams(window.location.search)
  const id = parseInt(params.get('id'))

  Promise.all([
    fetch('http://localhost:3000/kune').then(r => r.json()),
    fetch('http://localhost:3000/alice').then(r => r.json()),
    fetch('http://localhost:3000/cphdox').then(r => r.json()),
    fetch('http://localhost:3000/basement').then(r => r.json()),
    fetch('http://localhost:3000/kulturensfrivillige').then(r => r.json()),
    fetch('http://localhost:3000/48timer').then(r => r.json())
  ]).then(([kune, alice, cphdox, basement, kultur, timer]) => {
    const all = [...events, ...kune, ...alice, ...cphdox, ...basement, ...kultur, ...timer]
    const event = all.find(e => e.id === id)
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

  const linkEl = document.getElementById('event-link')
  if (event.sourceUrl) {
    linkEl.href = event.sourceUrl
    linkEl.style.display = 'inline-block'
  }

  const likeBtn = document.getElementById('like-btn')
  const liked = JSON.parse(localStorage.getItem('likedEvents') || '[]')
  const isLiked = liked.some(e => e.id === event.id)
  likeBtn.textContent = isLiked ? '❤️' : '♡'

  likeBtn.addEventListener('click', () => {
    const liked = JSON.parse(localStorage.getItem('likedEvents') || '[]')
    const idx = liked.findIndex(e => e.id === event.id)
    if (idx === -1) {
      liked.push(event)
      likeBtn.textContent = '❤️'
    } else {
      liked.splice(idx, 1)
      likeBtn.textContent = '♡'
    }
    localStorage.setItem('likedEvents', JSON.stringify(liked))
  })

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