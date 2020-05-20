import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  userName: string;
  userImage?: string;
  email: string;
}

const userSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userImage: String,
  email: { type: String, required: true },
});

export default model<IUser>('users', userSchema);
