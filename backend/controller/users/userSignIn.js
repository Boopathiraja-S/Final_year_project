const bcrypt = require("bcryptjs");
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body

        if (!email) {
            throw new Error("Please provide email");
        }
        if (!password) {
            throw new Error("Please provide password");
        }

        // Find the user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new Error("User not found!");
        }

        // Compare the plain-text password with the stored hashed password
        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            // Generate JWT token if password matches
            const tokenData = {
                _id: user._id,
                email: user.email,
            };

            const token = await jwt.sign(
                tokenData,
                process.env.TOKEN_SECRET_KEY,
                { expiresIn: 60 * 60 * 8 }
            );

            const tokenOption = {
                httpOnly: true,
                secure : true
            };

            res.cookie("token", token, tokenOption).status(200).json({
                message: "Login Successful",
                data: token,
                success: true,
                error: false
            });
        } else {
            throw new Error("Incorrect password!");
        }
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignInController;
