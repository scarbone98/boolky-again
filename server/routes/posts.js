const router = require('express').Router();
const { Post, Comment } = require('../models/post');

router.post('/createPost', async (req, res) => {
    const { title, tags = [] } = req.body;
    const { id } = req.decoded;

    const newPost = new Post({
        title,
        comments: [],
        tags,
        createdAt: new Date(),
        author: id
    });

    newPost.save((error, result) => {
        if (error) {
            return res.status(500).send({ error });
        } else {
            return res.status(200).send({ data: 'success' });
        }
    });
});

router.get('/fetchBookPosts', async (req, res) => {
    const { searchTag } = req.query;
    const posts = await Post.aggregate([
        {
            "$match": { tags: searchTag }
        },
        {
            "$limit": 5
        },
        {
            "$lookup": {
                "from": "comments",
                "localField": "_id",
                "foreignField": "parentPost",
                "as": "commentCount"
            }
        },
        {
            "$addFields": {
                "commentCount": {
                    $size: "$commentCount"
                }
            }
        }]);
    return res.status(200).send({ data: posts });
});

router.get('/fetchPostComments', async (req, res) => {
    const { postId } = req.query;
    const comments = await Comment.find({ parentPost: postId }).limit(5).populate('author');
    return res.status(200).send({ data: comments });
});


router.post('/createComment', async (req, res) => {
    const { commentText, postId } = req.body;
    const { id } = req.decoded;
    const newComment = new Comment({
        text: commentText,
        author: id,
        parentPost: postId
    });

    await newComment.save();

    return res.status(200).send({ data: 'success' });

});

module.exports = router;