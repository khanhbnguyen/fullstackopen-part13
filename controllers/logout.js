const router = require('express').Router()

router.post('/', async (request, response) => {

  request.session.user = null

  response
    .status(200)
    .end()
})

module.exports = router