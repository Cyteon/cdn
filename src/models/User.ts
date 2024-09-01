import mongoose, { Schema, model } from "mongoose";

export interface UserDocument {
  _id: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
});

const User = mongoose.models?.user || model<UserDocument>("user", UserSchema);

export default User;
