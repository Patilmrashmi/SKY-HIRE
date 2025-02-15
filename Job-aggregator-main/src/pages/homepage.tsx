import Navbar from '.././components/Navbar';
import HeroSection from '.././components/HeroSection';
import JobCategories from '.././components/JobCategories';
import FeaturedJobs from '.././components/FeaturedJobs';


function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <JobCategories />
        <FeaturedJobs />
      </main>
      <footer className="bg-gray-900 text-gray-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <span className="text-2xl font-bold text-white mb-6 block">SkyHire</span>
              <p className="text-sm">
                Connecting talented professionals with innovative companies worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white">Browse Companies</a></li>
                <li><a href="#" className="hover:text-white">Salary Calculator</a></li>
                <li><a href="#" className="hover:text-white">Career Advice</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Employers</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white">Post a Job</a></li>
                <li><a href="#" className="hover:text-white">Hiring Solutions</a></li>
                <li><a href="#" className="hover:text-white">Pricing Plans</a></li>
                <li><a href="#" className="hover:text-white">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-sm text-center">
            © 2024 HireMe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage