import mongoose from "mongoose";

const replySchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    text: { type: String, required: true },
    likes: [{ type: String }],
    createdAt: {
      type: Date,
      default: new Date(),
    }
  },
  {
    timestamps: true,
  }
);

const commentSchema = mongoose.Schema(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
    likes: [{ type: String }],
    replies: [replySchema],
    createdAt: {
      type: Date,
      default: new Date(),
    }
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model("Comments", commentSchema);

export default CommentModel; 