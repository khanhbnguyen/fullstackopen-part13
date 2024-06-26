const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

const { Op } = require('sequelize')

const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

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

router.get('/', async (req, res) => {
    let where = {}

    if (req.query.search) {
      where = {
        [Op.or]: [
          { title: { [Op.iLike]: '%' + req.query.search + '%' } },
          { author: { [Op.iLike]: '%' + req.query.search + '%' } }
        ]
      }
    }

    const blogs = await Blog.findAll({
        order: [
          ['likes', 'DESC']
        ],
        attributes: { exclude: ['userId'] },
        include: {
          model: User,
          attributes: ['name']
        },
        where
      })
    res.json(blogs)
})

router.post('/', isAuthenticated, async (req, res) => {
    const user = await User.findByPk(req.session.user.id)
    try {
      const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
      return res.json(blog)
    } catch {
      return res.status(400).json({ error: 'invalid year' })
    }
    
})

router.put('/:id', blogFinder, async (req, res) => {

    if (req.blog) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        return res.status(404).end()
    }

})

router.delete('/:id', [blogFinder, isAuthenticated], async (req, res) => {
    if (req.blog) {
      if (req.blog.userId != req.session.user.id) {
        return res.status(401).json({ error: 'user not owner' })
      }

      await req.blog.destroy()

      res.status(204).end()

    } else {
      res.status(404).json({ error: 'blog not found'})
    }
})

module.exports = router