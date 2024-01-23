const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const path = require('path')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const authChecker = require('./middleware/Auth')
const cookieParser = require('cookie-parser')
const Blog = require('./models/blog')

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.static(path.resolve('./public')))

// Middleware to parse JSON data
app.use(express.json());
app.use(cookieParser())
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(authChecker);

mongoose.connect('mongodb://127.0.0.1:27017/finalBlog')
    .then((e) => { console.log('MongoDb connected') })
    .catch(err => console.log(err))

app.get('/', async (req, res) => {
    const blogs = await Blog.find().populate('createdBy');

    res.render('home', { blogs })
})


app.use('/user', userRoute)
app.use('/blog', blogRoute)


app.listen('8000', () => {
    console.log('app listening at port http://localhost:8000/')
})