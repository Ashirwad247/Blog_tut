const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const { createTokenForUser } = require('../services/Auth')
const bcrypt = require('bcrypt')

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password
    })

    const token = createTokenForUser(user);
    res.cookie('jtoken', token)
    return res.status(201).redirect('/')
})

router.get('/login', (req, res) => {
    res.render('login')
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.redirect('/login');
    let isPasswordMatch;
    try {
        isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new Error('Incorrect password');
        }

    }
    catch (err) {
        console.log('Error comparing passwords')
        throw new Error('Internal server error')
    }

    if (isPasswordMatch) {
        const token = createTokenForUser(user);
        res.cookie('jtoken', token)
        return res.status(200).redirect('/')
    }
})


router.get('/logout', (req, res) => {
    res.clearCookie('jtoken').redirect('/')
})

module.exports = router