const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/signup', async (req, res) => {
    const { username, password, name, hobbies, bio } = req.body;
  
    // Check if all required fields are provided
    if (!username || !password || !name) {
      return res.status(400).json({ msg: 'Please provide username, password, and name' });
    }
  
    try {
      // Check if the user already exists
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Create new user instance
      user = new User({
        username,
        password: await bcrypt.hash(password, 7), // Hash the password
        name,
        hobbies, // Optional: Can be an empty array if not provided
        bio // Optional: Can be an empty string if not provided
      });
  
      // Save the user to the database
      await user.save();
  
      // Generate a JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 3600, // Token expiration time in seconds
      });
  
      // Respond with success message and token
      res.status(201).json({
        message: 'User created successfully',
        token
      });
    } catch (error) {
      // Handle server error
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

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

router.get('/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: 'Server error' });
    }
  });

router.get('/users/search', authMiddleware, async (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ msg: 'No search query provided' });
    }
  
    try {
      const users = await User.find({
        username: { $regex: query, $options: 'i' } // Case-insensitive search
      }).select('username _id'); // Only return username and id for now
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;