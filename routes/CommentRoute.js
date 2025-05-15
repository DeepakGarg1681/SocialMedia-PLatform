import express from 'express';
import { 
  createComment, 
  getPostComments, 
  addReply, 
  likeComment, 
  likeReply, 
  deleteComment 
} from '../controllers/CommentController.js';
import authMiddleWare from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Comment routes
router.post('/', authMiddleWare, createComment);
router.get('/post/:postId', getPostComments);
router.delete('/:commentId', authMiddleWare, deleteComment);
router.put('/:commentId/like', authMiddleWare, likeComment);

// Reply routes
router.post('/:commentId/reply', authMiddleWare, addReply);
router.put('/:commentId/reply/:replyId/like', authMiddleWare, likeReply);

export default router; 