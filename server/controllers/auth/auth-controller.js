
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

const loginUser= async (req, res) => {
    const {email, password} = req.body;
     try{

        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success: false,
            message: "User doesn't exist ! Please try again"
        });

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if(!checkPasswordMatch) return res.json({
            success: false,
            message: "Incorrect password ! Please try again"
        });

        const token= jwt.sign({
            id : checkUser._id,
            role : checkUser.role,
            email : checkUser.email
        },'CLIENT_SECRET_KEY',{expiresIn : '60mins'})


        res.cookie('token',token,{httpOnly : true, secure : false }).json({
            success : true,
            message : "Logged in successfully",
            user : {
                email : checkUser.email,
                role : checkUser.role,
                id : checkUser._id
            }
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some Error Occured'});
    }

}
//logout



//auth middleware




module.exports = {registerUser, loginUser};   