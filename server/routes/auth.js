const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');
const router = express.Router();
const {check, validationResult} = require('express-validator')

router.post('/signup', async (req, res) =>{
    const {username, password} = req.body;

    try {
        let user = await User.findOne({username});
        if(user) return res.status(400).json({
            mes: 'user already exists'
        });

        user = new User({
            username,
            password : await bcrypt.hash(password, 7),
        })

        await user.save();

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET,{
            expiresIn: 3600,
        })

        res.status(201).json({
            message:'User created successfully',
            token
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'server side error'
        });
    }
})

router.post('/login', async(req, res) =>{
    const {username, password} = req.body;

    try {
        let user =await User.findOne({username});
        if(!user) return res.status(401).json({
            msg: 'Wrong Credentials'
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({
            mes: 'invalid credentials'
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {  // Fixed jwt.sign
            expiresIn: 3600,
        });

        res.status(201).json({
            message:'User logged in successfully successfully',
            token
        });
    } catch (error) {
        return res.status(500).json({
            message:'Unable to login'
        })
    }
})

module.exports = router;