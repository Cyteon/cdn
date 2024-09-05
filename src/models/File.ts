import mongoose, { Schema, model } from "mongoose";

export interface FileDocument {
  _id: string;
  id: string;
  owner: string;
  fileName: string;
}

const FileSchema = new Schema<FileDocument>({
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

const File = mongoose.models?.file || model<FileDocument>("file", FileSchema);

export default File;
