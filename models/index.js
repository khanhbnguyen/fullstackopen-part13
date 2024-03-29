const User = require('./user')
const Blog = require('./blog')

User.hasMany(Blog)
Blog.belongsTo(User)

User.sync({ alter: true }).then(() => {Blog.sync({ alter: true })})


module.exports = {
  User, Blog
}