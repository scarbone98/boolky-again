const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
});

const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tags: [
        {
            type: String,
            required: true
        }
    ],
    likes: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Post = mongoose.model('Post', postSchema, 'posts');
const Comment = mongoose.model('Comment', commentSchema);
const Reply = mongoose.model('Reply', replySchema);

module.exports = { Post, Comment, Reply };
