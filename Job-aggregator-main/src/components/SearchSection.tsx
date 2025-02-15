import { Search, MapPin, Briefcase } from 'lucide-react';

export default function SearchSection() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Find Your Dream Job Today
        </h1>
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="ml-2 w-full focus:outline-none"
              />
            </div>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="ml-2 w-full focus:outline-none"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Search Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}