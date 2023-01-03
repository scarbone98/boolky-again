const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['email', 'auth'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

const Token = mongoose.model('Token', tokenSchema, 'tokens');

module.exports = { Token };
