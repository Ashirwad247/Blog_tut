const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/signin', (req, res)=>{
    return res.render('signin');
});

router.get('/signup', (req, res)=>{
    return res.render('signup');
});


router.post('/signin', async(req, res)=>{
    const {email, password} = req.body
    try{
        const token = await User.matchPasswordAGT(email, password);
        // console.log("User", token);
         return res.cookie('token', token).redirect('/');
    }catch(err){
        return res.render('signin',{
            error:'Incorrect Email or Password',
        } );
    }
    
});

router.post('/signup',  async(req, res)=>{
    const {fullName,email, password } = req.body
    await User.create({
        fullName, email, password
    })
    console.log('user created')
    return res.redirect('/');
});


router.get('/logout', (req, res)=>{
    res.clearCookie('token').redirect('/')
})



module.exports = router;