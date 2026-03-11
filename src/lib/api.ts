const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

// Auth
export async function apiRegister(data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  age: number;
  university: string;
  skills: string[];
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ token: string; username: string; role: string; userId: number }>(res);
}

export async function apiLogin(data: { username: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ token: string; username: string; role: string; userId: number }>(res);
}

// Users
export async function apiGetCurrentUser() {
  const res = await fetch(`${API_BASE}/users/me`, { headers: authHeaders() });
  return handleResponse<UserResponse>(res);
}

export async function apiGetLeaderboard() {
  const res = await fetch(`${API_BASE}/users/leaderboard`, { headers: authHeaders() });
  return handleResponse<UserResponse[]>(res);
}

export async function apiGetAllProgress() {
  const res = await fetch(`${API_BASE}/users/progress`, { headers: authHeaders() });
  return handleResponse<ProgressResponse[]>(res);
}

// Challenges
export async function apiGetChallenges() {
  const res = await fetch(`${API_BASE}/challenges`, { headers: authHeaders() });
  return handleResponse<ChallengeResponse[]>(res);
}

export async function apiGetChallenge(key: string) {
  const res = await fetch(`${API_BASE}/challenges/${key}`, { headers: authHeaders() });
  return handleResponse<ChallengeResponse>(res);
}

export async function apiSubmitAnswer(key: string, answer: string) {
  const res = await fetch(`${API_BASE}/challenges/${key}/submit`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ answer }),
  });
  return handleResponse<{ correct: boolean; message: string }>(res);
}

// Admin
export async function apiCreateChallenge(data: ChallengeCreateData) {
  const res = await fetch(`${API_BASE}/admin/challenges`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<ChallengeResponse>(res);
}

export async function apiUpdateChallenge(key: string, data: ChallengeCreateData) {
  const res = await fetch(`${API_BASE}/admin/challenges/${key}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<ChallengeResponse>(res);
}

export async function apiDeleteChallenge(key: string) {
  const res = await fetch(`${API_BASE}/admin/challenges/${key}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(res);
}

export async function apiGetAllUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
  return handleResponse<UserResponse[]>(res);
}

export async function apiResetLeaderboard() {
  const res = await fetch(`${API_BASE}/admin/reset-leaderboard`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(res);
}

// Response types
export interface BadgeResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  username: string;
  email: string;
  age: number;
  university: string;
  skills: string[];
  points: number;
  completedChallenges: string[];
  badges: BadgeResponse[];
  role: string;
  createdAt: string;
}

export interface ChallengeResponse {
  id: number;
  challengeKey: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  question: string;
  hints: string[];
}

export interface ProgressResponse {
  userId: number;
  challengeId: string;
  completed: boolean;
  completedAt: string;
  pointsEarned: number;
}

export interface ChallengeCreateData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  question: string;
  answer: string;
  hints?: string[];
}
