import { Document, Schema, model } from 'mongoose';

export interface Link extends Document {
  url: string;
  channelId: string,
  userId: string,
  linkTimestamp: Date,
  date?: Date,
  metadata: Metadata,
  message: Message,
}

export interface Message {
  messageId?: string,
  text?: string,
}

export interface Metadata {
  title?: string;
  text?: string;
  serviceName?: string;
  serviceIcon?: string;
  imageUrl?: string;
};

const messageSchema = new Schema({
  messageId: { type: String },
  text: { type: String },
});

const metadataSchema = new Schema({
  title: { type: String },
  text: { type: String },
  serviceName: { type: String },
  serviceIcon: { type: String },
  imageUrl: { type: String },
});

const linkSchema = new Schema({
  url: { type: String, required: true },
  channelId: { type: String, required: true },
  userId: { type: String, required: true },
  metadata: metadataSchema, 
  message: messageSchema,
  date: Date,
  linkTimestamp: Date,
});

export default model<Link>('links', linkSchema);
