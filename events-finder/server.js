const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')

dotenv.config()

const app = express()
const PORT = 3000

app.use(express.static('public'))

// This route scrapes events from Kultunaut
app.get('/events', async (req, res) => {
  try {
    // Fetch the Kultunaut Copenhagen events page
    const response = await axios.get('https://www.kultunaut.dk/perl/arrlist/type-nynaut?Area=Storkøbenhavn&periode=kommende')
    
    // Load the HTML into cheerio so we can search through it
    const $ = cheerio.load(response.data)
    
    const events = []

    // Loop through each event on the page
    $('.arrlist-item').each((i, el) => {
      const title = $(el).find('.arrlist-title').text().trim()
      const date = $(el).find('.arrlist-date').text().trim()
      const location = $(el).find('.arrlist-location').text().trim()

      if (title) {
        events.push({
          id: i + 100,
          title,
          date,
          location,
          category: 'scraped',
          description: 'Event scraped from Kultunaut.dk',
          price: 'See website',
          lat: 55.6761 + (Math.random() - 0.5) * 0.05,
          lng: 12.5683 + (Math.random() - 0.5) * 0.05
        })
      }
    })

    res.json(events)
  } catch (error) {
    console.error('Scraping error:', error.message)
    res.json([])
  }
})

app.get('/config', (req, res) => {
  res.json({ mapsApiKey: process.env.MAPS_API_KEY })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})