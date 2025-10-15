import { UserModel } from '../models/UserModel';
import { RelationshipModel } from '../models/Relationship';
import connectDB from '../config/db';

// TypeScript: Seed data for development
const seedUsers = [
  {
    username: 'alice',
    age: 25,
    hobbies: ['reading', 'gaming', 'hiking'],
    popularityScore: 0
  },
  {
    username: 'bob',
    age: 30,
    hobbies: ['gaming', 'cooking', 'music'],
    popularityScore: 0
  },
  {
    username: 'charlie',
    age: 22,
    hobbies: ['hiking', 'photography', 'reading'],
    popularityScore: 0
  },
  {
    username: 'diana',
    age: 28,
    hobbies: ['music', 'dancing', 'gaming'],
    popularityScore: 0
  }
];

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Clear existing data
    await UserModel.deleteMany({});
    await RelationshipModel.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Insert users
    const createdUsers:any = await UserModel.insertMany(seedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Create some relationships
    const relationships = [
      { user1: createdUsers[0]._id, user2: createdUsers[1]._id }, // Alice - Bob
      { user1: createdUsers[0]._id, user2: createdUsers[2]._id }, // Alice - Charlie
      { user1: createdUsers[1]._id, user2: createdUsers[3]._id }, // Bob - Diana
    ];
    
    await RelationshipModel.insertMany(relationships);
    console.log(`✅ Created ${relationships.length} relationships`);
    
    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
     console.log('user executed :', );
  }
};


export { seedDatabase };