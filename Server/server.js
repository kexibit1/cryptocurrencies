const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./Routes/auth');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
    ,() => {
    console.log('Connected to DB');
})

// Routes
app.use('/auth', router);



app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
})