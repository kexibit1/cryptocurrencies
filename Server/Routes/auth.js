const router = require('express').Router();
const User = require('../Model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.post('/register', async (req, res) => {
    // Validate data before save user
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user already exist
    const existUser = await User.findOne({username: req.body.username})
    if (existUser) return res.status(400).send("User already exist");

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save();
        const token = jwt.sign({user: savedUser._id}, process.env.TOKEN_SECRET);
        res.cookie("token", token, {httpOnly: true}).send("User just saved");
    } catch (error) {
        console.error(error)
    }
})


router.post('/login', async (req, res) => {
    console.log(req.cookies.token);
    // validate data
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if user exist
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send("Username or Password is wrong");

    // check password

    const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrectPassword) return res.status(400).send('Username OR Password is wrong');

    const token = jwt.sign({user: user._id}, process.env.TOKEN_SECRET);
    res.cookie('token', token, {httpOnly: true}).send("You logged in");

})

router.get('/logout', (req,res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    }).send();
})

router.get('/loggedIn', (req, res) => {
    try {
        console.log(req.cookies);
        const token = req.cookies.token;
        if (!token) return res.json(false);

        jwt.verify(token, process.env.TOKEN_SECRET);

        res.send(true);
    } catch (error) {
        console.error(error);
        res.json(false);
    }
})

module.exports = router;