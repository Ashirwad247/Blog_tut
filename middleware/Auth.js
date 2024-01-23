const jwt = require('jsonwebtoken')
const { validateToken } = require('../services/Auth')

const authChecker = (req, res, next) => {
    const tokenVal = req.cookies.jtoken;
    if (!tokenVal) {

        req.user = null;
        res.locals.user = null;
        return next(); // Content headers will be set if not used properly
    }

    try {
        const userPayload = validateToken(tokenVal);
        req.user = userPayload.id;
        res.locals.user = userPayload;
        return next();// Content headers will be set if not used properly

    } catch (err) {
        console.log('error in valdiating the user', err);
        return res.status(401).send('Unauthroized')
    }
    return next();
}

module.exports = authChecker;