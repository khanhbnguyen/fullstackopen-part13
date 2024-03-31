const router = require('express').Router()

const { Reading } = require('../models')


router.post('/', async (req, res) => {
  const readings = await Reading.create(req.body)
  res.json(readings)
})

module.exports = router