import mongoose, { Document, Schema } from 'mongoose';

// TypeScript: Relationship interface
export interface IRelationship extends Document {
  user1: mongoose.Types.ObjectId;
  user2: mongoose.Types.ObjectId;
  createdAt: Date;
}

// Relationship schema
const RelationshipSchema: Schema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate relationships
RelationshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

export const RelationshipModel = mongoose.model<IRelationship>('Relationship', RelationshipSchema);