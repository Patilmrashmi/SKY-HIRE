import { Code, Palette, BarChart, Briefcase, Headphones, ShoppingBag } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: 'Development',
    icon: Code,
    jobs: 1420,
    color: 'from-pink-400 to-pink-500'
  },
  {
    id: 2,
    title: 'Design',
    icon: Palette,
    jobs: 870,
    color: 'from-rose-400 to-rose-500'
  },
  {
    id: 3,
    title: 'Marketing',
    icon: BarChart,
    jobs: 650,
    color: 'from-pink-500 to-rose-400'
  },
  {
    id: 4,
    title: 'Management',
    icon: Briefcase,
    jobs: 320,
    color: 'from-rose-500 to-pink-400'
  },
  {
    id: 5,
    title: 'Customer Service',
    icon: Headphones,
    jobs: 940,
    color: 'from-pink-300 to-pink-400'
  },
  {
    id: 6,
    title: 'Sales',
    icon: ShoppingBag,
    jobs: 560,
    color: 'from-rose-300 to-rose-400'
  }
];

export default function JobCategories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-gray-600">
            Find the perfect role by exploring our job categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="group p-8 rounded-2xl border border-pink-100 hover:border-transparent hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${category.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-gray-500">
                      {category.jobs.toLocaleString()} jobs available
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}