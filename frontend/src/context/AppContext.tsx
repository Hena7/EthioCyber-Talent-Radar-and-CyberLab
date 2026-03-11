'use client';

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { User, Challenge, UserProgress, UserRole, Badge } from '@/types';
import {
  apiGetCurrentUser,
  apiGetChallenges,
  apiGetLeaderboard,
  apiGetAllProgress,
  apiRegister,
  apiLogin,
  apiSubmitAnswer,
  apiCreateChallenge,
  apiUpdateChallenge,
  apiDeleteChallenge,
  apiResetLeaderboard,
  UserResponse,
  ChallengeResponse,
  ProgressResponse,
} from '@/lib/api';

interface AppContextType {
  currentUser: User | null;
  role: UserRole;
  users: User[];
  challenges: Challenge[];
  userProgress: UserProgress[];
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  registerUser: (user: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    age: number;
    university: string;
    skills: string[];
  }) => Promise<boolean>;
  loginUser: (username: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  completeChallenge: (challengeId: string, answer: string) => Promise<{ correct: boolean; message: string }>;
  addChallenge: (challenge: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    points: number;
    question: string;
    answer: string;
    hints?: string[];
  }) => Promise<void>;
  updateChallenge: (challengeId: string, challenge: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    points: number;
    question: string;
    answer: string;
    hints?: string[];
  }) => Promise<void>;
  deleteChallenge: (challengeId: string) => Promise<void>;
  resetLeaderboard: () => Promise<void>;
  getUserRank: (userId: string) => number;
  getLeaderboard: () => User[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapUserResponse(u: UserResponse): User {
  return {
    id: String(u.id),
    fullName: u.fullName,
    username: u.username,
    email: u.email,
    age: u.age,
    university: u.university,
    skills: u.skills,
    points: u.points,
    completedChallenges: u.completedChallenges,
    badges: (u.badges || []).map((b): Badge => ({
      id: b.id,
      name: b.name,
      description: b.description,
      icon: b.icon,
      earnedAt: b.earnedAt,
    })),
    createdAt: u.createdAt,
  };
}

function mapChallengeResponse(c: ChallengeResponse): Challenge {
  return {
    id: c.challengeKey,
    title: c.title,
    description: c.description,
    category: c.category as Challenge['category'],
    difficulty: c.difficulty as Challenge['difficulty'],
    points: c.points,
    question: c.question,
    hints: c.hints,
  };
}

function mapProgressResponse(p: ProgressResponse): UserProgress {
  return {
    userId: String(p.userId),
    challengeId: p.challengeId,
    completed: p.completed,
    completedAt: p.completedAt,
    pointsEarned: p.pointsEarned,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('user');
  const [users, setUsers] = useState<User[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const savedRole = localStorage.getItem('userRole');
      if (savedRole === 'admin' || savedRole === 'user') {
        setRoleState(savedRole);
      }

      try {
        const challengesData = await apiGetChallenges();
        setChallenges(challengesData.map(mapChallengeResponse));
      } catch {
        // challenges may fail silently on first load
      }

      if (token) {
        try {
          const userData = await apiGetCurrentUser();
          setCurrentUser(mapUserResponse(userData));
          setRoleState(userData.role.toLowerCase() as UserRole);
        } catch {
          localStorage.removeItem('token');
        }
      }

      try {
        const leaderboardData = await apiGetLeaderboard();
        setUsers(leaderboardData.map(mapUserResponse));
      } catch {
        // silently fail
      }

      try {
        const progressData = await apiGetAllProgress();
        setUserProgress(progressData.map(mapProgressResponse));
      } catch {
        // silently fail
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [challengesData, leaderboardData, progressData] = await Promise.all([
        apiGetChallenges(),
        apiGetLeaderboard(),
        apiGetAllProgress(),
      ]);
      setChallenges(challengesData.map(mapChallengeResponse));
      setUsers(leaderboardData.map(mapUserResponse));
      setUserProgress(progressData.map(mapProgressResponse));

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await apiGetCurrentUser();
          setCurrentUser(mapUserResponse(userData));
        } catch {
          // silently fail
        }
      }
    } catch {
      // silently fail
    }
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('userRole', newRole);
  }, []);

  const registerUser = useCallback(
    async (userData: {
      fullName: string;
      username: string;
      email: string;
      password: string;
      age: number;
      university: string;
      skills: string[];
    }): Promise<boolean> => {
      const response = await apiRegister(userData);
      localStorage.setItem('token', response.token);
      setRoleState(response.role.toLowerCase() as UserRole);
      localStorage.setItem('userRole', response.role.toLowerCase());

      const fullUser = await apiGetCurrentUser();
      setCurrentUser(mapUserResponse(fullUser));

      const leaderboardData = await apiGetLeaderboard();
      setUsers(leaderboardData.map(mapUserResponse));

      return true;
    },
    []
  );

  const loginUser = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const response = await apiLogin({ username, password });
        localStorage.setItem('token', response.token);
        setRoleState(response.role.toLowerCase() as UserRole);
        localStorage.setItem('userRole', response.role.toLowerCase());

        const fullUser = await apiGetCurrentUser();
        setCurrentUser(mapUserResponse(fullUser));

        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setCurrentUser(null);
    setRoleState('user');
  }, []);

  const completeChallenge = useCallback(
    async (challengeId: string, answer: string): Promise<{ correct: boolean; message: string }> => {
      try {
        const result = await apiSubmitAnswer(challengeId, answer);
        if (result.correct) {
          await refreshData();
        }
        return result;
      } catch {
        return { correct: false, message: 'Failed to submit answer. Please try again.' };
      }
    },
    [refreshData]
  );

  const addChallenge = useCallback(
    async (challengeData: {
      title: string;
      description: string;
      category: string;
      difficulty: string;
      points: number;
      question: string;
      answer: string;
      hints?: string[];
    }) => {
      await apiCreateChallenge(challengeData);
      await refreshData();
    },
    [refreshData]
  );

  const updateChallenge = useCallback(
    async (challengeId: string, challengeData: {
      title: string;
      description: string;
      category: string;
      difficulty: string;
      points: number;
      question: string;
      answer: string;
      hints?: string[];
    }) => {
      await apiUpdateChallenge(challengeId, challengeData);
      await refreshData();
    },
    [refreshData]
  );

  const deleteChallenge = useCallback(
    async (challengeId: string) => {
      await apiDeleteChallenge(challengeId);
      await refreshData();
    },
    [refreshData]
  );

  const resetLeaderboard = useCallback(async () => {
    await apiResetLeaderboard();
    await refreshData();
  }, [refreshData]);

  const getLeaderboard = useCallback((): User[] => {
    return [...users].sort((a, b) => b.points - a.points);
  }, [users]);

  const getUserRank = useCallback(
    (userId: string): number => {
      const sorted = getLeaderboard();
      return sorted.findIndex((u) => u.id === userId) + 1;
    },
    [getLeaderboard]
  );

  const contextValue = useMemo(
    () => ({
      currentUser,
      role,
      users,
      challenges,
      userProgress,
      isLoading,
      setRole,
      registerUser,
      loginUser,
      logoutUser,
      completeChallenge,
      addChallenge,
      updateChallenge,
      deleteChallenge,
      resetLeaderboard,
      getUserRank,
      getLeaderboard,
      refreshData,
    }),
    [
      currentUser,
      role,
      users,
      challenges,
      userProgress,
      isLoading,
      setRole,
      registerUser,
      loginUser,
      logoutUser,
      completeChallenge,
      addChallenge,
      updateChallenge,
      deleteChallenge,
      resetLeaderboard,
      getUserRank,
      getLeaderboard,
      refreshData,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
