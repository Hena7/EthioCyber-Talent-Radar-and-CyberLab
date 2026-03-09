'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { User, Challenge, UserProgress, UserRole, Badge } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { defaultChallenges } from '@/data/challenges';
import { availableBadges } from '@/data/badges';

interface AppContextType {
  currentUser: User | null;
  role: UserRole;
  users: User[];
  challenges: Challenge[];
  userProgress: UserProgress[];
  setRole: (role: UserRole) => void;
  registerUser: (user: Omit<User, 'id' | 'points' | 'completedChallenges' | 'badges' | 'createdAt'>) => void;
  loginUser: (username: string) => boolean;
  logoutUser: () => void;
  updateUser: (user: User) => void;
  completeChallenge: (challengeId: string) => boolean;
  addChallenge: (challenge: Omit<Challenge, 'id'>) => void;
  updateChallenge: (challenge: Challenge) => void;
  deleteChallenge: (challengeId: string) => void;
  resetLeaderboard: () => void;
  getUserRank: (userId: string) => number;
  getLeaderboard: () => User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>('challenges', defaultChallenges);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress[]>('userProgress', []);
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('currentUserId', null);
  const [role, setRole] = useLocalStorage<UserRole>('userRole', 'user');

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find((u) => u.id === currentUserId) || null;
  }, [currentUserId, users]);

  const checkAndAwardBadges = useCallback(
    (user: User, allChallenges: Challenge[]): Badge[] => {
      const newBadges: Badge[] = [...user.badges];
      const completedCount = user.completedChallenges.length;
      const completedChallengeObjects = allChallenges.filter((c) =>
        user.completedChallenges.includes(c.id)
      );

      const badgeChecks: { id: string; condition: boolean }[] = [
        { id: 'first-challenge', condition: completedCount >= 1 },
        { id: 'five-challenges', condition: completedCount >= 5 },
        { id: 'ten-challenges', condition: completedCount >= 10 },
        {
          id: 'all-easy',
          condition:
            allChallenges.filter((c) => c.difficulty === 'Easy').length > 0 &&
            allChallenges
              .filter((c) => c.difficulty === 'Easy')
              .every((c) => user.completedChallenges.includes(c.id)),
        },
        {
          id: 'all-medium',
          condition:
            allChallenges.filter((c) => c.difficulty === 'Medium').length > 0 &&
            allChallenges
              .filter((c) => c.difficulty === 'Medium')
              .every((c) => user.completedChallenges.includes(c.id)),
        },
        {
          id: 'all-hard',
          condition:
            allChallenges.filter((c) => c.difficulty === 'Hard').length > 0 &&
            allChallenges
              .filter((c) => c.difficulty === 'Hard')
              .every((c) => user.completedChallenges.includes(c.id)),
        },
        {
          id: 'web-security-master',
          condition:
            allChallenges.filter((c) => c.category === 'Web Security').length > 0 &&
            allChallenges
              .filter((c) => c.category === 'Web Security')
              .every((c) => user.completedChallenges.includes(c.id)),
        },
        {
          id: 'crypto-master',
          condition:
            allChallenges.filter((c) => c.category === 'Cryptography').length > 0 &&
            completedChallengeObjects.filter((c) => c.category === 'Cryptography').length ===
              allChallenges.filter((c) => c.category === 'Cryptography').length,
        },
        {
          id: 'network-master',
          condition:
            allChallenges.filter((c) => c.category === 'Networking').length > 0 &&
            allChallenges
              .filter((c) => c.category === 'Networking')
              .every((c) => user.completedChallenges.includes(c.id)),
        },
        { id: 'points-500', condition: user.points >= 500 },
        { id: 'points-1000', condition: user.points >= 1000 },
      ];

      for (const check of badgeChecks) {
        if (check.condition && !newBadges.find((b) => b.id === check.id)) {
          const badgeTemplate = availableBadges.find((b) => b.id === check.id);
          if (badgeTemplate) {
            newBadges.push({ ...badgeTemplate, earnedAt: new Date().toISOString() });
          }
        }
      }

      return newBadges;
    },
    []
  );

  const registerUser = useCallback(
    (userData: Omit<User, 'id' | 'points' | 'completedChallenges' | 'badges' | 'createdAt'>) => {
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        points: 0,
        completedChallenges: [],
        badges: [],
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUserId(newUser.id);
    },
    [setUsers, setCurrentUserId]
  );

  const loginUser = useCallback(
    (username: string): boolean => {
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
      if (user) {
        setCurrentUserId(user.id);
        return true;
      }
      return false;
    },
    [users, setCurrentUserId]
  );

  const logoutUser = useCallback(() => {
    setCurrentUserId(null);
  }, [setCurrentUserId]);

  const updateUser = useCallback(
    (updatedUser: User) => {
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    },
    [setUsers]
  );

  const completeChallenge = useCallback(
    (challengeId: string): boolean => {
      if (!currentUser) return false;
      if (currentUser.completedChallenges.includes(challengeId)) return false;

      const challenge = challenges.find((c) => c.id === challengeId);
      if (!challenge) return false;

      const updatedUser: User = {
        ...currentUser,
        points: currentUser.points + challenge.points,
        completedChallenges: [...currentUser.completedChallenges, challengeId],
      };

      updatedUser.badges = checkAndAwardBadges(updatedUser, challenges);

      // Check top 10 badge
      const allUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      const sorted = [...allUsers].sort((a, b) => b.points - a.points);
      const rank = sorted.findIndex((u) => u.id === updatedUser.id) + 1;
      if (rank <= 10 && !updatedUser.badges.find((b) => b.id === 'top-10')) {
        const topBadge = availableBadges.find((b) => b.id === 'top-10');
        if (topBadge) {
          updatedUser.badges.push({ ...topBadge, earnedAt: new Date().toISOString() });
        }
      }

      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

      const progress: UserProgress = {
        userId: currentUser.id,
        challengeId,
        completed: true,
        completedAt: new Date().toISOString(),
        pointsEarned: challenge.points,
      };
      setUserProgress((prev) => [...prev, progress]);

      return true;
    },
    [currentUser, challenges, users, checkAndAwardBadges, setUsers, setUserProgress]
  );

  const addChallenge = useCallback(
    (challengeData: Omit<Challenge, 'id'>) => {
      const newChallenge: Challenge = {
        ...challengeData,
        id: `challenge-${Date.now()}`,
      };
      setChallenges((prev) => [...prev, newChallenge]);
    },
    [setChallenges]
  );

  const updateChallenge = useCallback(
    (updatedChallenge: Challenge) => {
      setChallenges((prev) =>
        prev.map((c) => (c.id === updatedChallenge.id ? updatedChallenge : c))
      );
    },
    [setChallenges]
  );

  const deleteChallenge = useCallback(
    (challengeId: string) => {
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    },
    [setChallenges]
  );

  const resetLeaderboard = useCallback(() => {
    setUsers((prev) =>
      prev.map((u) => ({ ...u, points: 0, completedChallenges: [], badges: [] }))
    );
    setUserProgress([]);
  }, [setUsers, setUserProgress]);

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
      setRole,
      registerUser,
      loginUser,
      logoutUser,
      updateUser,
      completeChallenge,
      addChallenge,
      updateChallenge,
      deleteChallenge,
      resetLeaderboard,
      getUserRank,
      getLeaderboard,
    }),
    [
      currentUser,
      role,
      users,
      challenges,
      userProgress,
      setRole,
      registerUser,
      loginUser,
      logoutUser,
      updateUser,
      completeChallenge,
      addChallenge,
      updateChallenge,
      deleteChallenge,
      resetLeaderboard,
      getUserRank,
      getLeaderboard,
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
