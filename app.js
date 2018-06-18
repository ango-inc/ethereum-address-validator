const express = require('express')
const bodyParser = require('body-parser')
const validate = require('./validator').validate

const PORT = process.env.PORT || 9999

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if (!req.body || !req.body.signature || !req.body.ethereum_address || !req.body.message) {
    res.status(400).send(JSON.stringify({ message: 'Invalid request', request: req.body })).end()
    return
  }

  const sig = req.body.signature
  const sentAddress = req.body.ethereum_address
  const message = req.body.message

  const result = validate(sig, message, sentAddress)
  res.status(200).send(JSON.stringify(result)).end()
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
