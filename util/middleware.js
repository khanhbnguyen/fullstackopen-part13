const errorHandler = (error, request, response, next) => {
    if (error.name === 'SequelizeValidationError') {
        return response.status(400).end()
    } 
    next(error)
}

module.exports = {
    errorHandler
}