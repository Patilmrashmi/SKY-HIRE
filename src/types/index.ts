export interface Job {
  id: string;
  role: string;
  company: string;
  experience: string;
  salary: string;
  location: string[];
  jobSummary: string;
  skills: string[];
  applyLink: string;
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  skillImprovements?: Record<string, {
    leetcode?: string;
    course?: string;
    project?: string;
    certification?: string;
    openSource?: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}