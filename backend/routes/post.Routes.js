import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';

import { createPost, deletePost,commentOnPost,getUserPosts, likeUnlikePost, allpost,getFollowingPost, getAllLike} from '../controllers/post.controller.js';


const router = express.Router();
router.get('/all', protectRoute, allpost);
router.get('/likes/:id', protectRoute, getAllLike);
router.get('/followingpost', protectRoute, getFollowingPost);
router.get('/getuserposts/:username', protectRoute, getUserPosts);
router.post('/create',protectRoute, createPost);
router.post('/like/:id',protectRoute, likeUnlikePost);
router.post('/comment/:id',protectRoute, commentOnPost);
router.delete('/:id',protectRoute, deletePost);
export default router;