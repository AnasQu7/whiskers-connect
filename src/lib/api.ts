
import { Community, Post, User } from "@/types";

const API_BASE_URL = "http://localhost:3000"; // Updated to use the local API URL

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
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Invalid credentials");
      }
      
      const data = await response.json();
      
      // Store token and user data in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data.user;
      }
      
      throw new Error("Authentication failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
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
