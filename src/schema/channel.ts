import { Document, Schema, model } from 'mongoose';

export interface Channel extends Document {
  channelId: string;
  channelName: string;
}

const channelSchema = new Schema({
  channelId: { type: String, required: true },
  channelName: { type: String, required: true },
});

export default model<Channel>('channels', channelSchema);
