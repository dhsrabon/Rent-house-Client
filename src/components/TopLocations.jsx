import Link from 'next/link';

export default function TopLocations() {
  const locations = [
    { id: 1, name: "Gulshan, Dhaka", propertyCount: 120, image: "https://images.unsplash.com/photo-1577998474537-8de2ba6554b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Banani, Dhaka", propertyCount: 85, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Dhanmondi, Dhaka", propertyCount: 64, image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "Uttara, Dhaka", propertyCount: 92, image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-4">Explore Top Locations</h2>
            <p className="text-gray-500 max-w-xl text-lg">
              Find your dream rental property in the most popular and vibrant neighborhoods.
            </p>
          </div>
          <Link href="/properties" className="btn btn-outline btn-primary mt-4 md:mt-0">
            View All Areas
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((loc) => (
            <div key={loc.id} className="relative group overflow-hidden rounded-2xl cursor-pointer h-72 shadow-md">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${loc.image}')` }}
              ></div>
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                <h3 className="text-2xl font-bold mb-1">{loc.name}</h3>
                <p className="text-sm text-gray-300">{loc.propertyCount} Properties</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}