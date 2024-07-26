import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    fullname: {type: String},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    profilePic: {type: String},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default :[]}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default :[]}],
    coverImg: {type : String, default : ''},
    bio: {type: String},
    tweets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}],
    links: {
        type: 'String',
        default: '',
        match: /(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})(\/.*)?/
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
},{timestamps :true});

const User = mongoose.model('User',userSchema);

export default User;