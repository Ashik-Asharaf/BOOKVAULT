
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


//register

const registerUser = async (req, res) => {
    const {userName,email,password} = req.body;

    try{

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password : hashPassword
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: 'User registered successfully',
        })

    }catch(e){
        cancole.log(e);
        res.status(500).json({
            success: false,
            message: 'Some Error Occured'});
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