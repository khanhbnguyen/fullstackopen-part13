const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else return res.status(401).json({ error: 'invalid session' })
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read === "true"
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } ,
    include:[
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
        through: {
          attributes: ['id', 'read'],
          where
        }
      }
    ]
  })
  res.json(user)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    return res.json(user)
  } catch(error) {
    console.log(error)
    return res.status(400).json({ error: 'Validation isEmail on username failed' })
  }
})

router.put('/:username', isAuthenticated, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    if (req.session.user.username != req.params.username) {
      return res.status(401).json({ error: 'user not owner' })
    }
    user.username = req.body.username
    await user.save()
    req.session.user.username = req.body.username
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router