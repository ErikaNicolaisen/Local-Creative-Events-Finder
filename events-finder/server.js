const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')
const mongoose = require('mongoose')

dotenv.config()

mongoose.connect('mongodb://localhost:27017/volunteermap')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

const EventSchema = new mongoose.Schema({}, { strict: false })
const LikedEvent = mongoose.model('LikedEvent', EventSchema)
const UserEvent = mongoose.model('UserEvent', new mongoose.Schema({id: Number, title: String, category: String, date: String, location: String, description: String, price: String, lat: Number, lng: Number
}))

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.json())

app.get('/api/likes', async (req, res) => {
  const liked = await LikedEvent.find({}, { _id: 0, __v: 0 })
  res.json(liked)
})

app.post('/api/likes', async (req, res) => {
  await LikedEvent.findOneAndUpdate(
    { id: req.body.id },
    req.body,
    { upsert: true, new: true }
  )
  res.json({ ok: true })
})

app.delete('/api/likes/:id', async (req, res) => {
  await LikedEvent.deleteOne({ id: Number(req.params.id) })
  res.json({ ok: true })
})

app.get('/api/userevents', async (req, res) => {
  const events = await UserEvent.find({}, { _id: 0, __v: 0 })
  res.json(events)
})

app.post('/api/userevents', async (req, res) => {
  const event = new UserEvent(req.body)
  await event.save()
  res.json({ ok: true })
})

app.delete('/api/userevents/:id', async (req, res) => {
  await UserEvent.deleteOne({ id: Number(req.params.id) })
  res.json({ ok: true })
})

async function getCoordinates(address) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    console.log('Geocoding response:', JSON.stringify(response.data))
    const result = response.data.results[0]
    if (result) {
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      }
    }
  } catch (err) {
    console.error('Geocoding error:', err.message)
  }
  return null
}

app.get('/kune', async (req, res) => {
  try {
    const response = await axios.get('https://www.kunefestival.dk/volunteer', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)
    const events = []
    let id = 200

    let festivalDate = ''
    let festivalLocation = ''

    $('*').each((i, el) => {
      const text = $(el).text().trim()
      if ((text.match(/\d+ \w+ - \d+ \w+ \d{4}/) || text.match(/\d+\w+ \w+ - \d+\w+ \w+ \d{4}/)) && text.length < 50) {
        festivalDate = text
      }
      if (text.toLowerCase().includes('ungd') && text.length < 50) {
        festivalLocation = text
      }
    })

    const coords = await getCoordinates('Ungdomsøen, Copenhagen')

    const skip = ['@', 'cookie', 'we use cookies', 'instagram', 'facebook',
                  'positions filled', 'volunteer handbook', 'application deadline',
                  'reach out', 'how to apply', 'what to expect', 'all positions']

    $('h2, h3, strong').each((i, el) => {
      const text = $(el).text().trim()
      if (!text || text.length < 4) return
      if (skip.some(s => text.toLowerCase().includes(s))) return

      events.push({
        id: id++,
        title: 'KUNE – ' + text,
        date: festivalDate,
        location: festivalLocation,
        category: 'stage',
        description: $(el).next('p').text().trim() || 'Volunteer crew opportunity at KUNE Festival Copenhagen.',
        price: 'Free festival access',
        lat: coords ? coords.lat : 55.7203,
        lng: coords ? coords.lng : 12.6654,
        sourceUrl: 'https://www.kunefestival.dk/volunteer'
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
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    })

    const $ = cheerio.load(response.data)

    const mainDesc = $('meta[property="og:description"]').attr('content') ||
                     'Volunteer at ALICE, a non-profit music venue in Nørrebro, Copenhagen.'

    const coords = await getCoordinates('Nørre Allé 7, Copenhagen')

    const roles = [
      { id: 300, title: 'ALICE – Show Volunteer', category: 'stage' },
      { id: 301, title: 'ALICE – Stagehand', category: 'stage' },
      { id: 302, title: 'ALICE – Photographer/Videographer', category: 'photography' }
    ]

    const result = roles.map(role => ({
      ...role,
      date: 'Ongoing',
      location: 'ALICE, Nørre Allé 7, Copenhagen',
      description: mainDesc,
      price: 'Free concert tickets',
      lat: coords ? coords.lat : 55.6934,
      lng: coords ? coords.lng : 12.5590,
      sourceUrl: 'https://alicecph.com/en/volunteering/'
    }))

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.json([])
  }
})

app.get('/cphdox', async (req, res) => {
  try {
    const coords = await getCoordinates('Kunsthal Charlottenborg, Copenhagen')

    const roles = [
      { id: 700, title: 'CPH:DOX – Venue host', description: 'Som venue host byder du CPH:DOX\' publikum velkommen, når de ankommer til spillestedet. Du hjælper gæsterne med at finde den rigtige sal, scanner billetter og guider dem til deres pladser i salen.' },
      { id: 701, title: 'CPH:DOX – Industry guide', description: 'Som industry guide byder du professionelle gæster velkommen og scanner deres badges, når de ankommer til vores venues. Flydende engelsk er et krav.' },
      { id: 702, title: 'CPH:DOX – INTER:ACTIVE – udstillingsvært', description: 'Som udstillingsvært byder du publikum velkommen til vores INTER:ACTIVE-udstilling på Kunsthal Charlottenborg.' },
      { id: 703, title: 'CPH:DOX – Info desk', description: 'Info desk vagterne finder sted i Charlottenborgs foyer.' },
      { id: 704, title: 'CPH:DOX – Produktion', description: 'Produktionsvagter indebærer opbygning og nedtagning af festivalens større produktioner.' }
    ]

    const result = roles.map((role, i) => ({
      ...role,
      date: 'March 11–22, 2026',
      location: 'Kunsthal Charlottenborg, Copenhagen',
      category: 'stage',
      price: 'Free festival pass + film tickets',
      lat: coords ? coords.lat + (i * 0.001) : 55.6799 + (i * 0.001),
      lng: coords ? coords.lng + (i * 0.001) : 12.5772 + (i * 0.001),
      sourceUrl: 'https://cphdox.dk/da/bliv-frivillig-paa-cphdox-2026/'
    }))

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.json([])
  }
})

app.get('/basement', async (req, res) => {
  try {
    const response = await axios.get('https://basement.kk.dk/bliv-frivillig', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)

    let mainDesc = ''
    $('p').each((i, el) => {
      const text = $(el).text().trim()
      if (text.includes('bar') && text.includes('fotografer')) {
        mainDesc = text
        return false
      }
    })

    const coords = await getCoordinates('Enghavevej 42, Copenhagen')

    const roles = [
      { id: 800, title: 'Basement – Bar Volunteer', category: 'stage' },
      { id: 802, title: 'Basement – Photographer', category: 'photography' },
      { id: 803, title: 'Basement – Lighting', category: 'lighting' }
    ]

    const result = roles.map(role => ({
      ...role,
      date: 'Ongoing',
      location: 'Basement, Enghavevej 42, Copenhagen',
      description: mainDesc || 'Volunteer at Basement, a music and culture venue on Vesterbro, Copenhagen.',
      price: 'Free access to events',
      lat: coords ? coords.lat : 55.6658,
      lng: coords ? coords.lng : 12.5463,
      sourceUrl: 'https://basement.kk.dk/bliv-frivillig'
    }))

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.json([])
  }
})

app.get('/kulturensfrivillige', async (req, res) => {
  try {
    const response = await axios.get('https://www.kulturensfrivillige.dk/en/seneste-nyt/har-du-et-%C3%B8je-for-fotografi---s%C3%A5-bliv-en-del-af-vores-content-team', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)

    const descriptions = []
    $('p').each((i, el) => {
      const text = $(el).text().trim()
      if (text.length > 50) descriptions.push(text)
    })
    const mainDesc = descriptions.slice(0, 3).join(' ')

    const coords = await getCoordinates('Copenhagen, Denmark')

    const result = [{
      id: 900,
      title: 'Kulturens Frivillige – Content Team Photographer',
      date: 'Ongoing',
      location: 'Copenhagen',
      category: 'photography',
      description: mainDesc || 'Join the Content Team and experience Copenhagen\'s cultural scene from behind the lens.',
      price: 'Free access to events',
      lat: coords ? coords.lat : 55.6761,
      lng: coords ? coords.lng : 12.5683,
      sourceUrl: 'https://www.kulturensfrivillige.dk/en/seneste-nyt/har-du-et-%C3%B8je-for-fotografi---s%C3%A5-bliv-en-del-af-vores-content-team'
    }]

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.json([])
  }
})

app.get('/48timer', async (req, res) => {
  try {
    const response = await axios.get('https://www.48timerfestival.dk/bliv-frivillig/fotograf-team/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)

    let mainDesc = ''
    $('p').each((i, el) => {
      const text = $(el).text().trim()
      if (text.length > 100) {
        mainDesc = text
        return false
      }
    })

    const coords = await getCoordinates('Blågårds Plads 2, Copenhagen')

    const result = [{
      id: 1000,
      title: '48TIMER Festival – Photographer',
      date: 'May 12–14, 2026',
      location: 'Blågårds Plads 2, Nørrebro, Copenhagen',
      category: 'photography',
      description: mainDesc || 'Join the photographer team at 48TIMER Festival on Nørrebro.',
      price: 'Free festival access + T-shirt',
      lat: coords ? coords.lat : 55.6897,
      lng: coords ? coords.lng : 12.5530,
      sourceUrl: 'https://www.48timerfestival.dk/bliv-frivillig/fotograf-team/'
    }]

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.json([])
  }
})

app.get('/venues', async (req, res) => {
  const venues = [
    { name: 'ALICE', address: 'Nørre Allé 7, 2200 København N', url: 'https://alicecph.com' },
    { name: 'Basement', address: 'Enghavevej 42, 1674 København V', url: 'https://basement.kk.dk' },
    { name: 'Kunsthal Charlottenborg', address: 'Kongens Nytorv 1, 1050 København K', url: 'https://kunsthalcharlottenborg.dk/en/' },
    { name: 'Ungdomsøen / KUNE', address: 'Refshalevej, 1432 København K', url: 'https://www.kunefestival.dk' },
    { name: '48TIMER Festival', address: 'Blågårds Plads 2, 2200 København N', url: 'https://www.48timerfestival.dk' },
    { name: 'CPH:DOX', address: 'Kunsthal Charlottenborg, Copenhagen', url: 'https://cphdox.dk/da/bliv-frivillig-paa-cphdox-2026/' }
  ]
  res.json(venues)
})

app.get('/config', (req, res) => {
  res.json({ mapsApiKey: process.env.GOOGLE_MAPS_API_KEY })
})

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})

app.get('/api/geocode', async (req, res) => {
  const coords = await getCoordinates(req.query.address)
  res.json(coords || { lat: 55.6761, lng: 12.5683 })
})