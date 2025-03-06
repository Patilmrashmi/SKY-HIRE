import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { fetchJobsFromCSV, filterJobs } from '../services/jobService';
import JobCard from '../components/JobCard';
import type { Job } from '../types';

const JobListingsPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { fetchBookmarks } = useBookmarkStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const jobsPerPage = 9; // 3 rows of 3 jobs
  const role = searchParams.get('role');
  const location = searchParams.get('location');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const filename = role || 'Mixed';
        const fetchedJobs = await fetchJobsFromCSV(filename);
        const filteredJobs = filterJobs(fetchedJobs, location);
        setJobs(filteredJobs);
        
        // Load bookmarks from local storage
        fetchBookmarks();
      } catch (err) {
        setError('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [role, location, fetchBookmarks]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
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
      <h1 className="text-3xl font-bold mb-8">Job Listings</h1>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {currentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showMatchScore={false}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobListingsPage;