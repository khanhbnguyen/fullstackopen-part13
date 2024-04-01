const express = require('express')
const session = require('express-session')
require('express-async-errors')

const app = express()
const { PORT, SECRET } = require('./util/config')
const { connectToDatabase } = require('./util/db')

app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true
}))

const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const readingsRouter = require('./controllers/readings')
const authorsRouter = require('./controllers/authors')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const middleware = require('./util/middleware')

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/readinglist', readingsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)

app.use(middleware.errorHandler)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
  
start()