const jwt = require('jsonwebtoken')

const authChecker = (req, res, next) => {
    const token = req.cookies.jtoken;
    if (!token) {
        // console.log('no token here')
        req.user = null
        res.locals.user = null
        return next(); // Make sure to return here to exit the middleware

    }
    try {
        const userPayload = jwt.verify(token, 'Secretidy')
        // if (userPayload) console.log('yes token is correst')
        req.user = userPayload
        res.locals.user = req.user
    } catch (err) {
        return res.status(500).json('Internal server error')
    }

    next()
}

module.exports = authChecker