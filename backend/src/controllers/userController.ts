import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { RelationshipModel } from '../models/Relationship';
import mongoose from 'mongoose';

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, error: 'User ID is required' });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
            return;
        }

        const user = await UserModel.findById(id);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        });
    }
};

// Create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, age, hobbies } = req.body;

        if (!username || !age || !hobbies) {
            res.status(400).json({
                success: false,
                error: 'Username, age, and hobbies are required'
            });
            return;
        }
        
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            res.status(409).json({
                success: false,
                error: 'Username already exists'
            });
            return;
        }

        const newUser = new UserModel({
            username,
            age,
            hobbies,
            friends: [],
            popularityScore: 0
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            data: newUser
        });
    } catch (error: any) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create user'
        });
    }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, error: 'User ID is required' });
            return;
        }
        const { username, age, hobbies } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
            return;
        }

        // Find user
        const user = await UserModel.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        // Update fields
        const updateData: any = {};
        if (username !== undefined) updateData.username = username;
        if (age !== undefined) updateData.age = age;
        if (hobbies !== undefined) updateData.hobbies = hobbies;

        // Check username uniqueness if updating username
        if (username && username !== user.username) {
            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                res.status(409).json({
                    success: false,
                    error: 'Username already exists'
                });
                return;
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // Recalculate popularity score if hobbies were updated
        if (hobbies !== undefined) {
            await updatePopularityScore(id);
        }

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error: any) {
        console.error('Update user error:', error);

        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                error: Object.values(error.errors).map((err: any) => err.message).join(', ')
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to update user'
        });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ success: false, error: 'User ID is required' });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
            return;
        }

        const user = await UserModel.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        if (user.friends.length > 0) {
            res.status(409).json({
                success: false,
                error: 'Cannot delete user with existing friendships. Unlink friends first.'
            });
            return;
        }

        // Delete all relationships involving this user
        await RelationshipModel.deleteMany({
            $or: [
                { user1: new mongoose.Types.ObjectId(id) },
                { user2: new mongoose.Types.ObjectId(id) }
            ]
        });

        await UserModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user'
        });
    }
};

// Create relationship
export const createRelationship = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { targetUserId } = req.body;

        if (!id) {
            res.status(400).json({ success: false, error: 'User ID is required' });
            return;
        }

        if (!targetUserId) {
            res.status(400).json({
                success: false,
                error: 'targetUserId is required'
            });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
            res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
            return;
        }

        if (id === targetUserId) {
            res.status(400).json({
                success: false,
                error: 'Cannot create relationship with yourself'
            });
            return;
        }

        // Check if both users exist
        const [user1, user2] = await Promise.all([
            UserModel.findById(id),
            UserModel.findById(targetUserId)
        ]);

        if (!user1 || !user2) {
            res.status(404).json({
                success: false,
                error: 'One or both users not found'
            });
            return;
        }

        const [sortedId1, sortedId2] = [id, targetUserId].sort();

        const existingRelationship = await RelationshipModel.findOne({
            user1: new mongoose.Types.ObjectId(sortedId1),
            user2: new mongoose.Types.ObjectId(sortedId2)
        });

        if (existingRelationship) {
            res.status(409).json({
                success: false,
                error: 'Relationship already exists'
            });
            return;
        }

        // Create relationship
        const relationship = new RelationshipModel({
            user1: new mongoose.Types.ObjectId(sortedId1),
            user2: new mongoose.Types.ObjectId(sortedId2)
        });

        await relationship.save();

        // Update friends arrays
        await UserModel.findByIdAndUpdate(id, {
            $addToSet: { friends: targetUserId }
        });

        await UserModel.findByIdAndUpdate(targetUserId, {
            $addToSet: { friends: id }
        });

        // Update popularity scores
        await updatePopularityScore(id);
        await updatePopularityScore(targetUserId);

        res.status(201).json({
            success: true,
            message: 'Relationship created successfully',
            data: relationship
        });
    } catch (error: any) {
        console.error('Create relationship error:', error);

        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                error: 'Relationship already exists'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Failed to create relationship'
        });
    }
};

// Remove relationship
export const removeRelationship = async (req: Request, res: Response): Promise<void> => {
    try {
        let { id } = req.params;
        const { targetUserId } = req.body;
        console.log(id,targetUserId);

        if(id==null){
        res.status(400).json({
                success: false,
                error: 'id not null'
            });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
            res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
            return;
        }
        // Sort IDs to find the relationship
        const [sortedId1, sortedId2] = [id, targetUserId].sort();
        // Remove relationship
        const relationship = await RelationshipModel.findOneAndDelete({
            user1: new mongoose.Types.ObjectId(sortedId1),
            user2: new mongoose.Types.ObjectId(sortedId2)
        });

        if (!relationship) {
            res.status(404).json({
                success: false,
                error: 'Relationship not found'
            });
            return;
        }

        // Update friends arrays
        await UserModel.findByIdAndUpdate(id, {
            $pull: { friends: targetUserId }
        });

        await UserModel.findByIdAndUpdate(targetUserId, {
            $pull: { friends: id }
        });

        // Update popularity scores
        await updatePopularityScore(id);
        await updatePopularityScore(targetUserId);

        res.status(200).json({
            success: true,
            message: 'Relationship removed successfully'
        });
    } catch (error) {
        console.error('Remove relationship error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove relationship'
        });
    }
};

//  update popularity score
const updatePopularityScore = async (userId: string): Promise<void> => {
    try {
        const user = await UserModel.findById(userId).populate('friends');

        if (!user) return;

        const friendsCount = user.friends.length;

        let sharedHobbiesCount = 0;

        for (const friend of user.friends) {
            const friendDoc = await UserModel.findById(friend);
            if (friendDoc) {
                const sharedHobbies = user.hobbies.filter(hobby =>
                    (friendDoc as any).hobbies.includes(hobby)
                );
                sharedHobbiesCount += sharedHobbies.length;
            }
        }

        const popularityScore = friendsCount + (sharedHobbiesCount * 0.5);

        await UserModel.findByIdAndUpdate(userId, {
            popularityScore
        });
    } catch (error) {
        console.error('Update popularity score error:', error);
    }
};