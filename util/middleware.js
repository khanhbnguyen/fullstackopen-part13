const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
        return response.status(400).json({ error: 'invalid input'})
    }
    next(error)
}

module.exports = {
    errorHandler
}