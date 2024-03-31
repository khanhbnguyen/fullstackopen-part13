const User = require('./user')
const Blog = require('./blog')
const Reading = require('./reading')

User.hasMany(Blog)
Blog.belongsTo(User)

// User.sync({ alter: true }).then(() => {Blog.sync({ alter: true })})

User.belongsToMany(Blog, { through: Reading, as: 'readings' })
Blog.belongsToMany(User, { through: Reading, as: 'users_readings' })

module.exports = {
  User, Blog, Reading
}