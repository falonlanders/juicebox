const postsRouter = require('express').Router();
const { getPosts } = require('../db');
postsRouter.use((req, res, next) => {
    console.log('a request is being made to /posts');
    next();
});
postsRouter.get('/', async (req, res) => {
    const posts = await getPosts();
    res.send({
        posts
    })
})
module.exports = postsRouter