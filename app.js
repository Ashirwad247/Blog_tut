const express = require('express');
const path = require('path');
const app = express()
const PORT = 8000;
const mongoose = require('mongoose')
const userRoute = require('./routes/normRoutes')
const cookieParser = require('cookie-parser')
const authChecker = require('./middleware/AuthM')
const blogRoutes = require('./routes/blog')
const Blog = require('./models/blog');
const Comment = require('./models/comment');

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))

mongoose.connect('mongodb://127.0.0.1:27017/myNblog')
    .then((e) => console.log('Mongodb connected :)'))
    .catch((err) => console.log(err))

app.use(authChecker)

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({});

        res.render('home', { user: req.user, blogs: allBlogs });
    } catch (error) {
        console.error(error);
        // Handle the error appropriately
        res.status(500).send('Internal Server Error');
    }
});



app.use(userRoute)
app.use('/blog', blogRoutes)





app.get('*', (req, res) => {
    res.send('the page does not exist')
})

app.listen(PORT, () => {
    console.log(`port listening in  http://localhost:${PORT}/`)
})