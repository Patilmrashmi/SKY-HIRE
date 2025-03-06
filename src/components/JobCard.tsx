import React from 'react';
import { BookmarkPlus, BookmarkCheck, ExternalLink, MapPin, Brain, BookOpen, Code, Award, Github } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Job } from '../types';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  onBookmark?: (job: Job) => void;
  showMatchScore?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, showMatchScore = false }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookmarkedJobs, addBookmark, removeBookmark } = useBookmarkStore();
  
  // Check if this job is already bookmarked
  const isBookmarked = bookmarkedJobs.some(bookmarkedJob => 
    bookmarkedJob.id === job.id || 
    (bookmarkedJob.role === job.role && bookmarkedJob.company === job.company)
  );

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please sign in to bookmark jobs');
      navigate('/login');
      return;
    }
    
    try {
      if (isBookmarked) {
        // Find the bookmarked job with matching ID or details
        const bookmarkedJob = bookmarkedJobs.find(bJob => 
          bJob.id === job.id || 
          (bJob.role === job.role && bJob.company === job.company)
        );
        
        if (bookmarkedJob) {
          removeBookmark(user?.id, bookmarkedJob.id);
          toast.success('Job removed from bookmarks');
        }
      } else {
        addBookmark(user?.id, job);
        toast.success('Job added to bookmarks');
      }
    } catch (err) {
      toast.error('Failed to update bookmarks');
      console.error(err);
    }
  };

  const handleApply = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      toast.error('Please sign in to apply for jobs');
      navigate('/login');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-800">{job.role}</h2>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <button
          onClick={handleBookmark}
          className={`${isBookmarked ? 'text-teal-600' : 'text-gray-400'} hover:text-teal-600`}
          aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-6 w-6" />
          ) : (
            <BookmarkPlus className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>Experience: {job.experience}</p>
        <p>Salary: {job.salary}</p>
        <div className="flex items-start gap-1">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>{Array.isArray(job.location) ? job.location.join(', ') : job.location}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
        <div className="flex flex-wrap gap-2">
          {job.skills && job.skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {showMatchScore && job.matchScore !== undefined && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Match Score: {job.matchScore.toFixed(0)}%
            </p>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full"
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
          </div>

          {job.matchedSkills && job.matchedSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Your Matching Skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {job.matchedSkills.map((skill, index) => (
                  <span
                    key={`matched-${skill}-${index}`}
                    className="px-2 py-1 bg-teal-50 text-teal-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.missingSkills && job.missingSkills.length > 0 && job.skillImprovements && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Skills to Develop (AI Recommendations):
              </p>
              <div className="space-y-4">
                {job.missingSkills.map((skill, index) => {
                  const improvement = job.skillImprovements?.[skill];
                  if (!improvement) return null;

                  return (
                    <div key={`missing-${skill}-${index}`} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-teal-600 mb-2">{skill}</p>
                      <div className="space-y-2 text-sm">
                        {improvement.leetcode && (
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-gray-500" />
                            <a
                              href={improvement.leetcode}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Practice: {improvement.leetcode}
                            </a>
                          </div>
                        )}
                        {improvement.course && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            <span>{improvement.course}</span>
                          </div>
                        )}
                        {improvement.project && (
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-gray-500" />
                            <span>{improvement.project}</span>
                          </div>
                        )}
                        {improvement.certification && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-500" />
                            <span>{improvement.certification}</span>
                          </div>
                        )}
                        {improvement.openSource && (
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4 text-gray-500" />
                            <a
                              href={improvement.openSource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Contribute: {improvement.openSource}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleApply}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Apply Now
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default JobCard;