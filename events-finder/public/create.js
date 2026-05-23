document.getElementById('submit-btn').addEventListener('click', () => {
  const title = document.getElementById('input-title').value
  const category = document.getElementById('input-category').value
  const date = document.getElementById('input-date').value
  const location = document.getElementById('input-location').value
  const description = document.getElementById('input-description').value
  const price = document.getElementById('input-price').value

  if (!title || !date || !location || !description || !price) {
    alert('Please fill in all fields!')
    return
  }

  const existing = JSON.parse(localStorage.getItem('userEvents') || '[]')

  const newEvent = {
    id: Date.now(),
    title,
    category,
    date,
    location,
    description,
    price,
    lat: 55.6761 + (Math.random() - 0.5) * 0.02,
    lng: 12.5683 + (Math.random() - 0.5) * 0.02
  }

  existing.push(newEvent)
  localStorage.setItem('userEvents', JSON.stringify(existing))

  document.getElementById('success-msg').style.display = 'block'
  document.getElementById('submit-btn').style.display = 'none'
})