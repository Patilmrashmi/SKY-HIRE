import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import JobCard from '../components/JobCard';

const BookmarksPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookmarkedJobs, loading, error, fetchBookmarks } = useBookmarkStore();

  useEffect(() => {
    // Load bookmarks from local storage for the current user
    if (user) {
      fetchBookmarks(user.id);
    }
  }, [fetchBookmarks, user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bookmarked Jobs</h1>

      {bookmarkedJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No bookmarked jobs yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {bookmarkedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              showMatchScore={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;