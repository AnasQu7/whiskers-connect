
import { Community, Post, User } from "@/types";

const API_BASE_URL = "https://b702-2405-201-5018-883b-291d-a362-edc4-e2c.ngrok-free.app";

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string, 
  method: string = "GET", 
  data?: any
): Promise<T> {
  const token = localStorage.getItem("token");
  
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "An error occurred");
  }
  
  return await response.json();
}

// Auth API
export const authAPI = {
  register: (username: string, password: string) => 
    apiRequest<{ message: string }>("/api/register", "POST", { username, password }),
  
  login: async (username: string, password: string) => {
    // This would typically call a login endpoint that returns a token
    // Since we're using passport.js, we'll mock this for now
    // In a real app, this would be handled by passport.js
    const users = await apiRequest<User[]>("/api/users");
    const user = users.find(u => u.username === username);
    
    if (user) {
      // Mock token for demonstration
      const token = btoa(`${username}:${new Date().getTime()}`);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    
    throw new Error("Invalid credentials");
  },
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  
  getUsers: () => apiRequest<User[]>("/api/users"),
};

// Communities API
export const communitiesAPI = {
  getAll: () => apiRequest<Community[]>("/api/communities"),
  
  getById: (id: string) => apiRequest<Community>(`/api/community/${id}`),
  
  create: (name: string, isPrivate: boolean) => 
    apiRequest<{ message: string }>("/api/community", "POST", { name, isPrivate }),
  
  join: (communityId: string, userId: string) => 
    apiRequest<{ message: string }>("/api/community/join", "POST", { communityId, userId }),
  
  getMembers: (id: string) => apiRequest<string[]>(`/api/community/${id}/members`),
};

// Posts API
export const postsAPI = {
  getAll: (communityId: string, sort?: string) => {
    const endpoint = `/api/community/${communityId}/posts${sort ? `?sort=${sort}` : ''}`;
    return apiRequest<Post[]>(endpoint);
  },
  
  getById: (id: string) => apiRequest<Post>(`/api/post/${id}`),
  
  create: (communityId: string, data: { content: string, videoLink?: string, imageLink?: string }) => 
    apiRequest<{ message: string, post: Post }>(`/api/community/${communityId}/post`, "POST", data),
};
