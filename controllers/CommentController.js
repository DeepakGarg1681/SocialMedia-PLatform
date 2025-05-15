import CommentModel from "../models/commentModel.js";

// Create a comment
export const createComment = async (req, res) => {
  const { postId, userId, text } = req.body;
  const newComment = new CommentModel({
    postId,
    userId,
    text,
    likes: [],
    replies: []
  });

  try {
    const comment = await newComment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get comments for a post
export const getPostComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await CommentModel.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Add a reply to a comment
export const addReply = async (req, res) => {
  const { commentId } = req.params;
  const { userId, text } = req.body;
  
  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }

    comment.replies.push({
      userId,
      text,
      likes: [],
      createdAt: new Date()
    });

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Like/Unlike a comment
export const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }

    if (!comment.likes.includes(userId)) {
      await comment.updateOne({ $push: { likes: userId } });
      res.status(200).json("Comment liked");
    } else {
      await comment.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Comment unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Like/Unlike a reply
export const likeReply = async (req, res) => {
  const { commentId, replyId } = req.params;
  const { userId } = req.body;

  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json("Reply not found");
    }

    if (!reply.likes.includes(userId)) {
      reply.likes.push(userId);
    } else {
      reply.likes = reply.likes.filter(id => id !== userId);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const comment = await CommentModel.findById(commentId);
    if (comment.userId === userId) {
      await comment.deleteOne();
      res.status(200).json("Comment deleted successfully");
    } else {
      res.status(403).json("You can only delete your own comments");
    }
  } catch (error) {
    res.status(500).json(error);
  }
}; 