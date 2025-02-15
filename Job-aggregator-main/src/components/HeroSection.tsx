import { Search, MapPin } from 'lucide-react';

const popularSearches = ['UI Designer', 'Product Manager', 'Developer', 'Remote'];

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-pink-300 to-rose-200  pt-24 pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-pink-100/40 to-rose-100/40 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-rose-100/40 to-pink-100/40 blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Dream Job With{' '}
            <span className="bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
              SkyHire
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Connect with top companies and opportunities that match your skills and aspirations
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 flex items-center gap-3 px-4 py-3 border rounded-xl">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full bg-transparent focus:outline-none text-gray-900"
              />
            </div>
            <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 border rounded-xl">
              <MapPin className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="w-full bg-transparent focus:outline-none text-gray-900"
              />
            </div>
            <button className="md:col-span-3 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium hover:opacity-90">
              Search Jobs
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-sm text-gray-500">Popular Searches:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              className="px-4 py-1.5 rounded-full bg-white border border-pink-100 text-sm text-gray-700 hover:border-pink-200 hover:bg-pink-50"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}