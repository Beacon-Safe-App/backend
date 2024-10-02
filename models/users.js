const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const accessToken = process.env.SECRET_ACCESS_TOKEN

const UsersSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false
        },
        phoneNumber: {
            type: String,
            unique: true
        },
        preferences: {
            contacts: [{
                name: String, 
                phone_number: String
            }],
            interventionPreferences: [String], 
            pin: {
                type: String,
                max: 4,
                min: 4
            },
            accessibility: String,
            pronouns: String,
            addtlreq: String
        }
    },
    {timestamps: true}
)

UsersSchema.pre("save", function (next) {
    const user = this
    if (!user.isModified("password")) return next()
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

UsersSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    }
    return jwt.sign(payload, accessToken, {
        expiresIn: '180m'
    })
}

const users = mongoose.model("users", UsersSchema)
module.exports = users