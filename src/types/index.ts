export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  age: number;
  university: string;
  skills: string[];
  points: number;
  completedChallenges: string[];
  badges: Badge[];
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  question: string;
  answer?: string;
  hints?: string[];
}

export type ChallengeCategory =
  | 'Web Security'
  | 'Cryptography'
  | 'Networking'
  | 'Phishing Detection'
  | 'Password Security';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserProgress {
  userId: string;
  challengeId: string;
  completed: boolean;
  completedAt: string;
  pointsEarned: number;
}

export type UserRole = 'admin' | 'user';

export interface AppState {
  currentUser: User | null;
  role: UserRole;
  users: User[];
  challenges: Challenge[];
  userProgress: UserProgress[];
}
