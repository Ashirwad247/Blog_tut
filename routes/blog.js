const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    res.render('add-new')
})

router.post('/add-new', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title, body, createdBy: req.user.id,
        coverImageURL: `/uploads/${req.file.filename}`
    });
    console.log(blog)


    return res.redirect('/');
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy')
    console.log(comments)
    res.render('blog', {
        user: req.user, blog,
        comments

    })
})

router.post('/comment/:id', async (req, res) => {
    const { content } = req.body;
    const comment = await Comment.create({
        content,
        blogId: req.params.id,
        createdBy: req.user.id,
    })
    return res.redirect(`/blog/${req.params.id}`)// /blogs makes it possible to redirect to same instead of blog/
})

module.exports = router