const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')

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
        lng,
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
      price: 'Free concert tickets',
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
    const response = await axios.get('https://cphdox.dk/da/bliv-frivillig-paa-cphdox-2026/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)

    const roles = [
      { id: 700, title: 'CPH:DOX – Venue host', description: 'Som venue host byder du CPH:DOX\' publikum velkommen, når de ankommer til spillestedet. Du hjælper gæsterne med at finde den rigtige sal, scanner billetter og guider dem til deres pladser i salen.' },
      { id: 701, title: 'CPH:DOX – Industry guide', description: 'Som industry guide byder du professionelle gæster velkommen og scanner deres badges, når de ankommer til vores venues. Flydende engelsk er et krav.' },
      { id: 702, title: 'CPH:DOX – INTER:ACTIVE – udstillingsvært', description: 'Som udstillingsvært byder du publikum velkommen til vores INTER:ACTIVE-udstilling på Kunsthal Charlottenborg. Du scanner billetter eller arbejder som guide inde i udstillingen.' },
      { id: 703, title: 'CPH:DOX – Info desk', description: 'Info desk vagterne finder sted i Charlottenborgs foyer. De frivillige er ansvarlige for at byde VIP-gæster og filmskabere velkommen og uddele akkrediteringer.' },
      { id: 704, title: 'CPH:DOX – Produktion', description: 'Produktionsvagter indebærer opbygning og nedtagning af festivalens større produktioner på Kunsthal Charlottenborg, Industry-centret i Odd Fellow Palæet og biografen på Bremen Teater.' }
    ]

    const result = roles.map((role, i) => ({
      ...role,
      date: 'March 11–22, 2026',
      location: 'Kunsthal Charlottenborg, Copenhagen',
      category: 'stage',
      price: 'Free festival pass + film tickets',
      lat: 55.6799 + (i * 0.001),
      lng: 12.5772 + (i * 0.001),
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

    const roles = [
      { id: 800, title: 'Basement – Bar Volunteer', category: 'stage', lat: 55.6658, lng: 12.5463 },
      { id: 802, title: 'Basement – Photographer', category: 'photography', lat: 55.6656, lng: 12.5461 },
      { id: 803, title: 'Basement – Lighting', category: 'lighting', lat: 55.6659, lng: 12.5467 }
    ]

    const result = roles.map(role => ({
      ...role,
      date: 'Ongoing',
      location: 'Basement, Enghavevej 42, Copenhagen',
      description: mainDesc || 'Volunteer at Basement, a music and culture venue on Vesterbro, Copenhagen.',
      price: 'Free access to events',
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

    const result = [{
      id: 900,
      title: 'Kulturens Frivillige – Content Team Photographer',
      date: 'Ongoing',
      location: 'Copenhagen',
      category: 'photography',
      description: mainDesc || 'Join the Content Team and experience Copenhagen\'s cultural scene from behind the lens.',
      price: 'Free access to events',
      lat: 55.6761,
      lng: 12.5683,
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

    const result = [{
      id: 1000,
      title: '48TIMER Festival – Photographer',
      date: 'May 12–14, 2026',
      location: 'Blågårds Plads 2, Nørrebro, Copenhagen',
      category: 'photography',
      description: mainDesc || 'Join the photographer team at 48TIMER Festival on Nørrebro.',
      price: 'Free festival access + T-shirt',
      lat: 55.6897,
      lng: 12.5530,
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
    { name: 'CPH:DOX', address: 'Kunsthal Charlottenborg, Copenhagen', url: 'https://cphdox.dk/da/bliv-frivillig-paa-cphdox-2026/' },
  ]
  res.json(venues)
})

app.get('/images', async (req, res) => {
  try {
    const response = await axios.get('https://www.48timerfestival.dk/galleri/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(response.data)
    const images = []

    $('img').each((i, el) => {
      const src = $(el).attr('src')
      if (src && src.includes('.jpg') && src.startsWith('http') && images.length < 6) {
        images.push(src)
      }
    })

    res.json(images)
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