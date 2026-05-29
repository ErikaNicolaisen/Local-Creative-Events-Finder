document.getElementById('submit-btn').addEventListener('click', async () => {
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

  document.getElementById('submit-btn').disabled = true
  document.getElementById('submit-btn').textContent = 'Posting...'

  let lat = 55.6761
  let lng = 12.5683

  try {
    const coordsRes = await fetch(`/api/geocode?address=${encodeURIComponent(location)}`)
    const coords = await coordsRes.json()
    if (coords && coords.lat) {
      lat = coords.lat
      lng = coords.lng
    }
  } catch (err) {
    console.error('Geocoding failed, using default coords:', err)
  }

  const newEvent = {id: Date.now(), title, category, date, location, description, price, lat, lng}

  try {
    await fetch('/api/userevents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })

    document.getElementById('success-msg').textContent = '✅ Your volunteer shift has been posted!'
    document.getElementById('success-msg').style.display = 'block'
    document.getElementById('submit-btn').style.display = 'none'
  } catch (err) {
    console.error('Post failed:', err)
    document.getElementById('submit-btn').disabled = false
    document.getElementById('submit-btn').textContent = 'Post Opportunity →'
    alert('Something went wrong, try again.')
  }
})