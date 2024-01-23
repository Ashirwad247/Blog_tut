const express = require('express')
const User = require('../models/user')
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password
    });

    const pay_load = { id: user._id, name: user.name };
    const token = jwt.sign(pay_load, 'Secretidy');

    res.cookie('jtoken', token).redirect('/');
});

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new Error('Incorrect password');
        }

        const pay_load = { id: user._id, name: user.name }
        const token = jwt.sign(pay_load, 'Secretidy');
        return res.status(200).cookie('jtoken', token).redirect('/')
    } catch (error) {
        throw error;
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('jtoken').redirect('/')
})



module.exports = router