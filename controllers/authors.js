const { Op, Sequelize } = require('sequelize')

const router = require('express').Router()

const { Blog } = require('../models')


router.get('/', async (req, res) => {

  const blogs = await Blog.findAll({
    order: [
      ['likes', 'DESC']
    ],
    attributes: { 
      exclude: ['userId', 'id', 'url', 'title', 'likes', 'createdAt', 'updatedAt'],
      include: [[Sequelize.fn('COUNT', Sequelize.col('author')), 'articles'], [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']]
    },
    group: ['author']
  })
  res.json(blogs)
})

module.exports = router