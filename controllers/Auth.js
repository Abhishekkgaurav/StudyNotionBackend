// send OTP

const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User Already Registered'
            });
        }
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log('OTP Generated', otp);
        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp }

        // create entry in dtabase

        const otpBody = await OTP.create(otpPayload);

        res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in Sending OTP"
        })
    }
}


exports.signUp = async (req, res) => {
    try {
        const { firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password does not match, please try again"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is Already Registered"
            })
        }

        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("Recenr OTP: ", recentOTP);

        if (recentOTP.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP Not Found"
            })
        }
        else if (otp != recentOTP.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        return res.status(200).json({
            success: true,
            message: "User is registered Successfully",
            user
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: trus,
            message: "User Cannot be Registered, Please Try Again"
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All Fields are required"
            });
        }
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                siccesss: false,
                message: "User is not registered, register first"
            });
        }
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user
            })
        }

        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            });
        }


    } catch (err) {

        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login Failure, Try Again"
        })

    }
}

exports.changePassword = async (req, res) => {
    try {

    } catch (err) { }
}