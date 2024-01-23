const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png'
    },
    roles: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    try {
        const user = this;
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (err) {
        console.log('Error in hashing', err)
        next(err)
    }



})




const User = model('user', userSchema)

module.exports = User