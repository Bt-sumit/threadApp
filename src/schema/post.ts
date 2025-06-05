import mongoose, { Document, Schema } from "mongoose";
interface PostInterface extends Document {
    userId: mongoose.Types.ObjectId,
    title: string,
    description: string,
}
const postSchema = new Schema<PostInterface>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true });

export default mongoose.model<PostInterface>("Post", postSchema);
