const express = require('express')
require('express-async-errors')
const app = express()
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const readingsRouter = require('./controllers/readings')
const authorsRouter = require('./controllers/authors')
const loginRouter = require('./controllers/login')
const middleware = require('./util/middleware')

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/readings', readingsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
  
start()