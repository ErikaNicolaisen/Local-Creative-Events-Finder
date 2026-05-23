const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

dotenv.config()

const app = express()
const PORT = 3000

app.use(express.static('public'))

app.get('/kune', async (req, res) => {
  try {
    const response = await axios.get('https://www.kunefestival.dk/volunteer', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)
    const events = []
    let id = 200

  const roleData = {
    'main volunteer': { category: 'stage', lat: 55.7203, lng: 12.6654 },
    'media crew': { category: 'photography', lat: 55.7204, lng: 12.6656 },
    'tech managers': { category: 'sound', lat: 55.7203, lng: 12.6653 },
    'production': { category: 'stage', lat: 55.7203, lng: 12.6655 },
    'safer space': { category: 'stage', lat: 55.7204, lng: 12.6657 },
    'first aid': { category: 'stage', lat: 55.7205, lng: 12.6653 },
    'take-down': { category: 'stage', lat: 55.7202, lng: 12.6651 }
  }

    const skip = ['@']

    $('h2, h3, strong').each((i, el) => {
      const text = $(el).text().trim()
      if (!text || text.length < 4) return
      if (skip.some(s => text.toLowerCase().includes(s))) return

      let lat = 55.7203
      let lng = 12.6654 
      let category = 'stage'

      Object.keys(roleData).forEach(key => {
        if (text.toLowerCase().includes(key)) {
          lat = roleData[key].lat
          lng = roleData[key].lng
          category = roleData[key].category
        }
      })

      events.push({
        id: id++,
        title: 'KUNE – ' + text,
        date: 'July 30 – August 3, 2026',
        location: 'Ungdomsøen, Copenhagen',
        category,
        description: $(el).next('p').text().trim() || 'Volunteer crew opportunity at KUNE Festival Copenhagen.',
        price: 'Free festival access',
        lat,
        lng
      })
    })

    res.json(events)
  } catch (err) {
    console.error(err.message)
    res.json([])
  }
})

app.get('/alice', async (req, res) => {
  try {
    const response = await axios.get('https://alicecph.com/en/volunteering/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)

    let mainDesc = ''
    $('p').each((i, el) => {
      const text = $(el).text().trim()
      if (text.length > 100 && text.toLowerCase().includes('volunteer')) {
        mainDesc = text
        return false
      }
    })

    const roles = [
      { id: 300, title: 'ALICE – Show Volunteer', category: 'stage', lat: 55.6934, lng: 12.5590 },
      { id: 301, title: 'ALICE – Stagehand', category: 'stage', lat: 55.6935, lng: 12.5591 },
      { id: 302, title: 'ALICE – Photographer/Videographer', category: 'photography', lat: 55.6933, lng: 12.5589 }
    ]

    const result = roles.map(role => ({
      ...role,
      date: 'Ongoing',
      location: 'ALICE, Nørre Allé 7, Copenhagen',
      description: mainDesc || 'Volunteer at ALICE, a non-profit music venue in Nørrebro, Copenhagen.',
      price: 'Free concert tickets'
    }))

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.json([])
  }
})

app.get('/config', (req, res) => {
  res.json({ mapsApiKey: process.env.MAPS_API_KEY })
})

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})