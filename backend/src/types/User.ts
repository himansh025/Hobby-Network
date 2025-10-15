// TypeScript: Updated types for MongoDB
export type UserId = string;

export interface User {
  id: UserId;
  username: string;
  age: number;
  hobbies: string[];
  friends: UserId[];
  createdAt: Date;
  popularityScore: number;
}

export interface CreateUserRequest {
  username: string;
  age: number;
  hobbies: string[];
}

export interface UpdateUserRequest {
  username?: string;
  age?: number;
  hobbies?: string[];
}

export interface RelationshipRequest {
  targetUserId: UserId;
}

export interface GraphNode {
  id: UserId;
  data: User;
  position?: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: UserId;
  target: UserId;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// TypeScript: Result types for service layer
export type UserResult = 
  | { success: true; data: User }
  | { success: false; error: string };

export type UsersResult = 
  | { success: true; data: User[] }
  | { success: false; error: string };

export type RelationshipResult = 
  | { success: true; data?: any }
  | { success: false; error: string };