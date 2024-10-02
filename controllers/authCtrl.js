const bcrypt = require("bcrypt")
const db = require("../models")
const jwt = require('jsonwebtoken')
const accessToken = process.env.SECRET_ACCESS_TOKEN

const registerUser = async (req, res) => {
    const { name, email, password, phoneNumber, preferences} = req.body;
    try {
        newUser = new db.users({
            name, 
            email,
            password,
            phoneNumber,
            preferences
        });

        const existingUser = await db.users.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "You already have an account!"
            });
        }

        const savedUser = await newUser.save();
        const userData = savedUser._doc
        res.status(200).json({
            status: "success",
            data: [userData],
            message: "Registration successful."
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [err],
            message: "Internal Server Error"
        });
    }
    res.end()
}

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
    if (updates.preferences) {
        updates.preferences = updates.preferences.formData
    }

    try {
      const user = await db.users.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (req.userData.id !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      const updatedUser = await db.users.findByIdAndUpdate(userId, updates, { new: true });
  
      res.status(200).json({
        status: 'success',
        data: updatedUser,
        message: 'User updated successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
  

const loginUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await db.users.findOne({email}).select("+password")
        if (!user) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Wrong email or password."
            })
        }
        const isPasswordValid = await bcrypt.compare(`${req.body.password}`, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Wrong email or password."
            })
        }
        let options = {
            maxAge: 180 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
        const token = user.generateAccessJWT()
        res.cookie("SessionID", token, options)
        const {password, ...userData} = user._doc
        res.status(200).json({
            status: "success",
            data: [userData],
            message: "Login successful"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: "error", 
            code: 500,
            data: [err],
            message: "Internal Server Error"
        })
    }
    res.end()   
}

const logoutUser = async (req, res) => {
    try {
        const authHeader = req.headers['cookie']
        const cookie = authHeader.split('=')[1]
        const accessToken = cookie.split(';')[0]
        const checkIfBlacklisted = await db.cookieBlacklist.findOne({token: accessToken})
        if (!checkIfBlacklisted) {
            await db.cookieBlacklist.create({token: accessToken})
        }
        res.setHeader('Clear-Site-Data', '"cookies"')
        res.status(200).json({
            status: "success",
            code: 200,
            data: [],
            message: "User logged out, goodbye"
        })
    } catch (err) {
        console.error(err)
        res.status(200).json({
            status: "error",
            code: 500,
            data: [err],
            message: "Logout failed"
        })
    }
}

const getCurrentUserInfo = async function (req, res, next) {
    const header = req.headers["cookie"]
    if (header) {
        const cookie = header.split('=')[1]
        const cookieAccessToken = cookie.split(";")[0] 
        const checkIfBlacklisted = await db.cookieBlacklist.findOne({ token: cookieAccessToken })
        if (checkIfBlacklisted) {
            req.userData = false
            next()
            return
        }
        jwt.verify(cookie, accessToken, async(err, decoded) => {
            if (err) {
                req.userData = false
                next()
                return
            }
            const {id} = decoded
            const user = await db.users.findById(id).then(res =>{return res})
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            req.userData = userData
            next()
        })
    } else {
        req.userData = false
        next()
    }
}

const getUserProfile = async function (req, res) {
    db.users.findById(req.params.id)
        .then((user) => {
            if(!user) {
                res.status(400).json({Message: 'Could not get user'})
            }
            else if (!req.userData.id) {
                res.status(401).json({Message: 'User unauthenticated'})
            }
            else {
                res.status(200).json({Data: user, Message: "Got user data"})
            }
        }
    )
}

const returnCurrentUserInfo = async (req, res) => {
    const header = req.headers["cookie"]
    if (header) {
        const cookie = header.split('=')[1]
        const cookieAccessToken = cookie.split(";")[0] 
        const checkIfBlacklisted = await db.cookieBlacklist.findOne({ token: cookieAccessToken })
        
        if (checkIfBlacklisted) {
            const userData = null
            res.status(400).json({
                status: "failure",
                code: 400,
                data: [userData],
                message: "Attempting to log in with a logged out token, reauthenticate."
            })
        }
        jwt.verify(cookie, accessToken, async(err, decoded) => {
            if (err) {
                const userData = null
                res.status(400).json({
                    status: "failure",
                    code: 400,
                    data: [userData],
                    message: "Error during getting user data"
                })
            }
            const {id} = decoded
            const user = await db.users.findById(id).then(res =>{return res})
            res.status(200).json({
                status: "success",
                code: 200,
                data: [user],
                message: "Returning user data"
            })
        })
    } else {
        res.status(400).json({
            status: "failure",
            code: 400,
            data: [],
            message: "No headers sent, user data cannot be retrieved"
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser, 
    getCurrentUserInfo,
    updateUser,
    getUserProfile,
    returnCurrentUserInfo
}