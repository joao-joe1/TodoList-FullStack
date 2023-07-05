const validateBody = (request, response, next) => {
    const { body } = request

    const errors = []

    if (!body.title) {
        errors.push('O campo título é obrigatório!')
    }

    if (!body.status) {
        errors.push('O campo status é obrigatório!')
    }

    if (errors.length > 0) {
        return response.status(400).json({ errors })
    }

    next()
}


module.exports = {
    validateBody
}