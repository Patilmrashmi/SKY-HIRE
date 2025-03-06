import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { fetchJobsFromCSV, getAvailableJobRoles } from '../services/jobService';
import { analyzeSkills } from '../services/geminiService';
import JobCard from '../components/JobCard';
import { useBookmarkStore } from '../store/bookmarkStore';
import type { Job } from '../types';

const RecommendedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchBookmarks } = useBookmarkStore();
  const [selectedRole, setSelectedRole] = useState('');
  const [skills, setSkills] = useState('');
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    // Load available job roles
    const loadRoles = async () => {
      try {
        setLoadingRoles(true);
        const roles = await getAvailableJobRoles();
        setAvailableRoles(roles);
        
        // Load bookmarks from local storage
        fetchBookmarks();
      } catch (err) {
        console.error('Failed to load job roles:', err);
      } finally {
        setLoadingRoles(false);
      }
    };
    
    loadRoles();
  }, [fetchBookmarks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !skills.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch jobs from CSV
      const jobs = await fetchJobsFromCSV(selectedRole);
      const userSkills = skills.split('\n').map(skill => skill.trim()).filter(Boolean);
      
      // Process each job with Gemini analysis
      const enhancedJobs = await Promise.all(
        jobs.map(async (job) => {
          try {
            const analysis = await analyzeSkills(userSkills, job.skills);
            console.log('AI Analysis for job:', job.role, analysis);
            
            return {
              ...job,
              matchScore: analysis.matchScore,
              matchedSkills: analysis.matchedSkills,
              missingSkills: analysis.missingSkills,
              skillImprovements: analysis.improvements
            };
          } catch (err) {
            console.error('Error analyzing job:', job.role, err);
            return job;
          }
        })
      );

      // Sort by match score and update state
      const sortedJobs = enhancedJobs
        .filter(job => job.matchScore !== undefined)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        setRecommendations(sortedJobs.slice(0, 5));
      
      if (sortedJobs.length === 0) {
        setError('No matching jobs found for your skills');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Job Recommendations</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Role
              </label>
              {loadingRoles ? (
                <div className="w-full px-4 py-2 border rounded-lg bg-gray-50">
                  Loading roles...
                </div>
              ) : (
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select Role</option>
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Skills (one per line)
              </label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                rows={5}
                placeholder="Python&#10;React&#10;Node.js"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || loadingRoles}
              className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Finding Matches...' : 'Get AI Recommendations'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing jobs with AI...</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">AI-Powered Job Matches</h2>
          <div className="grid gap-6">
            {recommendations.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showMatchScore={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedPage;