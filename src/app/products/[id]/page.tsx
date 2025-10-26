'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
  stockCount?: number;
}

// Mock product data - in a real app, this would come from an API
const products: Product[] = [
  { 
    id: 1, 
    brand: "ALLERGAN", 
    name: "Juvederm Ultra 3", 
    price: "£107.99", 
    category: "Dermal Fillers", 
    image: "product-1",
    description: "Juvederm Ultra 3 is a hyaluronic acid dermal filler designed to add volume and fullness to the face. It's perfect for treating moderate to severe facial wrinkles and folds, particularly around the nose and mouth area. This premium filler provides natural-looking results that can last up to 12 months.",
    inStock: true,
    stockCount: 15
  },
  { 
    id: 2, 
    brand: "ALLERGAN", 
    name: "Juvederm Voluma", 
    price: "£143.99", 
    category: "Dermal Fillers", 
    image: "product-2",
    description: "Juvederm Voluma is specifically designed to add volume to the cheek area and correct age-related volume loss in the mid-face. This advanced hyaluronic acid filler provides immediate results with long-lasting effects up to 18 months.",
    inStock: true,
    stockCount: 8
  },
  { 
    id: 3, 
    brand: "GALDERMA", 
    name: "Restylane Kysse", 
    price: "£113.99", 
    category: "Dermal Fillers", 
    image: "product-3",
    description: "Restylane Kysse is the first FDA-approved hyaluronic acid filler specifically designed for lip augmentation and smoothing of perioral lines. It provides natural-looking, kissable lips with results that can last up to 12 months.",
    inStock: false,
    stockCount: 0
  },
  { 
    id: 4, 
    brand: "ALLERGAN", 
    name: "Botox 100 Units", 
    price: "£191.99", 
    category: "Anti-Wrinkle Injections", 
    image: "product-4",
    description: "Botox 100 Units is the world's most popular anti-wrinkle treatment. It temporarily relaxes facial muscles to reduce the appearance of fine lines and wrinkles, particularly around the eyes, forehead, and mouth. Results typically last 3-4 months.",
    inStock: true,
    stockCount: 12
  },
  { 
    id: 5, 
    brand: "GALDERMA", 
    name: "Dysport 300 Units", 
    price: "£167.99", 
    category: "Anti-Wrinkle Injections", 
    image: "product-5",
    description: "Dysport 300 Units is an alternative to Botox for treating moderate to severe frown lines. It works by temporarily relaxing the muscles that cause wrinkles, providing a smoother, more youthful appearance. Results can last 3-4 months.",
    inStock: true,
    stockCount: 6
  },
  { 
    id: 6, 
    brand: "GALDERMA", 
    name: "Azzalure 125 Units", 
    price: "£149.99", 
    category: "Anti-Wrinkle Injections", 
    image: "product-6",
    description: "Azzalure 125 Units is a botulinum toxin type A treatment for temporary improvement in the appearance of moderate to severe glabellar lines. It provides smooth, natural-looking results with effects lasting 3-4 months.",
    inStock: true,
    stockCount: 9
  },
  { 
    id: 7, 
    brand: "TEOSYAL", 
    name: "Teosyal RHA 2", 
    price: "£125.99", 
    category: "Dermal Fillers", 
    image: "product-7",
    description: "Teosyal RHA 2 is a hyaluronic acid filler designed for fine lines and superficial wrinkles. It provides natural-looking results with excellent biocompatibility and long-lasting effects up to 12 months.",
    inStock: true,
    stockCount: 7
  },
  { 
    id: 8, 
    brand: "MERZ", 
    name: "Belotero Balance", 
    price: "£101.99", 
    category: "Dermal Fillers", 
    image: "product-8",
    description: "Belotero Balance is a hyaluronic acid filler specifically designed for treating fine lines and superficial wrinkles. It integrates naturally with the skin tissue for smooth, natural-looking results.",
    inStock: true,
    stockCount: 11
  },
  { 
    id: 9, 
    brand: "CROMA", 
    name: "Princess Filler", 
    price: "£95.99", 
    category: "Dermal Fillers", 
    image: "product-9",
    description: "Princess Filler is a hyaluronic acid dermal filler designed for facial contouring and volume restoration. It provides natural-looking results with excellent durability and biocompatibility.",
    inStock: true,
    stockCount: 13
  },
  { 
    id: 10, 
    brand: "FILORGA", 
    name: "NCTF 135HA", 
    price: "£227.99", 
    category: "Mesotherapy", 
    image: "product-10",
    description: "NCTF 135HA is a mesotherapy treatment containing hyaluronic acid and various vitamins. It provides deep hydration and skin rejuvenation with immediate and long-term benefits for skin quality and texture.",
    inStock: true,
    stockCount: 5
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productId = parseInt(params.id as string);
    let foundProduct = products.find(p => p.id === productId);
    
    // If product not found in our data, create a fallback product
    if (!foundProduct) {
      foundProduct = {
        id: productId,
        brand: "LUXE GLOW",
        name: `Product ${productId}`,
        price: "£99.99",
        category: "Premium Skincare",
        image: `product-${productId}`,
        description: "This is a premium skincare product designed to provide exceptional results. Our products are carefully formulated with the highest quality ingredients to ensure optimal performance and customer satisfaction.",
        inStock: true,
        stockCount: 10
      };
    }
    
    setProduct(foundProduct);
    setIsLoading(false);
  }, [params.id]);

  const handleAddToCart = () => {
    if (product && product.inStock) {
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          brand: product.brand,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        });
      }
      alert(`Added ${quantity} x ${product.name} to cart!`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-[#6b5d52]">
            <li><a href="/" className="hover:text-[#ba9157]">Home</a></li>
            <li>/</li>
            <li><a href="/shop" className="hover:text-[#ba9157]">Shop</a></li>
            <li>/</li>
            <li><a href={`/shop?category=${product.category}`} className="hover:text-[#ba9157]">{product.category}</a></li>
            <li>/</li>
            <li className="text-[#2c2520] font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-32 h-32 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{product.image}</p>
              </div>
            </div>
            
            {/* Additional product images would go here */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#ba9157] uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold text-[#2c2520] mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-[#2c2520] mb-4">
                {product.price}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stockCount} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-[#2c2520] mb-3">Description</h3>
              <p className="text-[#6b5d52] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-[#2c2520] mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ba9157] focus:border-transparent"
                  disabled={!product.inStock}
                >
                  {[...Array(Math.min(10, product.stockCount || 0))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  product.inStock
                    ? 'bg-[#ba9157] text-white hover:bg-[#a67d4a]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Product Features</h3>
              <ul className="space-y-2 text-[#6b5d52]">
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Professional grade quality</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>FDA approved</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Long-lasting results</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Professional consultation available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
