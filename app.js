const express = require('express');
const app = express();
const path = require('path');
const PORT = 8000;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

app.set('view engine', 'ejs');
app.set('views',path.resolve('./views'));

app.use(express.static(path.resolve('./public')))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
.then((e)=>console.log('MongoDb conncected'))
.catch((err)=>console.log(err));

app.get('/', async (req, res)=>{
    const allBlogs = await Blog.find({});
    res.render('home', {
        user:req.user,
        blogs:allBlogs,
    })
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, ()=>console.log(`Server started at port ${PORT}`))