export interface User {
  _id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: string;
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

export interface GraphNode {
  id: string;
  data: User;
  position: { x: number; y: number };
  type?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}