import mongoose, { Document, Schema } from 'mongoose';

// TypeScript: Interface for User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  age: number;
  hobbies: string[];
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
  popularityScore: number;
}

// TypeScript: Schema definition with TypeScript types
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [2, 'Username must be at least 2 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [150, 'Age cannot exceed 150']
  },
  hobbies: [{
    type: String,
    trim: true
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  popularityScore: {
    type: Number,
    default: 0,
    min: 0
  }
},{timestamps:true}
);

// TypeScript: Compound index for better query performance
UserSchema.index({ username: 1 });
UserSchema.index({ popularityScore: -1 });
UserSchema.index({ 'friends': 1 });

// TypeScript: Mongoose model with IUser interface
export const UserModel = mongoose.model<IUser>('User', UserSchema);