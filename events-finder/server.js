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

    const eventDetails = {
      'Language Café': { category: 'sound', description: 'A cosy language exchange event for students in Copenhagen.', price: 'Free', lat: 55.6867, lng: 12.5772 },
      'Jazz Festival': { category: 'sound', description: 'Annual student jazz festival. Sound engineers and lighting crew needed.', price: 'Free', lat: 55.6784, lng: 12.5912 },
      'DJ Nights': { category: 'dj', description: 'Regular DJ nights at Studenterhuset. Shadow a DJ or help with sound setup.', price: 'Free entry', lat: 55.6784, lng: 12.5912 },
      'Karaoke Night': { category: 'sound', description: 'Weekly karaoke night for students. Sound and lighting crew needed.', price: 'Free', lat: 55.6784, lng: 12.5912 },
      'Concerts': { category: 'sound', description: 'Live concerts at Studenterhuset. Sound engineers and stage crew needed.', price: 'Free', lat: 55.6784, lng: 12.5912 },
      'Drag Bingo': { category: 'lighting', description: 'Fun drag bingo nights. Lighting crew and photographers welcome.', price: 'Free', lat: 55.6784, lng: 12.5912 },
      'KU Festival': { category: 'photography', description: 'The annual KU student festival. Photographers and video crew needed.', price: 'Free', lat: 55.6867, lng: 12.5772 },
      'Swing Dance': { category: 'sound', description: 'Tuesday swing dance nights. Sound setup crew needed.', price: 'Free', lat: 55.6784, lng: 12.5912 },
      'Studiefest 2025': { category: 'stage', description: 'The big annual student party. Stage crew and lighting needed.', price: 'Free', lat: 55.6784, lng: 12.5912 },
      'Halloween': { category: 'lighting', description: 'Halloween party at Studenterhuset. Lighting and decoration crew needed.', price: 'Free', lat: 55.6784, lng: 12.5912 }
    }

    $('a[title]').each((i, el) => {
      const title = $(el).attr('title')
      if (title && title.length > 2) {
        const details = eventDetails[title] || {
          category: 'scraped',
          description: 'Student event in Copenhagen from byStudents.dk',
          price: 'Free for students',
          lat: 55.6761 + (Math.random() - 0.5) * 0.04,
          lng: 12.5683 + (Math.random() - 0.5) * 0.04
        }

        events.push({
          id: id++,
          title: title,
          date: 'See bystudents.dk for dates',
          location: 'Studenterhuset, Copenhagen',
          category: details.category,
          description: details.description,
          price: details.price,
          lat: details.lat || 55.6761 + (Math.random() - 0.5) * 0.04,
          lng: details.lng || 12.5683 + (Math.random() - 0.5) * 0.04
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