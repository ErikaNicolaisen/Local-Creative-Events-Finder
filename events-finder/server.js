const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')

dotenv.config()

const app = express()
const PORT = 3000

app.use(express.static('public'))

app.get('/events', async (req, res) => {
  try {
    const response = await axios.get('https://bystudents.dk/en/events/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)
    const events = []
    let id = 100
    $('a[title]').each((i, el) => {
      const title = $(el).attr('title')
      if (title && title.length > 2) {
        events.push({
          id: id++,
          title: title,
          date: 'See bystudents.dk for dates',
          location: 'Studenterhuset, Copenhagen',
          category: 'scraped',
          description: 'Student event in Copenhagen from byStudents.dk',
          price: 'Free for students',
          lat: 55.6761 + (Math.random() - 0.5) * 0.01,
          lng: 12.5683 + (Math.random() - 0.5) * 0.01,
          link: 'https://bystudents.dk/en/events/'
        })
      }
    })
    console.log('byStudents found:', events.length)
    res.json(events)
  } catch (err) {
    console.error(err.message)
    res.json([])
  }
})

app.get('/kune', async (req, res) => {
  try {
    const response = await axios.get('https://www.kunefestival.dk/volunteer', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)
    const events = []
    let id = 200

    const roleData = {
  'main volunteer': { category: 'stage', lat: 55.7206, lng: 12.6750 },
  'media crew': { category: 'photography', lat: 55.7204, lng: 12.6752 },
  'tech managers': { category: 'sound', lat: 55.7207, lng: 12.6748 },
  'production': { category: 'stage', lat: 55.7203, lng: 12.6749 },
  'safer space': { category: 'stage', lat: 55.7205, lng: 12.6754 },
  'first aid': { category: 'stage', lat: 55.7208, lng: 12.6751 },
  'take-down': { category: 'stage', lat: 55.7202, lng: 12.6747 }
}

    $('h2, h3, strong').each((i, el) => {
      const text = $(el).text().trim()
      if (!text || text.length < 4) return
      if (text.includes('cookie') || text.includes('deadline') || text.includes('@') || text.includes('Handbook') || text.includes('©') || text.toLowerCase().includes('how to') || text.toLowerCase().includes('what to') || text.toLowerCase().includes('we use')) return

      let lat = 55.7205
      let lng = 12.6750
      let category = 'stage'

      Object.keys(roleData).forEach(key => {
        if (text.toLowerCase().includes(key)) {
          lat = roleData[key].lat
          lng = roleData[key].lng
          category = roleData[key].category
        }
      })

      const description = $(el).next('p').text().trim() || 'Volunteer crew opportunity at KUNE Festival Copenhagen.'

      events.push({
        id: id++,
        title: 'KUNE – ' + text,
        date: 'July 30 – August 3, 2026',
        location: 'Ungdomsøen, Copenhagen',
        category: category,
        description: description,
        price: 'Free festival access',
        lat: lat,
        lng: lng
      })
    })

    console.log('KUNE found:', events.length)
    res.json(events)
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