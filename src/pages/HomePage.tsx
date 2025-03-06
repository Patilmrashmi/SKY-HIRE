import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { fetchJobsFromCSV, getAvailableJobRoles } from '../services/jobService';
import JobCard from '../components/JobCard';
import type { Job } from '../types';
import { toast } from 'react-hot-toast';

const locations = [
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Mumbai',
  'Pune',
  'Delhi',
  'Ahmedabad',
  'Lucknow',
  'Noida',
  'Thiruvananthapuram',
  'Remote'
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchBookmarks } = useBookmarkStore();
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load available job roles
        const roles = await getAvailableJobRoles();
        setAvailableRoles(roles);
        
        // Load featured jobs from Mixed.csv
        const jobs = await fetchJobsFromCSV('Mixed');
        setFeaturedJobs(jobs.slice(0, 9)); // Show first 9 jobs (3 rows of 3)
        
        // Load bookmarks from local storage for the current user
        if (user) {
          fetchBookmarks(user.id);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchBookmarks, user]);

  const handleSearch = () => {
    if (!user) {
      toast.error('Please sign in to search for jobs');
      navigate('/login');
      return;
    }
    navigate(`/jobs?role=${selectedRole}&location=${selectedLocation}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r from-teal-600 to-teal-700 h-[500px] flex items-center justify-center text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl mb-8">Discover opportunities that match your skills and ambitions</p>
          
          {/* Search Section */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleSearch}
                className="md:self-end bg-teal-600 text-white px-8 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Jobs</h2>
            <button
              onClick={() => {
                if (!user) {
                  toast.error('Please sign in to view all jobs');
                  navigate('/login');
                  return;
                }
                navigate('/jobs');
              }}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              View All Jobs →
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured jobs available.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  showMatchScore={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Why Choose SKY-HIRE Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose SKY-HIRE
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Smart Matching</h3>
              <p className="text-gray-600">Our AI-powered system matches your skills with the perfect job opportunities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Curated Listings</h3>
              <p className="text-gray-600">Hand-picked job listings from top companies across India.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Easy Apply</h3>
              <p className="text-gray-600">Direct application links to your dream job positions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SKY-HIRE</h3>
              <p className="text-gray-400">Find your dream job with our AI-powered job matching platform.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
                <li><a href="/recommended" className="text-gray-400 hover:text-white">AI Recommendations</a></li>
                <li><a href="/bookmarks" className="text-gray-400 hover:text-white">Saved Jobs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2024 SKY-HIRE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;