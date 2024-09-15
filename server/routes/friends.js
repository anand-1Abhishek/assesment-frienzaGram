const express = require('express');
const User = require('../models/users.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/request/:id',authMiddleware,  async(req, res) =>{
    try {
        const user = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if(!targetUser) return res.status(400).json({
            msg:'user not found'
        });

        if(targetUser.friendRequests.includes(user.id)){
            return res.status(400).json({
                mes:'request already sent'
            });
        }

        targetUser.friendRequests.push(user.id);
        await targetUser.save();

        res.json({msg: 'request sent successfully'});
    } catch (error) {
        return res.status(500).json({
            msg: 'server error'
        })
    }
})

router.post('/accept/:id',authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const friendUser = await User.findById(req.params.id);

        if(!friendUser) return res.status(400).json({
            msg:'user not found'
        });

        user.friends.push(friendUser.id);
        friendUser.friends.push(user.id);

        user.friendRequests = user.friendRequests.filter((reqId)=>{
            reqId.toString() !== friendUser.id
        });

        user.save();
        friendUser.save();

        res.json({message: 'friend request accepted'});

    } catch (error) {
        return res.status(500).json({
            msg: 'server error'
        })
    }
})

router.post('/mutualFriend/:id',authMiddleware, async (req,res) =>{
    try {
        const user = await User.findById(req.user.id);
        const anotherUser = await User.findById(req.params.id);

        if(!anotherUser) return res.status(400).json({
            message: 'Another User doesnt exist' 
        });

        const mutualFriends = await User.find({
            _id: { $in: user.friends, $in: anotherUser.friends }
        }).select('username');
          

        res.status(201).json({
            mutualFriends
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server side error'
        });
    }
}) ;

router.get('/allFriends', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('friends', 'username _id');
      const friends = user.friends;
  
      res.status(200).json(friends);  // Return friends array directly
    } catch (error) {
      return res.status(500).json({
        message: 'server side error'
      });
    }
  });
  

module.exports = router;