const jwt = require('jsonwebtoken')
const secret = 'Hol@a'

const createTokenForUser = (user) => {
    const payLoad = { id: user._id, name: user.name }
    const token = jwt.sign(payLoad, secret)
    return token;
}

const validateToken = (token) => {
    try {
        const userPayload = jwt.verify(token, secret);
        return userPayload;
    } catch (error) {
        // Handle the error (e.g., log it, return a specific value, or throw a new error)
        console.error('Token verification failed:', error.message);
        throw new Error('Invalid token');
    }

}

module.exports = {
    createTokenForUser, validateToken
}