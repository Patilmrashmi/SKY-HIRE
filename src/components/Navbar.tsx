import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, BookmarkCheck, User, LogOut, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './AuthModal';
import { toast } from 'react-hot-toast';
import { useBookmarkStore } from '../store/bookmarkStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { bookmarkedJobs, fetchBookmarks } = useBookmarkStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Load bookmarks from local storage for the current user
    if (user) {
      fetchBookmarks(user.id);
    } else {
      // Clear bookmarks when no user is logged in
      fetchBookmarks(undefined);
    }
  }, [fetchBookmarks, user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8" />
              <span className="text-xl font-bold">SKY-HIRE</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/recommended" className="hover:text-teal-200">AI Recommended</Link>
            <Link to="/bookmarks" className="hover:text-teal-200 relative">
              <BookmarkCheck className="h-6 w-6" />
              {bookmarkedJobs.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {bookmarkedJobs.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
                <div className="absolute right-0 w-64 mt-2 py-2 bg-white rounded-lg shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Mail className="h-3 w-3 mr-1" />
                      <p className="truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 flex items-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navbar;