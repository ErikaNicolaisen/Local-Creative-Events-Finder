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
      const link = $(el).attr('href')

      if (title && title.length > 2) {
        events.push({
          id: id++,
          title: title,
          date: 'See bystudents.dk for dates',
          location: 'Copenhagen',
          category: 'scraped',
          description: 'Student event in Copenhagen from byStudents.dk',
          price: 'Free for students',
          lat: 55.6761 + (Math.random() - 0.5) * 0.04,
          lng: 12.5683 + (Math.random() - 0.5) * 0.04
        })
      }
    })

    console.log('Found:', events.length)
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