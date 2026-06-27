export default function RentalStatistics() {
  const stats = [
    { id: 1, value: "15k+", label: "Happy Tenants" },
    { id: 2, value: "2,500+", label: "Verified Properties" },
    { id: 3, value: "4.9/5", label: "Average Rating" },
    { id: 4, value: "100+", label: "Top Locations" },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-y border-white/20 py-10">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</h2>
              <p className="text-primary-content/80 text-lg font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}