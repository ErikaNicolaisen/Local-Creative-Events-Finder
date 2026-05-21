const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = 3000

app.use(express.static('public'))

app.get('/config', (req, res) => {
  res.json({ mapsApiKey: process.env.MAPS_API_KEY })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})