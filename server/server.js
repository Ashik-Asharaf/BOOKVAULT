 const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-route');


//create a db fn

mongoose.connect(
    "mongodb+srv://ashikasharaf2120:Ashik%402120@cluster0.4opg4ml.mongodb.net/"
).then(() => console.log("Connected to MongoDB")).catch((error) => console.log(error));


const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"], // allow both ports
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", 
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
    })
)

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));