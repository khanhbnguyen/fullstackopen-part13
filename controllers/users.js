const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

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
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } ,
    include:[
      // {
      //   model: Blog,
      //   attributes: { exclude: ['userId'] }
      // },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
        through: {
          attributes: ['id', 'read']
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
    return res.status(400).json({ error: 'Validation isEmail on username failed' })
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router