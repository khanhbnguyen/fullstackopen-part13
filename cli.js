require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  try {
    const blogs = await sequelize.query("select * FROM blogs", { type: QueryTypes.SELECT })
    blogs.forEach(blog => {
        const output = blog.author + ": " + blog.title + ', ' + blog.likes.toString() + ' likes'
        console.log(output)
    })
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()