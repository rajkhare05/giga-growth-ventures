const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleID: {
        type: Number,
        required: true,
    },
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
}, {
    timestamps: true
});

const user = mongoose.model('users', userSchema);

module.exports = user;

