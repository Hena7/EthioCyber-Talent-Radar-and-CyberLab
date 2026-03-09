import { Badge } from '@/types';

export const availableBadges: Omit<Badge, 'earnedAt'>[] = [
  {
    id: 'first-challenge',
    name: 'First Steps',
    description: 'Complete your first challenge',
    icon: '🛡️',
  },
  {
    id: 'five-challenges',
    name: 'Rising Star',
    description: 'Complete 5 challenges',
    icon: '⭐',
  },
  {
    id: 'ten-challenges',
    name: 'Cyber Warrior',
    description: 'Complete 10 challenges',
    icon: '⚔️',
  },
  {
    id: 'all-easy',
    name: 'Fundamentals Master',
    description: 'Complete all Easy challenges',
    icon: '📚',
  },
  {
    id: 'all-medium',
    name: 'Skilled Operator',
    description: 'Complete all Medium challenges',
    icon: '🎯',
  },
  {
    id: 'all-hard',
    name: 'Elite Hacker',
    description: 'Complete all Hard challenges',
    icon: '💀',
  },
  {
    id: 'web-security-master',
    name: 'Web Guardian',
    description: 'Complete all Web Security challenges',
    icon: '🌐',
  },
  {
    id: 'crypto-master',
    name: 'Cipher Breaker',
    description: 'Complete all Cryptography challenges',
    icon: '🔐',
  },
  {
    id: 'network-master',
    name: 'Network Sentinel',
    description: 'Complete all Networking challenges',
    icon: '📡',
  },
  {
    id: 'points-500',
    name: 'Point Collector',
    description: 'Earn 500 or more points',
    icon: '💎',
  },
  {
    id: 'points-1000',
    name: 'Cyber Legend',
    description: 'Earn 1000 or more points',
    icon: '🏆',
  },
  {
    id: 'top-10',
    name: 'Top 10 Talent',
    description: 'Reach the top 10 on the leaderboard',
    icon: '🔥',
  },
];
