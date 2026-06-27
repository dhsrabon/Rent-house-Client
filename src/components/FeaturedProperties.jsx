import PropertyCard from './shared/PropertyCard';

// আপাতত ডামি ডাটা, পরে API থেকে আনবো
const dummyProperties = [
  { id: 1, title: "Modern Luxury Villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", location: "Gulshan, Dhaka", propertyType: "villa", price: 2500, bedrooms: 4, bathrooms: 3 },
  { id: 2, title: "Cozy Family Apartment", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", location: "Banani, Dhaka", propertyType: "apartment", price: 1200, bedrooms: 3, bathrooms: 2 },
  { id: 3, title: "Downtown Studio House", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", location: "Dhanmondi, Dhaka", propertyType: "house", price: 850, bedrooms: 1, bathrooms: 1 },
  { id: 4, title: "Spacious Commercial Space", image: "https://images.unsplash.com/photo-1497366216548-37526070297c", location: "Motijheel, Dhaka", propertyType: "commercial", price: 5000, bedrooms: 0, bathrooms: 2 },
  { id: 5, title: "Lakeview Residential House", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d", location: "Uttara, Dhaka", propertyType: "house", price: 1500, bedrooms: 4, bathrooms: 4 },
  { id: 6, title: "Luxury Penthouse", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3", location: "Bashundhara, Dhaka", propertyType: "apartment", price: 3000, bedrooms: 5, bathrooms: 4 },
];

export default function FeaturedProperties() {
  return (
    <section className="py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-4">Featured Properties</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Explore our handpicked selection of top-rated properties available for rent.
          </p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}