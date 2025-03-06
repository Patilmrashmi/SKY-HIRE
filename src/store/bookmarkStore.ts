import { create } from 'zustand';
import type { Job } from '../types';

// Local storage key for bookmarks
const BOOKMARKS_STORAGE_KEY = 'sky-hire-bookmarks';

interface BookmarkState {
  bookmarkedJobs: Job[];
  loading: boolean;
  error: string | null;
  fetchBookmarks: (userId?: string) => void;
  addBookmark: (userId: string | undefined, job: Job) => void;
  removeBookmark: (userId: string | undefined, jobId: string) => void;
}

// Helper function to get bookmarks from local storage for a specific user
const getBookmarksFromStorage = (userId?: string): Job[] => {
  try {
    if (!userId) return [];
    
    const storedBookmarks = localStorage.getItem(`${BOOKMARKS_STORAGE_KEY}-${userId}`);
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
  } catch (error) {
    console.error('Error reading bookmarks from localStorage:', error);
    return [];
  }
};

// Helper function to save bookmarks to local storage for a specific user
const saveBookmarksToStorage = (userId: string | undefined, bookmarks: Job[]): void => {
  try {
    if (!userId) return;
    
    localStorage.setItem(`${BOOKMARKS_STORAGE_KEY}-${userId}`, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks to localStorage:', error);
  }
};

export const useBookmarkStore = create<BookmarkState>((set) => ({
  bookmarkedJobs: [],
  loading: false,
  error: null,
  
  fetchBookmarks: (userId) => {
    try {
      set({ loading: true, error: null });
      
      if (!userId) {
        set({ bookmarkedJobs: [], loading: false });
        return;
      }
      
      const bookmarks = getBookmarksFromStorage(userId);
      set({ bookmarkedJobs: bookmarks, loading: false });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  addBookmark: (userId, job) => {
    try {
      if (!userId) {
        set({ error: 'You must be logged in to bookmark jobs', loading: false });
        return;
      }
      
      set({ loading: true, error: null });
      
      // Get current bookmarks for this user
      const currentBookmarks = getBookmarksFromStorage(userId);
      
      // Check if job is already bookmarked
      const isAlreadyBookmarked = currentBookmarks.some(
        bookmarkedJob => 
          bookmarkedJob.id === job.id || 
          (bookmarkedJob.role === job.role && bookmarkedJob.company === job.company)
      );
      
      if (isAlreadyBookmarked) {
        set({ loading: false });
        return;
      }
      
      // Add new bookmark with a unique ID if it doesn't have one
      const newBookmark = {
        ...job,
        id: job.id || crypto.randomUUID()
      };
      
      // Update bookmarks in storage and state
      const updatedBookmarks = [...currentBookmarks, newBookmark];
      saveBookmarksToStorage(userId, updatedBookmarks);
      
      set({ 
        bookmarkedJobs: updatedBookmarks,
        loading: false 
      });
    } catch (error) {
      console.error('Error adding bookmark:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  removeBookmark: (userId, jobId) => {
    try {
      if (!userId) {
        set({ error: 'You must be logged in to manage bookmarks', loading: false });
        return;
      }
      
      set({ loading: true, error: null });
      
      // Get current bookmarks for this user
      const currentBookmarks = getBookmarksFromStorage(userId);
      
      // Filter out the bookmark to remove
      const updatedBookmarks = currentBookmarks.filter(job => job.id !== jobId);
      
      // Update storage and state
      saveBookmarksToStorage(userId, updatedBookmarks);
      
      set({
        bookmarkedJobs: updatedBookmarks,
        loading: false
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      set({ error: (error as Error).message, loading: false });
    }
  }
}));