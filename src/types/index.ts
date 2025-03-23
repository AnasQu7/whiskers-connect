
export interface User {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  videoLink?: string;
  imageLink?: string;
  content: string;
  communityId: string;
  createdAt: string;
}

export interface Community {
  _id: string;
  name: string;
  isPrivate: boolean;
  members: string[];
  posts: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}
