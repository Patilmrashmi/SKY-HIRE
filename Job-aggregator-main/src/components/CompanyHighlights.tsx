const companies = [
  {
    id: 1,
    name: "Google",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&h=128&fit=crop",
    openPositions: 156
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "https://images.unsplash.com/photo-1617042375876-a13e36732a04?w=128&h=128&fit=crop",
    openPositions: 89
  },
  {
    id: 3,
    name: "Apple",
    logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128&h=128&fit=crop",
    openPositions: 94
  },
  {
    id: 4,
    name: "Amazon",
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=128&h=128&fit=crop",
    openPositions: 187
  }
];

export default function CompanyHighlights() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <img
                src={company.logo}
                alt={company.name}
                className="w-16 h-16 rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
              <p className="text-blue-600">{company.openPositions} open positions</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}