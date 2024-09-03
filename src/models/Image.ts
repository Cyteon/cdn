import mongoose, { Schema, model } from "mongoose";

export interface ImageDocument {
  _id: string;
  owner: string;
  id: string;
  fileName: string;
}

const ImageSchema = new Schema<ImageDocument>({
  owner: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

const Image =
  mongoose.models?.image || model<ImageDocument>("image", ImageSchema);

export default Image;
