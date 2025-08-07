 const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-route');
const adminProductsRouter = require('./routes/admin/products-routes')


// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(

// "mongodb+srv://ashikasharaf2120:Ashik_2120@cluster1.ilpxdiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
"mongodb+srv://ashikasharaf2120:Ashik%402120@cluster0.4opg4ml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
{
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Connect to MongoDB
connectDB();

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
app.use('/api/admin/products', adminProductsRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));