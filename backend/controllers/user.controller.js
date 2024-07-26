import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"

export const getUserProfile = async (req, res) =>{
        const {username} = req.params;
        try {
            const user = await User.findOne({username: username}).select("-password");
            if (!user) return res.status(404).json({message: "User not found"});
                
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({error: error.message});
            console.log("error in getUserProfile", error.message);
        }
    };


export const followUnfollowUser = async (req, res) => {
        try {
            const {id} = req.params;
            const userToModify = await User.findById(id);
            const currentUser = await User.findById(req.user._id);
            console.log(currentUser.username, );
            console.log(userToModify.username);
            

            if(id === req.user._id.toString()) {
                return res.status(400).json({message: "You cannot follow yourself"});
            }
            if(!userToModify || !currentUser) {
                return res.status(404).json({message: "User not found"});
            }

            const isfollowing = currentUser.following.includes(id);
            if(isfollowing) {
                await User.findByIdAndUpdate(id, {$pull :{followers: req.user._id}});
                await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
                const newNotifications = new Notification({
                    type: "UNFOLLOW",
                    from : req.user._id,
                    to: userToModify._id
                });
                await newNotifications.save();
                res.status(200).json({message: `user ${currentUser.username} unfollowed ${userToModify.username} `});
            } else {
                await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
                await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
                const newNotifications = new Notification({
                    type: "FOLLOW",
                    from : req.user._id,
                    to: userToModify._id
                });

                await newNotifications.save();
                res.status(200).json({message: `user ${currentUser.username} start following  ${userToModify.username}`});
                // send notification
            }
        } catch (error) {
            console.log("error in followUnfollowUser", error.message);
            res.status(500).json({error: error.message});
        }
};


export const getSuggestUsers = async (req, res) => {
	try {
		const userId = req.user._id;

		const usersFollowedByMe = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		// 1,2,3,4,5,6,
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
}; 

export const updateUser = async (req, res) => {
    const {fullname, email, currentPassword,newPassword,bio, links} = req.body;
    let {profilePic , coverImg} = req.body;

    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(404).json({error: "please provide current password and new password"});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(404).json({error: "current password is incorrect"});
            if(newPassword.length < 6){
                return res.status(404).json({error: "new password must be at least 6 characters long"});
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            if(coverImg){

                if(user.coverImg){

                    await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
                }
                const uploadedResponse = await cloudinary.uploader.upload(coverPic);
                profilePic = uploadedResponse.secure_url;
            }

            if(profilePic){
                // upload profilePi
                if(user.profilePic){

                    await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
                }
                const uploadedResponse = await cloudinary.uploader.upload(profilePic);
                profilePic = uploadedResponse.secure_url;
            }
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.links = links || user.links;
        user.coverImg = coverImg || user.coverImg;
        user.profilePic = profilePic || user.profilePic;
        await user.save();
        user.password = null;

        return res.status(200).json(user);

    }catch (err) {

    }
};
