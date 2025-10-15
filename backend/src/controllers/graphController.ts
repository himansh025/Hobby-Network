import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { RelationshipModel } from '../models/Relationship';

// TypeScript: Graph data controller
export const getGraphData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all users
    const users = await UserModel.find().lean();
    
    const nodes = users.map(user => ({
      id: (user as any)._id.toString(),
      data: {
        id: (user as any)._id.toString(),
        username: user.username,
        age: user.age,
        hobbies: user.hobbies,
        friends: user.friends.map(friend => friend.toString()),
        createdAt: user.createdAt,
        popularityScore: user.popularityScore
      },
      position: {
        x: Math.random() * 800, // Random position for visualization
        y: Math.random() * 600
      }
    }));

    // Get all relationships
    const relationships = await RelationshipModel.find().lean();

    const edges = relationships.map(rel => ({
      id: `${(rel as any).user1.toString()}-${(rel as any).user2.toString()}`,
      source: (rel as any).user1.toString(),
      target: (rel as any).user2.toString(),
      type: 'smoothstep'
    }));

    res.status(200).json({
      success: true,
      data: {
        nodes,
        edges
      }
    });
  } catch (error) {
    console.error('Get graph data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch graph data'
    });
  }
};