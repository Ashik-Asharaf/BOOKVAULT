
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


//register

const registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    try{
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName: username,
            email,
            password: hashPassword
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: 'User registered successfully',
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some Error Occurred'
        });
    }
}


//login

const login= async (req, res) => {
    const {email, password} = req.body;
     try{

    }catch(e){
        cancole.log(e);
        res.status(500).json({
            success: false,
            message: 'Some Error Occured'});
    }

}
//logout



//auth middleware




module.exports = {registerUser};   