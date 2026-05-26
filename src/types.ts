export interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  isHint?: boolean;
}

export interface TopicProgress {
  id: string;
  title: string;
  percentage: number;
  unlocked: boolean;
  levelName: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  analogy: string;
}

export interface UserProfile {
  fullName: string;
  grade: string;
  course: string;
  username: string;
  avatarInitials: string;
  rememberSession: boolean;
  xpPoints: number;
}

export type ActiveTab = 'inicio' | 'conceptualizacion' | 'simulaciones' | 'modelos3d' | 'actividades' | 'progreso' | 'configuracion';

