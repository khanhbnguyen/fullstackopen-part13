const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

const router = require('express').Router()

const { Reading } = require('../models')

function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else return res.status(401).json({ error: 'invalid session' })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', async (req, res) => {
  const readings = await Reading.create(req.body)
  res.json(readings)
})

router.put('/:id', isAuthenticated, async (req, res) => {
  const reading = await Reading.findByPk(req.params.id)
  if (reading) {
    if (reading.userId != req.session.user.id) {
      return res.status(401).json({ error: 'user not owner' })

    }
    reading.read = req.body.read
    await reading.save()
    res.json(reading)
  } else {
    res.status(404).end()
  }
})

module.exports = router