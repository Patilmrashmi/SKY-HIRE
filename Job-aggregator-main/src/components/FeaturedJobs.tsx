import { MapPin, Clock, DollarSign } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "Dropbox",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    type: "Full-time",
    posted: "2 days ago",
    tags: ["UI/UX", "Figma", "Design Systems"]
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Spotify",
    logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=128&h=128&fit=crop",
    location: "Remote",
    salary: "$90k - $120k",
    type: "Full-time",
    posted: "1 day ago",
    tags: ["React", "TypeScript", "Tailwind"]
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Slack",
    logo: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=128&h=128&fit=crop",
    location: "New York, NY",
    salary: "$130k - $160k",
    type: "Full-time",
    posted: "3 days ago",
    tags: ["Product Strategy", "Agile", "B2B"]
  }
];

export default function FeaturedJobs() {
  return (
    <section className="py-24 bg-pink-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Jobs
            </h2>
            <p className="text-gray-600">
              Discover your next career move with our curated job listings
            </p>
          </div>
          <button className="text-pink-500 font-medium hover:text-pink-600">
            View all jobs →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-8 border border-pink-100 hover:border-pink-200 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-6">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-sm font-medium">
                  {job.type}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 mb-6">{job.company}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-5 w-5 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-500">
                  <DollarSign className="h-5 w-5 mr-2" />
                  {job.salary}
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 mr-2" />
                  {job.posted}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium hover:opacity-90 transition-opacity">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}