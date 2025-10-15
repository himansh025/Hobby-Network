import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index.js';
import { UserModel } from '../src/models/UserModel.js';
import { RelationshipModel } from '../src/models/Relationship.js';

describe('User Business Logic Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cybernauts-test');
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await RelationshipModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test 1: Popularity Score Calculation
  describe('Popularity Score Calculation', () => {
    test('should calculate popularity score correctly with shared hobbies', async () => {
      // Create users with shared hobbies
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading', 'gaming', 'hiking']
      });

      const user2 = await UserModel.create({
        username: 'user2',
        age: 30,
        hobbies: ['gaming', 'music', 'reading'] // 2 shared hobbies
      });

      const user3 = await UserModel.create({
        username: 'user3',
        age: 22,
        hobbies: ['coding', 'music'] // 1 shared hobby with user2
      });

      // Create relationships
      await RelationshipModel.create({
        user1: user1._id,
        user2: user2._id
      });

      await RelationshipModel.create({
        user1: user2._id,
        user2: user3._id
      });

      // Update friends arrays
      await UserModel.findByIdAndUpdate(user1._id, {
        $addToSet: { friends: user2._id }
      });
      await UserModel.findByIdAndUpdate(user2._id, {
        $addToSet: { friends: [user1._id, user3._id] }
      });
      await UserModel.findByIdAndUpdate(user3._id, {
        $addToSet: { friends: user2._id }
      });

      // Manually trigger popularity score update
      const response = await request(app)
        .put(`/api/users/${user2._id}`)
        .send({ hobbies: user2.hobbies }); // Updating hobbies triggers score recalculation

      expect(response.status).toBe(200);

      // Verify popularity scores
      const updatedUser1 = await UserModel.findById(user1._id);
      const updatedUser2 = await UserModel.findById(user2._id);
      const updatedUser3 = await UserModel.findById(user3._id);

      // User1: 1 friend + (2 shared hobbies * 0.5) = 2.0
      expect(updatedUser1?.popularityScore).toBe(2.0);

      // User2: 2 friends + (3 shared hobbies * 0.5) = 3.5
      expect(updatedUser2?.popularityScore).toBe(3.5);

      // User3: 1 friend + (1 shared hobby * 0.5) = 1.5
      expect(updatedUser3?.popularityScore).toBe(1.5);
    });

    test('should update popularity score when hobbies change', async () => {
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading', 'gaming']
      });

      const user2 = await UserModel.create({
        username: 'user2',
        age: 30,
        hobbies: ['gaming', 'music']
      });

      // Create relationship
      await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user2._id });

      // Check initial popularity score
      const initialUser1 = await UserModel.findById(user1._id);
      expect(initialUser1?.popularityScore).toBe(1.5); // 1 friend + 1 shared hobby * 0.5

      // Update user1 hobbies to increase shared hobbies
      await request(app)
        .put(`/api/users/${user1._id}`)
        .send({ hobbies: ['gaming', 'music', 'reading'] }); // Now shares 2 hobbies

      // Check updated popularity score
      const updatedUser1 = await UserModel.findById(user1._id);
      expect(updatedUser1?.popularityScore).toBe(2.0); // 1 friend + 2 shared hobbies * 0.5
    });
  });

  // Test 2: Unlink Prevention for User Deletion
  describe('Unlink Prevention for User Deletion', () => {
    test('should prevent deletion of user with active friendships', async () => {
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading']
      });

      const user2 = await UserModel.create({
        username: 'user2',
        age: 30,
        hobbies: ['gaming']
      });

      // Create relationship
      await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user2._id });

      // Try to delete user1 (should fail)
      const deleteResponse = await request(app)
        .delete(`/api/users/${user1._id}`);

      expect(deleteResponse.status).toBe(409);
      expect(deleteResponse.body.success).toBe(false);
      expect(deleteResponse.body.error).toContain('Cannot delete user with existing friendships');

      // Verify user still exists
      const userStillExists = await UserModel.findById(user1._id);
      expect(userStillExists).not.toBeNull();
    });

    test('should allow deletion after removing all friendships', async () => {
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading']
      });

      const user2 = await UserModel.create({
        username: 'user2',
        age: 30,
        hobbies: ['gaming']
      });

      // Create relationship
      await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user2._id });

      // Remove relationship
      await request(app)
        .delete(`/api/users/${user1._id}/unlink`)
        .send({ targetUserId: user2._id });

      // Now deletion should succeed
      const deleteResponse = await request(app)
        .delete(`/api/users/${user1._id}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // Verify user is deleted
      const deletedUser = await UserModel.findById(user1._id);
      expect(deletedUser).toBeNull();
    });
  });

  // Test 3: Circular Friendship Prevention
  describe('Circular Friendship Prevention', () => {
    test('should prevent duplicate relationships between same users', async () => {
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading']
      });

      const user2 = await UserModel.create({
        username: 'user2',
        age: 30,
        hobbies: ['gaming']
      });

      // Create first relationship
      const firstResponse = await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user2._id });

      expect(firstResponse.status).toBe(201);
      expect(firstResponse.body.success).toBe(true);

      // Try to create duplicate relationship (should fail)
      const duplicateResponse = await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user2._id });

      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.body.success).toBe(false);
      expect(duplicateResponse.body.error).toContain('Relationship already exists');

      // Try reverse relationship (should also fail)
      const reverseResponse = await request(app)
        .post(`/api/users/${user2._id}/link`)
        .send({ targetUserId: user1._id });

      expect(reverseResponse.status).toBe(409);
      expect(reverseResponse.body.error).toContain('Relationship already exists');
    });

    test('should prevent self-friendship', async () => {
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading']
      });

      const selfResponse = await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user1._id });

      expect(selfResponse.status).toBe(400);
      expect(selfResponse.body.success).toBe(false);
      expect(selfResponse.body.error).toContain('Cannot create relationship with yourself');
    });
  });

  // Test 4: Relationship Management
  describe('Relationship Management', () => {
    test('should properly update both users when relationship is created', async () => {
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading']
      });

      const user2 = await UserModel.create({
        username: 'user2',
        age: 30,
        hobbies: ['gaming']
      });

      // Create relationship
      await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user2._id });

      // Verify both users have each other as friends
      const updatedUser1 = await UserModel.findById(user1._id);
      const updatedUser2 = await UserModel.findById(user2._id);
      expect(updatedUser1).not.toBeNull();
      expect(updatedUser2).not.toBeNull();

      expect(updatedUser1!.friends).toHaveLength(1);
      expect(updatedUser2!.friends).toHaveLength(1);

      expect(updatedUser1!.friends[0].toString()).toBe(user2._id.toString());
      expect(updatedUser2!.friends[0].toString()).toBe(user1._id.toString());

    });

    test('should properly update both users when relationship is removed', async () => {
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading']
      });
      console.log(user1);
      const user2 = await UserModel.create({
        username: 'user2',
        age: 30,
        hobbies: ['gaming']
      });
      console.log(user2);

      // Create relationship
      await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user2._id });

      // Remove relationship
      await request(app)
        .delete(`/api/users/${user1._id}/unlink`)
        .send({ targetUserId: user2._id });

      // Verify both users have no friends
      const updatedUser1 = await UserModel.findById(user1._id);
      const updatedUser2 = await UserModel.findById(user2._id);

      expect(updatedUser1?.friends).toHaveLength(0);
      expect(updatedUser2?.friends).toHaveLength(0);
    });
  });

  // Test 5: Graph Data Endpoint
  describe('Graph Data Endpoint', () => {
    test('should return proper graph structure with nodes and edges', async () => {
      const user1 = await UserModel.create({
        username: 'user1',
        age: 25,
        hobbies: ['reading']
      });

      const user2 = await UserModel.create({
        username: 'user2',
        age: 30,
        hobbies: ['gaming']
      });

      // Create relationship
      await request(app)
        .post(`/api/users/${user1._id}/link`)
        .send({ targetUserId: user2._id });

      // Get graph data
      const graphResponse = await request(app)
        .get('/api/graph');

      expect(graphResponse.status).toBe(200);
      expect(graphResponse.body.success).toBe(true);
      expect(graphResponse.body.data).toHaveProperty('nodes');
      expect(graphResponse.body.data).toHaveProperty('edges');

      // Verify nodes
      expect(graphResponse.body.data.nodes).toHaveLength(2);
      expect(graphResponse.body.data.nodes[0]).toHaveProperty('id');
      expect(graphResponse.body.data.nodes[0]).toHaveProperty('data');
      expect(graphResponse.body.data.nodes[0].data).toHaveProperty('username');
      expect(graphResponse.body.data.nodes[0].data).toHaveProperty('popularityScore');

      // Verify edges
      expect(graphResponse.body.data.edges).toHaveLength(1);
      expect(graphResponse.body.data.edges[0]).toHaveProperty('id');
      expect(graphResponse.body.data.edges[0]).toHaveProperty('source');
      expect(graphResponse.body.data.edges[0]).toHaveProperty('target');
    });
  });
});