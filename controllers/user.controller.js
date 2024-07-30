const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const sendEmail = require("../utils/email")
const { sendSMS } = require("../utils/sms")

exports.VerifyUserEmail = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are Not Logged in Please Login Again" })
    }
    const otp = Math.floor(10000 + Math.random() * 900000)
    await User.findByIdAndUpdate(req.loggedInUser, { emailCode: otp })
    console.log(result);
    await sendEmail({
        to: result.email, subject: `Email OTP`, message: `
        <h1>Do Not Share Your Account OTP </h1>
        <p>your login otp ${otp}</p>
        `})

    res.json({ message: "Verify User Email Success" })
})

exports.verifyEmailOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You Are Not Logged In.Plese LOgin Again" })
    }
    if (otp != result.emailcode) {
        return res.status(400).json({ message: "INvalid OTP" })
    }
    const UpdatedUser = await User.findByIdAndUpdate(req.loggedInUser, { emailverified: true })
    res.json({
        message: "User Email Verifyed Success", result: {
            _id: UpdatedUser._id,
            name: UpdatedUser.name,
            mobile: UpdatedUser.mobile,
            email: UpdatedUser.email,
            avatar: UpdatedUser.avatar,
            emailVerified: UpdatedUser.emailVerified,
            mobileVerified: UpdatedUser.mobileVerified,
        }
    })
})
exports.verifyMobilOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You Are Not Logged In.Plese LOgin Again" })
    }
    if (otp !== result.mobailcode) {
        return res.status(400).json({ message: "INvalid OTP" })
    }
    const updatetedUser = await User.findByIdAndUpdate(req.loggedInUser, { emailverified: true }, { new: true })
    res.json({
        message: "Email Verify Success", result: {
            _id: updatetedUser._id,
            name: updatetedUser.name,
            email: updatetedUser.email,
            mobail: updatetedUser.mobail,
            avatar: updatetedUser.avatar,
            emailverified: updatetedUser.emailverified,
            mobailverified: updatetedUser.mobailverified,
        }
    })
})

exports.VerifyUserMobile = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    const otp = Math.floor(10000 + Math.random() * 900000)
    await sendSMS({ message: `Welcome to Skillhub.Your Otp is ${otp}`, numbers: `${result.mobail}` })
    res.json({ message: "verification send success" })
})