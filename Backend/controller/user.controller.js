const userModel = require('../models/user.model');
const {validationResult} = require('express-validator');
const { createUser } = require('../service/user.service');
const { genterateToken } = require('../utils/genrateToken');
const { bcryptPassword } = require('../utils/bcryptPassword');
const bcrypt = require('bcrypt');
const pinModel = require('../models/pins.model');
const cloudinary = require('../config/cloudinary');

module.exports.registerUser = async (req , res , next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

   try{

    const {username , email , password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message : "Please fill all the fields" })
    };

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const isUsernameExist = await userModel.findOne({ username });
    if (isUsernameExist) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcryptPassword(password)

    const user = await createUser({username , email , password: hashedPassword});
    const token = await genterateToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'User created successfully'});

   }catch(err){
    res.status(500).json(err.message)
   }
}

module.exports.loginUser = async (req , res , next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    try{

        const {email , password} = req.body;
        if(!email || !password ){
            return res.status(400).json({message : "Please fill all the fields" })
        }

        const user = await userModel.findOne({ email }).select("+password");
        if(!user){
            return res.status(400).json({message : "Invalid email or password" })
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = await genterateToken(user);

        res.cookie('token', token, { httpOnly: true });

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
    
        res.status(200).json({ message: "User logged in successfully", userWithoutPassword ,token});


    }catch(err){
        return res.status(500).json(err.message)
    }
}

module.exports.logoutUser = async (req , res, next) => {
    res.cookie('token' , ' ');
    res.clearCookie('token');
    res.status(200).json({message: 'User logged out successfully'});
}

module.exports.createPin = async (req, res) => {
    try {
        const { title, description } = req.body;
        

        if (!req.file) {
            return res.status(400).json({ message: 'Please provide an image' });
        }

        // Convert buffer to base64 string
        const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload to Cloudinary using base64 string
        const result = await cloudinary.uploader.upload(base64String);

        const createdPin = await pinModel.create({
            title,
            description,
            image: result.secure_url,  
            public_id: result.public_id, 
            userId: req.user._id,
        });

        res.status(200).json({
            message: 'Pin created successfully!',
            createdPin,
        });

    } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

module.exports.savePin = async (req , res , next) => {

    const {pinId} = req.body;

    if(!pinId){
        return res.status(400).json('unavailable');
    }

    try{
        const savedpin = await pinModel.findByIdAndUpdate(
            pinId,
            {
                $addToSet: {
                    savedBy: {
                        userId: req.user._id,
                        name: req.user.name
                    },
                },
            },
            {new:true}
        )

        const savedUserPin = await userModel.findByIdAndUpdate(
            req.user._id,
            {$addToSet:{savedPins:pinId}},
            {new:true}
        );

        return res.status(200).json('pin saved successfully');
    }catch(err){
        return res.status(500).json(err.message)
    }
}

module.exports.unSavePin = async (req, res, next) => {
    const { pinId } = req.body;

    if (!pinId) {
        return res.status(400).json('unavailable');
    }

    try {
        // 1️⃣ pinModel se savedBy array se user hatao
        const updatedPin = await pinModel.findByIdAndUpdate(
            pinId,
            {
                $pull: {
                    savedBy: { userId: req.user._id }
                },
            },
            { new: true }
        );

        // 2️⃣ userModel se savedPins array se pinId hatao
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { savedPins: pinId }
            },
            { new: true }
        );

        return res.status(200).json({
            message: 'Pin unsaved successfully',
            updatedPin,
            updatedUser,
        });
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports.unsavepin = async (req , res , next ) => {
    const {pinId} = req.body;

    if(!pinId){
        return res.status(400).json('unavailable');
    }

    try{
        const unsavedPin = await pinModel.findByIdAndUpdate(
            pinId,
            {
                $pull: {
                    savedBy: {
                        userId: req.user._id,
                        name: req.user.name
                    },
                },
            },
            {new:true}
        )

        const unsavedUserPin = await userModel.findByIdAndUpdate(
            req.user._id,
            {$pull:{savedPins:pinId}},
            {new:true}
        );

        return res.status(200).json('pin unsaved successfully');
    }catch(err){
        return res.status(500).json(err.message)
    }
};

module.exports.deletePin = async (req, res, next) => {
    try {
        const { pinId } = req.body;

        if (!pinId) {
            return res.status(400).json({ message: "Invalid Pin" });
        }

        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ message: 'You must be logged in to delete a pin' });
        }

        // Pehle pin ko find karo (takki humein public_id mile)
        const pin = await pinModel.findById(pinId);

        if (!pin) {
            return res.status(400).json({ message: "Pin not found" });
        }

        // 👇 Step 2: Cloudinary se image delete karo
        await cloudinary.uploader.destroy(pin.public_id);

        // 👇 Step 3: DB se delete karo
        await pinModel.findByIdAndDelete(pinId);

        res.status(200).json({ message: 'Pin deleted successfully from both DB and Cloudinary!' });

    } catch (err) {
        console.error('Delete Pin error:', err);
        return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

module.exports.comments = async (req , res , next) => {

    const { pinId, comment } = req.body;

    if (!pinId || !comment) {
        return res.status(400).json({ message: 'Pin ID and comment are required' });
    }

    try{
        const {pinId , comment} = req.body;
        const updatepin = await pinModel.findByIdAndUpdate(
            pinId,
            {
                $push:{
                    comments: {
                        userId:req.user._id,
                        name:req.user.username,
                        comment: comment ,
                    }
                }
            },
            { new:true }
        )

        if (!updatepin) {
            return res.status(400).json({ message: "Invalid Pin" });
        }

        return res.status(200).json({
            message: 'Comment added successfully',
            user:req.user,
        });

    }catch(err){
        return res.status(500).json(err.message)
    }
}

module.exports.deleteComments = async (req , res , next) => {
    const { commentId } = req.body;
    const { pinId } = req.body;

    if (!commentId || !pinId) {
        return res.status(400).json({ message: 'Comment ID and Pin ID are required'});
    }
    try{

        const pin = await pinModel.findById(pinId)
        if (!pin) {
            return res.status(400).json({ message: "Invalid Pin" });
        }
        const comment = pin.comments.find((comment) => comment._id.toString() === commentId);
        if (!comment) {
            return res.status(400).json({ message: "Invalid Comment" });
        }
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own comments' });
        }

        const updatedPin = await pinModel.findByIdAndUpdate(
            pinId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        return res.status(200).json({
            message: 'Comment deleted successfully',
            updatedPin
        });

    }catch(err){
        return res.status(500).json(err.message)
    }
}

module.exports.deleteCommentsAsOwner = async (req , res , next) => {
    const { commentId } = req.body;
    const { pinId } = req.body;

    if (!pinId || !commentId) {
        return res.status(400).json({ message: 'Pin ID and Comment ID are required' });
    }

    try{

        const pin = await pinModel.findById(pinId);
        if (!pin) {
            return res.status(400).json({ message: "Invalid Pin" });
        }
        
        if(pin.userId._id.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: 'Unauthorized: You can only delete comments on your own pins' });
        }

        const updatedPin = await pinModel.findByIdAndUpdate(
            pinId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        return res.status(200).json({
            message: 'Comment deleted successfully',
            updatedPin
        });

    }catch(err){
        return res.status(500).json(err.message)
    }

}

module.exports.createBio = async (req, res, next) => {
    try {
        const { bio, webLink, username } = req.body;

        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (webLink !== undefined) updateData.website = webLink;
        if (username !== undefined) updateData.username = username;

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Bio updated successfully', user: updatedUser });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports.startFollow = async (req , res , next) => {

    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        const userFollowing = await userModel.findByIdAndUpdate(req.user._id,
            {$addToSet: {following: userId}},
            {new:true}
        )

        const userFollower = await userModel.findByIdAndUpdate(userId,
            {$addToSet: {followers: req.user._id}},
            {new:true}
        )
        if(!userFollowing || !userFollower){
            return res.status(404).json({message: 'User not found'})
        }

        return res.status(200).json("User followed successfully");

    }
    catch(err){
        return res.status(500).json(err.message)
    }

}

module.exports.unFollow = async (req, res, next) => {
    try {
        const { userId } = req.body;
        
        // Find the user to unfollow
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove userId from the current user's following list
        const userUnfollowing = await userModel.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: userId } },
            { new: true }
        );

        // Remove the current user from the user's followers list
        const userUnfollowed = await userModel.findByIdAndUpdate(
            userId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        // Check if the unfollow operation was successful
        if (!userUnfollowing || !userUnfollowed) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json("user unfollowed successfully");

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.setProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Convert image to base64
        const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // 1️⃣ Get current user details
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //  Delete old image from Cloudinary 
        if (user.profilePicturePublicId) {
            try {
                await cloudinary.uploader.destroy(user.profilePicturePublicId);
            } catch (cloudErr) {
                console.error('Error deleting old profile picture:', cloudErr.message);
                
            }
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(base64String, {
            folder: 'profile_pictures',
        });

        // Update user with new profile pic + public id
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                profilePicture: result.secure_url,
                profilePicturePublicId: result.public_id
            },
            { new: true }
        );

        return res.status(200).json({
            message: 'Profile picture updated successfully',
            user: updatedUser
        });

    } catch (err) {
        console.error('Error in setProfilePicture:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

module.exports.getProfile = async (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(400).json({ message: "Invalid User" });
    }

    try {
        //  Get all pins created by the user
        const allPins = await pinModel.find({ userId: user._id });

        //  Get all pins saved by the user
        const savedPins = await pinModel.find({
            savedBy: { $elemMatch: { userId: user._id } }
        });

        //  both in response
        res.status(200).json({
            allPins: allPins,
            savedPins: savedPins,
            user: user,
        });

    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports.getAllPins = async (req, res, next) => {
    try {
        const allPins = await pinModel.find({})
        res.status(200).json(allPins);
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "Invalid User" });
    }

    try {
        const user = await userModel.findById(userId).select(
            'username profilePicture bio website followers following createdAt savedPins'
          );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //  Get all pins created by the user
        const allPins = await pinModel.find({ userId: user._id });

        //  Get all pins saved by the user
        const savedPins = await pinModel.find({
            savedBy: { $elemMatch: { userId: user._id } }
        });

        //  both in response
        res.status(200).json({
            allPins,
            savedPins,
            user: {
                _id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
                bio: user.bio,
                website: user.website,
                followers: user.followers,
                following: user.following,
                savedPins:user.savedPins,
                createdAt: user.createdAt,
            }
        });
        

    } catch (err) {
        return res.status(500).json(err.message);
    }
}