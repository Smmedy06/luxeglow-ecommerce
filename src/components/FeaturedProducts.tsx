import Link from 'next/link';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  image: string;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    brand: "ALLERGAN",
    name: "Juvederm Ultra 3",
    price: "£107.99",
    image: "product-1"
  },
  {
    id: 2,
    brand: "GALDERMA",
    name: "Restylane Kysse",
    price: "£191.99",
    image: "product-2"
  },
  {
    id: 3,
    brand: "ALLERGAN",
    name: "Botox 100 Units",
    price: "£125.99",
    image: "product-3"
  },
  {
    id: 4,
    brand: "TEOSYAL",
    name: "Teosyal RHA 2",
    price: "£89.99",
    image: "product-4"
  }
];

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-[#f8f7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider mb-2">
            OUR BESTSELLERS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2c2520] mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-[#6b5d52] max-w-2xl mx-auto">
            Handpicked essentials that deliver real results
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Product Image */}
              <div className="aspect-square bg-gray-300 rounded-t-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs">{product.image}</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-3">
                <p className="text-xs text-[#ba9157] uppercase tracking-wider">
                  {product.brand}
                </p>
                <h3 className="text-lg font-semibold text-[#2c2520]">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-[#2c2520]">
                  {product.price}
                </p>
                <button className="w-full border border-[#2c2520] text-[#2c2520] py-2 px-4 rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center border border-[#2c2520] text-[#2c2520] px-8 py-3 rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors"
          >
            View All Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
